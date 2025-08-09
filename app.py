from flask import Flask, request, jsonify, send_from_directory
import json
import os
import time
import threading
import logging
from threading import Lock

app = Flask(__name__, static_url_path='', static_folder='static')

DATA_FILE = 'Clicker\static\data.json'
PASSWORD = 'th1s1smyp@ssw0rd'

# Keep track of players' last heartbeat time in memory
last_seen = {}
last_seen_lock = Lock()  # Lock for thread safety
HEARTBEAT_TIMEOUT = 30  # seconds

logging.basicConfig(level=logging.INFO)  # Configure logging

def load_data_file():
    """Load JSON data from file with error handling."""
    if not os.path.exists(DATA_FILE):
        logging.error(f"Data file {DATA_FILE} does not exist.")
        return None
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        logging.error(f"Failed to load data file: {e}")
        return None

def save_data_file(data):
    """Save JSON data to file with error handling."""
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        return True
    except IOError as e:
        logging.error(f"Failed to save data file: {e}")
        return False 

@app.route('/')
def serve_game():
    return send_from_directory('static', 'index.html')

@app.route('/get-highscore', methods=['GET'])
def get_score():
    data = load_data_file()
    if not data:
        return jsonify({'error': 'Data file unavailable'}), 500

    highscore = data.get('clicker', {}).get('highscore', 0)
    player = data.get('clicker', {}).get('player', 'Unknown')
    return jsonify({'highscore': highscore, 'player': player})

@app.route('/set-highscore', methods=['POST'])
def set_score():
    data = request.json
    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400
    if data.get('password') != PASSWORD:
        return jsonify({'error': 'Unauthorized'}), 401

    # Validate required fields
    if 'highscore' not in data or 'player' not in data:
        return jsonify({'error': 'Missing highscore or player'}), 400

    file_data = load_data_file()
    if file_data is None:
        return jsonify({'error': 'Data file unavailable'}), 500

    # Defensive: create keys if missing
    if 'clicker' not in file_data or not isinstance(file_data['clicker'], dict):
        file_data['clicker'] = {}

    file_data['clicker']['highscore'] = data['highscore']
    file_data['clicker']['player'] = data['player']

    if not save_data_file(file_data):
        return jsonify({'error': 'Failed to save data'}), 500

    return jsonify({'status': 'ok'})

@app.route('/add-player', methods=['POST'])
def add_player():
    data = request.json
    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400
    if data.get('password') != PASSWORD:
        return jsonify({'error': 'Unauthorized'}), 401

    file_data = load_data_file()
    if file_data is None:
        return jsonify({'error': 'Data file unavailable'}), 500

    # Defensive: safely increment people_online
    try:
        people_online = file_data.get('general', {}).get('data', {}).get('people_online', 0)
    except Exception:
        people_online = 0

    # Make sure keys exist to assign
    if 'general' not in file_data or not isinstance(file_data['general'], dict):
        file_data['general'] = {}
    if 'data' not in file_data['general'] or not isinstance(file_data['general']['data'], dict):
        file_data['general']['data'] = {}

    file_data['general']['data']['people_online'] = people_online + 1

    if not save_data_file(file_data):
        return jsonify({'error': 'Failed to save data'}), 500

    # Store heartbeat timestamp in a thread-safe manner
    with last_seen_lock:
        last_seen[request.remote_addr] = time.time()

    return jsonify({'status': 'ok'})

@app.route('/remove-player', methods=['POST'])
def remove_player():
    data = request.json
    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400
    if data.get('password') != PASSWORD:
        return jsonify({'error': 'Unauthorized'}), 401

    # Remove heartbeat safely
    with last_seen_lock:
        last_seen.pop(request.remote_addr, None)

    file_data = load_data_file()
    if file_data is None:
        return jsonify({'error': 'Data file unavailable'}), 500

    # Defensive decrement of people_online
    people_online = file_data.get('general', {}).get('data', {}).get('people_online', 0)
    people_online = max(people_online - 1, 0)

    # Ensure keys exist before setting
    if 'general' not in file_data or not isinstance(file_data['general'], dict):
        file_data['general'] = {}
    if 'data' not in file_data['general'] or not isinstance(file_data['general']['data'], dict):
        file_data['general']['data'] = {}

    file_data['general']['data']['people_online'] = people_online

    if not save_data_file(file_data):
        return jsonify({'error': 'Failed to save data'}), 500

    return jsonify({'status': 'ok'})

@app.route('/heartbeat', methods=['POST'])
def heartbeat():
    data = request.json
    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400
    if data.get('password') != PASSWORD:
        return jsonify({'error': 'Unauthorized'}), 401

    with last_seen_lock:
        last_seen[request.remote_addr] = time.time()

    return jsonify({'status': 'ok'})

@app.route('/get-online-count', methods=['GET'])
def get_online_count():
    data = load_data_file()
    if data is None:
        return jsonify({'error': 'Data file unavailable'}), 500

    try:
        people_online = data.get('general', {}).get('data', {}).get('people_online', 0)
    except Exception:
        people_online = 0

    return jsonify({'people_online': people_online})

def cleanup_dead_players():
    while True:
        now = time.time()
        to_remove = []

        with last_seen_lock:
            for ip, last in list(last_seen.items()):
                if now - last > HEARTBEAT_TIMEOUT:
                    to_remove.append(ip)

            if to_remove:
                file_data = load_data_file()
                if file_data:
                    try:
                        people_online = file_data.get('general', {}).get('data', {}).get('people_online', 0)
                        people_online = max(people_online - len(to_remove), 0)
                        if 'general' not in file_data or not isinstance(file_data['general'], dict):
                            file_data['general'] = {}
                        if 'data' not in file_data['general'] or not isinstance(file_data['general']['data'], dict):
                            file_data['general']['data'] = {}

                        file_data['general']['data']['people_online'] = people_online
                        save_data_file(file_data)
                    except Exception as e:
                        logging.error(f"Error updating people_online in cleanup: {e}")

                for ip in to_remove:
                    last_seen.pop(ip, None)

        time.sleep(5)

# Start cleanup thread
threading.Thread(target=cleanup_dead_players, daemon=True).start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
