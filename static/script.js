let count = 0;
let clickPower = 1;
let autoPower = 0;
let autoDelay = 5000;
let autoClickInterval;
let secondsLeft = 0;
let clicks = 0;
let startTime = Date.now();
let totalBids = 0;
let wonBids = 0;
let lostBids = 0;
let goldenCountdown;
let golden = false;
let moneyFromGolden = 0;
let totalMoneyFromGolden = 0;
let goldTimer = null;
let goldCountdownTimer = null;
let goldMultiplier = 1;
let shortenClicks = false;
let infoQueue = [];
let infoProcessing = false;
let goldRushes = 0;

let lowestAutoDelay = 300;

let userBid = -1;
let totPot = 0;

let bidInProgress = false;
let countdownInterval;

var online_people = 0;

let usedCodes = [];

let names = [];

let showUpgradeCount = false;

let hardMode = true;
let upgradeCostMultiplier = 1.4;

let criticalClickPercent = 0.001;

var playerName = "Anonymous";

var x = 0;
var y = 0;

var particleSpawnCount = 1;

var highScore = 0;

fetch('names.txt')
  .then(response => response.text())
  .then(data => {
    names = data.split('\n');
  });

const titleAnimationList = [
  "C",
  "Cl",
  "Cli",
  "Clic",
  "Click",
  "Clicke",
  "Clicker",
  "Clicker G",
  "Clicker Ga",
  "Clicker Gam",
  "Clicker Game"
];
let titleIndex = 0;
let finalTitleCount = 0;

const predefinedCodes = {
  'end_game': generateRandomCode(),
  'good_start': generateRandomCode(),
  'only_100': generateRandomCode(),
  'admin': 'iAmThe@dmin1234'
};

let upgrades = {
  "Auto Click_1": {
    amount: 1,
    cost: 100,
    id: "Auto Click_1",
    amountBought: 0
  },
  "Auto Click_5": {
    amount: 5,
    cost: 575,
    id: "Auto Click_5",
    amountBought: 0
  },
  "Auto Click_20": {
    amount: 20,
    cost: 1800,
    id: "Auto Click_20",
    amountBought: 0
  },
  "Auto Click_100": {
    amount: 100,
    cost: 9000,
    id: "Auto Click_100",
    amountBought: 0
  },
  "Auto Click_500": {
    amount: 500,
    cost: 45000,
    id: "Auto Click_500",
    amountBought: 0
  },
  "Auto Click_1000": {
    amount: 1000,
    cost: 90000,
    id: "Auto Click_1000",
    amountBought: 0
  },
  "Auto Click_5000": {
    amount: 5000,
    cost: 450000,
    id: "Auto Click_5000",
    amountBought: 0
  },
  "Auto Click_10000": {
    amount: 10000,
    cost: 900000,
    id: "Auto Click_10000",
    amountBought: 0
  },
  "Auto Delay_0.9": {
    amount: 0.9,
    cost: 2000,
    id: "Auto Delay_0.9",
    amountBought: 0
  },
  "Auto Delay_0.8": {
    amount: 0.8,
    cost: 5000,
    id: "Auto Delay_0.8",
    amountBought: 0
  },
  "Auto Delay_0.6": {
    amount: 0.6,
    cost: 15000,
    id: "Auto Delay_0.6",
    amountBought: 0
  },
  "Auto Delay_0.5": {
    amount: 0.5,
    cost: 35000,
    id: "Auto Delay_0.5",
    amountBought: 0
  },
  "Click Power_1": {
    amount: 1,
    cost: 15,
    id: "Click Power_1",
    amountBought: 0
  },
  "Click Power_5": {
    amount: 5,
    cost: 100,
    id: "Click Power_5",
    amountBought: 0
  },
  "Click Power_20": {
    amount: 20,
    cost: 500,
    id: "Click Power_20",
    amountBought: 0
  },
  "Click Power_100": {
    amount: 100,
    cost: 1200,
    id: "Click Power_100",
    amountBought: 0
  },
  "Click Power_500": {
    amount: 500,
    cost: 6000,
    id: "Click Power_500",
    amountBought: 0
  },
  "Click Power_1000": {
    amount: 1000,
    cost: 12000,
    id: "Click Power_1000",
    amountBought: 0
  },
  "Click Power_5000": {
    amount: 5000,
    cost: 60000,
    id: "Click Power_5000",
    amountBought: 0
  },
  "Click Power_10000": {
    amount: 10000,
    cost: 120000,
    id: "Click Power_10000",
    amountBought: 0
  },
  "Critical Click_0.001": {
    amount: 0.001,
    cost: 25000,
    id: "Critical Click_0.001",
    amountBought: 0
  },
  "Critical Click_0.005": {
    amount: 0.005,
    cost: 100000,
    id: "Critical Click_0.005",
    amountBought: 0
  },
  "Gold Rush Time_1.25": {
    amount: 1.25,
    cost: 10000,
    id: "Gold Rush Time_1.25",
    amountBought: 0
  },
  "Gold Rush Time_2": {
    amount: 2,
    cost: 50000,
    id: "Gold Rush Time_2",
    amountBought: 0
  }
};

const namePicker = document.getElementById('namePicker');

function generateRandomCode() {
  let code = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function updateTitle() {
  if (document.getElementById("title").innerText == "Clicker Game") {
    finalTitleCount += 1;
    if (finalTitleCount >= 10) {
      titleIndex = 0;
      finalTitleCount = 0;

      let title = titleAnimationList[titleIndex];

      document.getElementById("title").innerText = title;
    } else {
      document.getElementById("title").innerTet = "Clicker Game";
    }
  } else {
    titleIndex += 1;
    titleIndex %= titleAnimationList.length;
    let title = titleAnimationList[titleIndex];

    document.getElementById("title").innerText = title;
  }
}

function format(number) {
  var formattedNumber;
  if (shortenClicks) {
    if (number >= 1e12) {
      formattedNumber = (number / 1e12).toFixed(2) + "T";
    } else if (number >= 1e9) {
      formattedNumber = (number / 1e9).toFixed(2) + "B";
    } else if (number >= 1e6) {
      formattedNumber = (number / 1e6).toFixed(2) + "M";
    } else if (number >= 1e3) {
      formattedNumber = (number / 1e3).toFixed(2) + "K";
    } else {
      formattedNumber = number;
    }
  } else {
    formattedNumber = number.toLocaleString();
  }

  return formattedNumber;
}

function reverseFormat(formattedNumber) {
  if (formattedNumber.endsWith('T')) {
    return parseFloat(formattedNumber.slice(0, -1)) * 1e12;
  } else if (formattedNumber.endsWith('B')) {
    return parseFloat(formattedNumber.slice(0, -1)) * 1e9;
  } else if (formattedNumber.endsWith('M')) {
    return parseFloat(formattedNumber.slice(0, -1)) * 1e6;
  } else if (formattedNumber.endsWith('K')) {
    return parseFloat(formattedNumber.slice(0, -1)) * 1e3;
  } else {
    return parseFloat(formattedNumber.replace(/,/g, ''));
  }
}

function onMouseUpdate(e) {
  x = e.pageX;
  y = e.pageY;
}

function getMouseX() {
  return x;
}

function getMouseY() {
  return y;
}

function upgradeCriticalClick(upgrade, free) {
  if (free == null) {
    free = false;
  }

  if (criticalClickPercent >= 0.05 && !free) {
    displayInfo("Critical Click is already at max!");
    criticalClickPercent = 0.05;
    updateCriticalClickDisplay();
    return;
  } else if (criticalClickPercent >= 0.05 && free) {
    criticalClickPercent = 0.05;
    updateCriticalClickDisplay();
    return;
  }

  let cost = upgrades[upgrade].cost;
  if (free || updateMoney(-cost)) {
    criticalClickPercent += upgrades[upgrade].amount;
    if (criticalClickPercent > 0.05) {
      displayInfo("Critical Click is at max!");
      criticalClickPercent = 0.05;
    }

    updateCriticalClickDisplay();
    upgrades[upgrade].amountBought += 1;

    if (hardMode) {
      upgrades[upgrade].cost *= upgradeCostMultiplier;
      upgrades[upgrade].cost = Math.floor(upgrades[upgrade].cost);
      updateUpgradeDisplay()
    }
  }
}

function upgradeAuto(upgradeName, free) {
  if (free == null) {
    free = false;
  }

  let cost = upgrades[upgradeName].cost;
  if (free || updateMoney(-cost)) {
    autoPower += upgrades[upgradeName].amount;
    upgrades[upgradeName].amountBought += 1;
    updateAutoPowerDisplay();

    if (hardMode && !free) {
      upgrades[upgradeName].cost *= upgradeCostMultiplier;
      upgrades[upgradeName].cost = Math.floor(upgrades[upgradeName].cost);
      updateUpgradeDisplay()
    }
  }
}

function upgradeAutoDelay(upgradeName, free) {
  if (free == null || free == undefined) {
    free = false;
  }

  let cost = upgrades[upgradeName].cost;

  if (autoDelay <= lowestAutoDelay && !free) {
    autoDelay = lowestAutoDelay;
    updateAutoDelayDisplay();
    displayInfo("Auto Click Delay cannot be lower than " + lowestAutoDelay + "ms.");
    return;
  } else if (autoDelay <= lowestAutoDelay && free) {
    lowestAutoDelay = autoDelay * upgrades[upgradeName].amount;
  }

  if (free || updateMoney(-cost)) {
    autoDelay *= upgrades[upgradeName].amount;

    if (autoDelay <= lowestAutoDelay && !free) {
      autoDelay = lowestAutoDelay;
      updateAutoDelayDisplay();
      displayInfo("Auto Click Delay is at max upgrade!");
    } else if (autoDelay <= lowestAutoDelay && free) {
      lowestAutoDelay = autoDelay * upgrades[upgradeName].amount;
    }

    upgrades[upgradeName].cost = Math.floor(upgrades[upgradeName].cost);
    upgrades[upgradeName].amountBought += 1;
    updateAutoDelayDisplay();
    updateAutoClickInterval();

    if (hardMode && !free) {
      upgrades[upgradeName].cost *= upgradeCostMultiplier;
      upgrades[upgradeName].cost = Math.floor(upgrades[upgradeName].cost);
      updateUpgradeDisplay()
    }
  }
}

function upgradeClick(upgradeName, free) {
  if (free == null) {
    free = false;
  }

  let cost = upgrades[upgradeName].cost;
  if (free || updateMoney(-cost)) {
    clickPower += upgrades[upgradeName].amount;

    upgrades[upgradeName].amountBought += 1;

    if (hardMode) {
      upgrades[upgradeName].cost *= upgradeCostMultiplier;
      upgrades[upgradeName].cost = Math.floor(upgrades[upgradeName].cost);
      updateClickPowerDisplay();
      updateUpgradeDisplay();
    }
  }
}

function upgradeGoldRushTime(upgrade, free) {
  if (free == null) {
    free = false;
  }

  if (golden && !free) {
    displayInfo("You cannot buy this upgrade while gold rush is active.")
    return;
  }
  if (goldMultiplier >= 4 && !free) {
    displayInfo("Gold rush time multiplier cannot be more than 4.");
    return;
  }

  let cost = upgrades[upgrade].cost;
  let amount = upgrades[upgrade].amount;
  if (free || updateMoney(-cost)) {
    goldMultiplier *= amount;
    updateGoldRushDisplay();
    upgrades[upgrade].amountBought += 1;

    if (goldMultiplier > 4) {
      goldMultiplier = 4;
    }

    if (hardMode) {
      upgrades[upgrade].cost *= upgradeCostMultiplier;
      upgrades[upgrade].cost = Math.floor(upgrades[upgrade].cost);
      updateUpgradeDisplay()
    }
  }
}

function toggleEasyMode() {
  hardMode = !hardMode;
  resetGame();
}

function toggleUpgradeCount() {
  showUpgradeCount = !showUpgradeCount;
  updateUpgradeDisplay();
}

function updateUpgradeDisplay() {
  for (var key in upgrades) {
    let type = key.split("_")[0];

    if (showUpgradeCount) {
      document.getElementById(key).innerText = `$${format(upgrades[key].cost)}: Increase ${type} by ${upgrades[key].amount}, ${upgrades[key].amountBought} owned`;
    } else {
      document.getElementById(key).innerText = `$${format(upgrades[key].cost)}: Increase ${type} by ${upgrades[key].amount}`;
    }
  }
  updateUpgrades();
}

function updateMoney(amount) {
  const countElement = document.getElementById("count");
  if (golden && amount > 0) {
    amount *= 2;
    moneyFromGolden += amount;
    totalMoneyFromGolden += amount;
  }
  if (count + amount >= 0) {
    count += amount;
    countElement.innerText = format(count);

    if (!usedCodes.includes("iAmThe@dmin1234") && amount > 0) {
      if (count >= 9999999 && !usedCodes.includes("end_game")) {
        addCheatCode("End of game?");
        usedCodes.push("end_game");
      } else if (count >= 100000 && !usedCodes.includes("good_start")) {
        addCheatCode("Good Start!");
        usedCodes.push("good_start");
      } else if (count >= 100 && !usedCodes.includes("only_100")) {
        addCheatCode("Only 100?");
        usedCodes.push("only_100");
      }
    }
    updateUpgrades();
    checkForHighScoreUpdate();
    if (count > highScore && highScore != 0) {
      displayInfo(`You set a new high score of ${count}`, "green");
      updateHighScoreOnServer({ highscore: count, player: playerName });
      updateLocalHighScore(count, playerName);
    }

    return true;
  } else {
    countElement.classList.add("insufficient");
    return false;
  }
}

function addCheatCode(msg) {
  let code;
  if (msg === "Welcome, Admin.") {
    return;
  } else if (msg === "End of game?") {
    code = predefinedCodes.end_game;
  } else if (msg === "Good Start!") {
    code = predefinedCodes.good_start;
  } else if (msg === "Only 100?") {
    code = predefinedCodes.only_100;
  }

  let listElement = document.getElementById("cheatCodeList");
  let existingCodes = listElement.querySelectorAll("li");
  let alreadyExists = false;

  existingCodes.forEach(element => {
    if (element.textContent === code) {
      alreadyExists = true;
    }
  });

  if (!alreadyExists && code) {
    let liElement = document.createElement("li");
    liElement.textContent = code;
    listElement.appendChild(liElement);
    displayInfo("Cheat Code Added: " + code + ". " + msg);
  }
}

function buyRandomUpgrade() {
  const randomUpgrade = Object.keys(upgrades)[Math.floor(Math.random() * Object.keys(upgrades).length)];
  if (randomUpgrade.includes("Auto Click")) {
    upgradeAuto(randomUpgrade, true);
  } else if (randomUpgrade.includes("Auto Delay")) {
    upgradeAutoDelay(randomUpgrade, true);
  } else if (randomUpgrade.includes("Click Power")) {
    upgradeClick(randomUpgrade, true);
  } else if (randomUpgrade.includes("Critical Click")) {
    upgradeCriticalClick(randomUpgrade, true);
  } else {
    upgradeGoldRushTime(randomUpgrade, true);
  }
  displayInfo("Citical click! Bought " + randomUpgrade.replace("_", " "));
}

function createParticle(x, y, color) {
  if (color == null || color == undefined) {
    color = "9e9e9e"
  }

  const particle = document.createElement('div');
  particle.className = 'particle';
  document.body.appendChild(particle);

  const angle = Math.random() * 2 * Math.PI;
  const velocity = Math.random() * 50 + 50;
  const xVelocity = Math.cos(angle) * velocity;
  const yVelocity = Math.sin(angle) * velocity;

  particle.style.setProperty('--x', `${xVelocity}px`);
  particle.style.setProperty('--y', `${-yVelocity}px`);
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;

  particle.style.background = color;

  setTimeout(() => particle.remove(), 1000);
}

function onClick() {
  if (Math.random() < criticalClickPercent) {
    buyRandomUpgrade();
  }

  updateMoney(clickPower);
  clicks += 1
  document.getElementById("totalClicks").innerText = "Clicks: " + format(clicks);
}

function updateAutoDelayDisplay() {
  document.getElementById("auto-delay").innerText = `Auto Click Delay: ${format(Math.round(autoDelay))}ms`;
  document.getElementById("critical-percent").innerText = `Critical Percent: ${(criticalClickPercent * 100).toFixed(1)}%`;
  document.getElementById("gold-rush-multiplier").innerText = `Gold Rush Time: ${goldMultiplier.toFixed(2)}x`;
}

function updateAutoPowerDisplay() {
  document.getElementById("auto-power").innerText = `Auto Click: ${format(autoPower)}`;
}

function updateCriticalClickDisplay() {
  document.getElementById("critical-percent").innerText = `Critical Percent: ${(criticalClickPercent * 100).toFixed(1)}%`;
}

function updateGoldRushDisplay() {
  document.getElementById("gold-rush-multiplier").innerText = `Gold Rush Time: ${goldMultiplier.toFixed(2)}x`;
}

function updateClickPowerDisplay() {
  document.getElementById("click-power").innerText = `Click Power: ${format(clickPower)}`;
}

function toggleShop() {
  const shop = document.getElementById("shop");
  shop.classList.toggle("visible");
}

function toggleSettings() {
  const settings = document.getElementById("settings");
  settings.classList.toggle("visible");
}

function toggleBidding() {
  const bidding = document.getElementById("bid");
  if (bidInProgress) {
    displayInfo("You cannot leave a bid while it is in progress.");
    return;
  }
  bidding.classList.toggle("visible");

  const potInfoElement = document.getElementById("bidInfo");
  potInfoElement.style.display = bidding.classList.contains("visible") ? "block" : "none";
}

function closeShopAndSettings() {
  const shop = document.getElementById("shop");
  shop.classList.remove("visible");
  const settings = document.getElementById("settings");
  settings.classList.remove("visible");
}

function resetGame() {
  count = 0;
  clickPower = 1;
  autoPower = 0;
  autoDelay = 1000;
  usedCodes = [];
  updateMoney(0);
  updateAutoPowerDisplay();
  updateAutoDelayDisplay();
  updateClickPowerDisplay();
  updateCriticalClickDisplay();
  updateGoldRushDisplay();
  updateUpgrades();
  displayInfo("Game reset.");
  const listElement = document.getElementById("cheatCodeList");
  listElement.innerHTML = "";
  document.getElementById("count").innerText = count;
  updateAutoClickInterval();

  toggleSettings();
}

function updateAutoClickInterval() {
  if (autoClickInterval) {
    clearInterval(autoClickInterval);
  }
  autoClickInterval = setInterval(function() {
    if (autoPower > 0) {
      updateMoney(autoPower);
      document.getElementById("auto-power").classList.remove("active");
      document.getElementById("auto-power").classList.add("active");
      updateUpgrades();
    }
  }, autoDelay);
}

function updateUpgrades() {
  for (var key in upgrades) {
    if (count >= upgrades[key].cost) {
      document.getElementById(key).classList.remove("disabled");
    } else {
      document.getElementById(key).classList.add("disabled");
    }
  }
}

function nameSubmission() {
  const nameInput = document.getElementById("player-name-input");
  const newName = nameInput.value.trim();

  if (newName.length > 0 && newName.length <= 20) {
    playerName = newName;
    nameInput.value = "";
    displayInfo(`Username set to: ${playerName}`);
    nameInput.placeholder = "Current name: " + playerName;
    updateUserNameDisplay();
    updateMoney(0);
  } else {
    displayInfo("Invalid username. Please enter a name between 1 and 20 characters.");
  }
}

function codeSubmission() {
  let value = document.getElementById("code").value;

  if (value === predefinedCodes.end_game && !usedCodes.includes(value)) {
    updateMoney(count * count);
    autoPower *= 2;
    autoDelay *= 0.5;
    updateAutoDelayDisplay();
    updateAutoPowerDisplay();
    usedCodes.push(value);

    displayInfo("Auto Power multipled by 2 and auto delay halved.")

  } else if (value === predefinedCodes.good_start && !usedCodes.includes(value)) {
    autoPower *= 1.5;
    updateAutoPowerDisplay();
    usedCodes.push(value);

    displayInfo("Auto Power multipled by 1.5.")
  } else if (value === predefinedCodes.only_100 && !usedCodes.includes(value)) {
    updateMoney(count);
    usedCodes.push(value);

    displayInfo("Money doubled.")
  } else if (value === predefinedCodes.admin && !usedCodes.includes(value)) {
    addCheatCode("Welcome, Admin.", "blue");
    usedCodes.push(value);
    updateMoney(1000000);
    clickPower = 100000;
    autoPower = 100000;
    autoDelay = 0;
    updateAutoPowerDisplay();
    updateAutoDelayDisplay();
    updateClickPowerDisplay();
    updateUpgrades();
    displayInfo("Admin privileges granted.");
  } else {
    displayInfo("Invalid code.");
  }
  document.getElementById("code").value = "";
}

function displayInfo(info, color) {
  addLog(info); // Log either way
  infoQueue.push({ info, color });
  processInfoQueue();
}

function processInfoQueue() {
  if (infoProcessing || infoQueue.length === 0) return;

  infoProcessing = true;
  const { info, color } = infoQueue.shift();
  let infoElement = document.getElementById("infoBox");

  infoElement.textContent = info;
  if (color != null && color != undefined) {
    infoElement.style.backgroundColor = `${color}`;
  }

  infoElement.classList.add("visible");

  setTimeout(() => {
    infoElement.classList.remove("visible");
    setTimeout(() => {
      infoElement.style.backgroundColor = "#fff";
      infoProcessing = false;
      processInfoQueue();
    }, 500);
  }, 5000);
}

function addLog(msg) {
  let logElement = document.getElementById("logList");
  let liElement = document.createElement("li");
  liElement.innerText = msg;
  logElement.insertBefore(liElement, logElement.firstChild);
}

function sortUpgradesByType() {
  const autoPowerUpgrades = [];
  const autoDelayUpgrades = [];
  const clickerUpgrades = [];
  const goldRushUpgrades = [];
  const criticalUpgrades = [];

  for (const key in upgrades) {
    const upgrade = upgrades[key]

    if (key.includes("Auto Click")) {
      autoPowerUpgrades.push(upgrade);
    } else if (key.includes("Auto Delay")) {
      autoDelayUpgrades.push(upgrade);
    } else if (key.includes("Click Power")) {
      clickerUpgrades.push(upgrade);
    } else if (key.includes("Gold Rush")) {
      goldRushUpgrades.push(upgrade);
    } else {
      criticalUpgrades.push(upgrade);
    }
  }

  // Sort each type by cost
  autoPowerUpgrades.sort((a, b) => {
    const costA = parseInt(a.cost);
    const costB = parseInt(b.cost);
    return costA - costB;
  });
  goldRushUpgrades.sort((a, b) => {
    const costA = parseInt(a.cost);
    const costB = parseInt(b.cost);
    return costA - costB;
  });
  autoDelayUpgrades.sort((a, b) => {
    const costA = parseInt(a.cost);
    const costB = parseInt(b.cost);
    return costA - costB;
  });
  clickerUpgrades.sort((a, b) => {
    const costA = parseInt(a.cost);
    const costB = parseInt(b.cost);
    return costA - costB;
  });
  criticalUpgrades.sort((a, b) => {
    const costA = parseInt(a.cost);
    const costB = parseInt(b.cost);
    return costA - costB;
  });

  const shopElement = document.getElementById("shop");
  const autoPowerSection = document.createElement("div");
  autoPowerSection.innerHTML = "<h3 id='autoPowerHeader'>Auto Click Power</h3>";
  autoPowerUpgrades.forEach(upgrade => autoPowerSection.appendChild(document.getElementById(upgrade.id)));
  shopElement.appendChild(autoPowerSection);

  const autoDelaySection = document.createElement("div");
  autoDelaySection.innerHTML = "<h3 id='autoDelayHeader'>Auto Click Delay</h3>";
  autoDelayUpgrades.forEach(upgrade => autoDelaySection.appendChild(document.getElementById(upgrade.id)));
  shopElement.appendChild(autoDelaySection);

  const clickerSection = document.createElement("div");
  clickerSection.innerHTML = "<h3 id='clickPowerHeader'>Clicker Power</h3>";
  clickerUpgrades.forEach(upgrade => clickerSection.appendChild(document.getElementById(upgrade.id)));
  shopElement.appendChild(clickerSection);

  const goldRushSection = document.createElement("div");
  goldRushSection.innerHTML = "<h3 id='goldRushHeader'>Gold Rush</h3>";
  goldRushUpgrades.forEach(upgrade => goldRushSection.appendChild(document.getElementById(upgrade.id)));
  shopElement.appendChild(goldRushSection);

  const criticalSection = document.createElement("div");
  criticalSection.innerHTML = "<h3 id='criticalHeader'>Critical Percent</h3>";
  criticalUpgrades.forEach(upgrade => criticalSection.appendChild(document.getElementById(upgrade.id)));
  shopElement.appendChild(criticalSection);
}

function bidSubmission() {
  if (!bidInProgress) {
    document.getElementById("totalBids").innerText = "Total bids: " + format(totalBids);
    const bidAmount = reverseFormat(document.getElementById("bidAmount").value);

    if (!isNaN(bidAmount) && bidAmount > 0 && bidAmount <= count) {
      userBid = bidAmount;
      totPot += userBid;
      document.getElementById("bidInfo").innerText = `Pot: ${format(totPot)}, Chance: ${Math.round((userBid / totPot) * 100)}%, Bid: ${format(userBid)}`;
      document.getElementById("bidInfo").style.color = "green";
      document.getElementById("bidAmount").value = "";
      const bidsList = document.getElementById("bids");
      bidsList.innerHTML = "";
      const bidElement = document.createElement("li");
      bidElement.innerText = "You: " + format(bidAmount);
      bidsList.appendChild(bidElement);
      bidInProgress = true;
      let totalDelay = 0;
      while (true) {
        if (totalDelay < 30000) {
          const randomDelay = Math.floor(Math.random() * (15000 - 5000)) + 1;
          totalDelay += randomDelay;
          setTimeout(addBid, totalDelay);
        } else {
          break
        }
      }
      secondsLeft = 30;
      updateBidCountdownInterval();
      countdownInterval = setInterval(updateBidCountdownInterval, 1000);
    } else {
      displayInfo("Please enter a valid integer bid amount that is within your current balance.");
    }
  } else {
    displayInfo("A bid is already in progress.");
  }
}

function updateBidCountdownInterval() {
  let countdownElement = document.getElementById("countdown");
  if (secondsLeft > 0) {
    countdownElement.innerText = `Time Left: ${secondsLeft}s`;
    secondsLeft--;
  } else {
    clearInterval(countdownInterval);
    endBidding();
    countdownElement.innerText = `Time Left: 30s`;
  }
}

function endBidding() {
  bidInProgress = false;
  clearInterval(countdownInterval);
  const bidsList = document.getElementById("bids");
  const bids = bidsList.querySelectorAll("li");

  let winningNumber = Math.random() * totPot;

  if (winningNumber < userBid) {
    displayInfo(`You won the bid for ${format(totPot)} with a chance of ${Math.round((userBid / totPot) * 100)}%`);
    wonBids += 1;
    document.getElementById("wonBids").innerText = "Bids won: " + format(wonBids);
    updateMoney(totPot);
  } else {
    let bidIterationCount = 0;
    let winningBid = null;
    for (let i = 0; i < bids.length; i++) {
      let lowerNum = bidIterationCount;
      let bidAmount = reverseFormat(bids[i].innerText.split(":")[1]);
      let bidName = bids[i].innerText.split(":")[0];
      let upperNum = bidIterationCount + bidAmount;

      if (winningNumber >= lowerNum && winningNumber <= upperNum) {
        winningBid = { name: bidName, amount: bidAmount };
        break;
      }
      bidIterationCount += bidAmount;
    }

    if (winningBid) {
      if (winningBid.name == "You") {
        wonBids += 1;
        displayInfo(`${winningBid.name} win the bid with a bid of ${format(winningBid.amount)}!`);
      } else {
        lostBids += 1;
        displayInfo(`${winningBid.name} wins the bid with a bid of ${format(winningBid.amount)}!`);
      }
      document.getElementById("wonBids").innerText = "Bids won: " + format(wonBids);
      document.getElementById("lostBids").innerText = "Bids lost: " + format(lostBids);
      updateMoney(-userBid);
    } else {
      // If no winning bid is found, find the closest bid to the winningNumber
      let closestBidIndex = 0;
      let closestBidDifference = totPot;
      for (let i = 0; i < bids.length; i++) {
        let bidAmount = reverseFormat(bids[i].innerText.split(":")[1]);
        let difference = Math.abs(winningNumber - bidIterationCount);
        if (difference < closestBidDifference) {
          closestBidDifference = difference;
          closestBidIndex = i;
        }
        bidIterationCount += bidAmount;
      }
      let closestBidName = bids[closestBidIndex].innerText.split(":")[0];
      let closestBidAmount = parseInt(bids[closestBidIndex].innerText.split(":")[1]);
      if (closestBidName == "You") {
        displayInfo(`${closestBidName} win the bid with ${format(closestBidAmount)}!`);
      } else {
        displayInfo(`${closestBidName} wins the bid with ${format(closestBidAmount)}!`);
      }

      if (closestBidName == "You") {
        wonBids += 1;
      } else {
        lostBids += 1;
      }
      document.getElementById("lostBids").innerText = "Bids lost: " + format(lostBids);
      document.getElementById("wonBids").innerText = "Bids won: " + format(wonBids);

      updateMoney(-userBid);
    }
  }

  userBid = -1;
  totPot = 0;

  const countdownElement = document.getElementById("countdown");
  countdownElement.innerHTML = "0s"
  fetch('names.txt')
    .then(response => response.text())
    .then(data => {
      names = data.split('\n');
    });

  toggleBidding();

  bidsList.innerHTML = "";
  document.getElementById("bidInfo").innerText = "Pot: 0, Chance: 100%, Bid: 0"
  document.getElementById("bidInfo").style.color = "green";

  totalBids += 1
}

function addBid() {
  if (!bidInProgress) {
    return;
  }
  const bidsList = document.getElementById("bids");
  const bidElement = document.createElement("li");
  let upperRange = userBid * 0.8;
  let lowerRange = Math.floor(userBid * 0.6);

  if (lowerRange < 1) {
    lowerRange = 1;
  }

  let bidAmount = Math.floor(Math.random() * (upperRange - lowerRange) + lowerRange);

  while (!Number.isInteger(bidAmount)) {
    bidAmount = Math.floor(Math.random() * (upperRange - lowerRange) + lowerRange);
  }

  if (bidAmount < 1) {
    bidAmount = 1;
  }

  const randomName = names[Math.floor(Math.random() * names.length)];
  names.splice(names.indexOf(randomName), 1)
  bidElement.innerText = `${randomName}: ${format(bidAmount)}`;
  bidsList.appendChild(bidElement);
  totPot += bidAmount;
  let winChance = Math.round((userBid / totPot) * 100);
  let bidInfoElement = document.getElementById("bidInfo");
  let colorPercent = 100;
  let color = "red";
  if (winChance > 50) {
    colorPercent = Math.round((winChance - 50) / 50 * 100);
  } else if (winChance < 50) {
    colorPercent = Math.round((50 - winChance) / 50 * 100);
  } else {
    colorPercent = 0;
  }

  if (winChance < 50) {
    color = "red";
  } else {
    color = "green";
  }

  let green = 0;
  let red = 0;

  if (color == "green") {
    green = Math.round(255 * (colorPercent / 100));
  } else {
    red = Math.round(255 * (colorPercent / 100));
  }
  let blue = 0

  bidInfoElement.style.color = `rgb(${red}, ${green}, ${blue})`;

  document.getElementById("bidInfo").innerText = `Pot: ${format(totPot)}, Chance: ${winChance}%, Bid: ${format(userBid)}`;
}

function scrollToCategory(category) {
  const targetElement = document.getElementById(category);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
}

function toggleLog() {
  const logElement = document.getElementById("logs");
  logElement.classList.toggle("visible");
}

function toggleInfoBoxes() {
  const infoBoxes = document.getElementById("infoZone");
  infoBoxes.classList.toggle("visible");
  if (infoBoxes.classList.contains("visible")) {
    infoBoxes.scrollTop = 0;
    updatePlayTime();
    updateGoldRushDisplayInfo();
    updateGoldCountdownInfo();
    timeInterval = setInterval(updatePlayTime, 1000);
  } else {
    clearInterval(timeInterval);
  }
}

function updatePlayTime() {
  let playTime = Date.now() - startTime;
  let minutes = Math.floor(playTime / (1000 * 60));
  let seconds = Math.floor((playTime % (1000 * 60)) / 1000);
  document.getElementById("timePlayed").innerText = `Time Played: ${minutes}m ${seconds}s`;
}

function updateGoldTimer() {
  if (golden) {
    document.getElementById("goldenCountdown").innerText = `Gold Rush Is Active!`;

    if (goldTimer > 0) {
      let goldTimerMinutes = Math.floor(goldTimer / (1000 * 60));
      let goldTimerSeconds = Math.floor((goldTimer % (1000 * 60)) / 1000);
      document.getElementById("goldTimer").innerText = `Gold Rush Timer: ${goldTimerMinutes}m ${goldTimerSeconds}s`;
      goldTimer -= 10;

      createParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, "gold");
    }
  } else {
    document.getElementById("goldTimer").innerText = "";
  }
}

function toggleShorten() {
  shortenClicks = !shortenClicks;
  updateMoney(0);
  updateUpgradeDisplay();
}

function startGoldenCountdown() {
  if (goldCountdownTimer) clearInterval(goldCountdownTimer);

  const delay = Math.floor(Math.random() * (300000 - 60000)) + 60000;
  // const delay = 3000;
  let timeLeft = delay;

  const updateCountdown = () => {
    if (timeLeft <= 0) {
      clearInterval(goldCountdownTimer);
      startGolden();
    } else {
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);
      document.getElementById("goldenCountdown").innerText = `Gold Rush Countdown: ${minutes}m ${seconds}s`;
      timeLeft -= 1000;
    }
  };

  goldCountdownTimer = setInterval(updateCountdown, 1000);
  updateCountdown();
}

function startGolden() {
  golden = true;
  const duration = 15000 * goldMultiplier;
  let timeLeft = duration;

  displayInfo("Gold rush started! All money gains are doubled!");
  document.getElementById("count").classList.add("gold");

  const updateTimer = () => {
    if (timeLeft <= 0) {
      endGolden();
    } else {
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);
      document.getElementById("goldTimer").innerText = `Gold Rush Timer: ${minutes}m ${seconds}s`;
      createParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, "gold");
      timeLeft -= 100;
    }
  };

  if (goldTimer) clearInterval(goldTimer);
  goldTimer = setInterval(updateTimer, 100);
  updateTimer();
}

function updateGoldRushDisplayInfo() {
  if (goldRushes == 0) {
    document.getElementById("moneyFromGolden").innerText = "No gold rushes yet!";
  } else if (goldRushes == 1) {
    document.getElementById("moneyFromGolden").innerText = "You got " + totalMoneyFromGolden + " from the gold rush!";
  } else {
    document.getElementById("moneyFromGolden").innerText = "You got " + totalMoneyFromGolden + " from the gold rushes!";
  }
}

function endGolden() {
  if (goldTimer) clearInterval(goldTimer);

  golden = false;
  displayInfo("Gold rush ended! You earned " + format(moneyFromGolden) + " bonus money!");

  totalMoneyFromGolden += moneyFromGolden;
  goldRushes += 1;
  moneyFromGolden = 0;

  document.getElementById("count").classList.remove("gold");
  document.getElementById("goldTimer").innerText = "";
  updateGoldRushDisplayInfo();

  startGoldenCountdown();
}

function saveGameData() {
  const gameData = {
    count: count,
    clickPower: clickPower,
    autoPower: autoPower,
    autoDelay: autoDelay,
    clicks: clicks,
    totalBids: totalBids,
    wonBids: wonBids,
    lostBids: lostBids,
    moneyFromGolden: totalMoneyFromGolden,
    goldRushes: goldRushes,
    shortenClicks: shortenClicks,
    goldIncPercent: goldMultiplier,
    usedCodes: usedCodes,
    hardMode: hardMode,
    upgrades: upgrades,
    particleSpawnCount: particleSpawnCount,
    criticalClickPercent: criticalClickPercent,
    golden: false,
    goldTimer: 0,
    startTime: startTime,
    goldenCountdown: goldenCountdown,
    lowestAutoDelay: lowestAutoDelay,
    showUpgradeCount: showUpgradeCount,
    upgradeCostMultiplier: upgradeCostMultiplier,
    playerName: playerName
  };
  localStorage.setItem('clickerGameData', JSON.stringify(gameData));
}

function loadGameData() {
  const savedData = localStorage.getItem('clickerGameData');
  if (savedData) {
    const gameData = JSON.parse(savedData);
    count = gameData.count;
    clickPower = gameData.clickPower;
    autoPower = gameData.autoPower;
    autoDelay = gameData.autoDelay;
    clicks = gameData.clicks;
    totalBids = gameData.totalBids;
    wonBids = gameData.wonBids;
    lostBids = gameData.lostBids;
    totalMoneyFromGolden = gameData.moneyFromGolden;
    goldRushes = gameData.goldRushes;
    shortenClicks = gameData.shortenClicks;
    goldMultiplier = gameData.goldIncPercent;
    usedCodes = gameData.usedCodes;
    hardMode = gameData.hardMode;
    upgrades = gameData.upgrades;
    criticalClickPercent = gameData.criticalClickPercent;
    particleSpawnCount = gameData.particleSpawnCount;
    golden = gameData.golden;
    goldTimer = gameData.goldTimer;
    startTime = gameData.startTime;
    goldenCountdown = gameData.goldenCountdown;
    lowestAutoDelay = gameData.lowestAutoDelay;
    showUpgradeCount = gameData.showUpgradeCount;
    upgradeCostMultiplier = gameData.upgradeCostMultiplier;
    playerName = gameData.playerName || "Anonymous";

    if (playerName != "Anonymous") {
      let nameInput = document.getElementById("player-name-input");
      nameInput.placeholder = "Current name: " + playerName;
    }

    // Update UI elements
    document.getElementById("particleCountSlider").value = particleSpawnCount;
    document.getElementById("particleCount").innerText = "Particle Count: " + particleSpawnCount;
    document.getElementById("upgrade-count").checked = showUpgradeCount;

    // Update displays
    updateMoney(0);
    updateAutoPowerDisplay();
    updateAutoDelayDisplay();
    updateClickPowerDisplay();
    updateCriticalClickDisplay();
    updateGoldRushDisplay();
    updateUpgrades();
    updateUpgradeDisplay();
    updateAutoClickInterval();

    updateUserNameDisplay();

    // Update stats
    document.getElementById("totalClicks").innerText = "Clicks: " + format(clicks);
    document.getElementById("totalBids").innerText = "Total bids: " + format(totalBids);
    document.getElementById("wonBids").innerText = "Bids won: " + format(wonBids);
    document.getElementById("lostBids").innerText = "Bids lost: " + format(lostBids);

    // Update gold rush state
    updateGoldRushDisplayInfo();
    // displayInfo("Game data loaded successfully.");

    // Update checkboxes
    document.getElementById("easyMode").checked = !hardMode;
    document.getElementById("shorten").checked = shortenClicks;
  } else {
    displayInfo("Game data load failed.");
  }
}

function mouseDown(e) {
  for (let i = 0; i < particleSpawnCount; i++) {
    createParticle(e.clientX, e.clientY);
  }
}

// Terminal functionality
function toggleTerminal() {
  const terminal = document.getElementById("terminal");
  terminal.classList.toggle("visible");
  if (terminal.classList.contains("visible")) {
    document.getElementById("terminal-input").focus();
  }
}

let hackingProgress = {
  level: 1,
  attempts: 0,
  sequence: [],
  targetSequence: [],
  isHacking: false,
  countdown: null,
  hackingCountdownInterval: null,
  frozen: false,
  vulnerabilities: [
    "FTP Access",
    "Database"
  ],
  exploits: [],
  usedExploits: [],
  wd: "null",
  fileSystem: [],
  homedir: "null",
  maxTime: 50,
  scanning: false,
  scannedFiles: [],
  vitalFile: null
};

function resetHack() {
  hackingProgress = {
    level: 1,
    attempts: 0,
    sequence: [],
    targetSequence: [],
    isHacking: false,
    countdown: null,
    hackingCountdownInterval: null,
    frozen: false,
    vulnerabilities: [
      "FTP Access",
      "Database"
    ],
    exploits: [],
    usedExploits: [],
    wd: "null",
    fileSystem: [],
    homedir: "null",
    maxTime: 50,
    scanning: false,
    scannedFiles: [],
    vitalFile: null
  };
  clearInterval(hackingProgress.hackingCountdownInterval);
  document.getElementById("terminal-output").innerHTML += "Hack reset.\n";
  document.getElementById("terminal-input").value = "";
  document.getElementById("terminal-input").focus();
}

function generateRandomFileSystem() {
  fileSystem = [];
  for (let i = 0; i < Math.floor(Math.random() * 5) + 3; i++) {
    fileSystem.push(Math.random().toString(36).substring(2, 7));
  }

  return fileSystem;
}

const commands = {
  help: "Available commands:\nhelp - Show this help\nclear - Clear terminal\nhack <level> - Start hacking (levels 1-5)\nbypass - Execute bypass sequence\nstats - Show game stats\nexit - Close terminal",

  check: () => {
    if (hackingProgress.isHacking && hackingProgress.wd != null && hackingProgress.fileSystem != [] && hackingProgress.wd != null) {
      if (hackingProgress.wd == hackingProgress.vitalFile) {
        document.getElementById("terminal-output").innerHTML += "Vital file found.\n"
        updateMoney(count * 3);
        resetHack();
      } else {
        document.getElementById("terminal-output").innerHTML += "File contains no vital information.\n"
      }
    } else {
      document.getElementById("terminal-output").innerHTML += `ERROR: No server connection established.\n`;
    }
  },

  stats: () => `Money: ${format(count)}\nClick Power: ${format(clickPower)}\nAuto Power: ${format(autoPower)}`,

  ls: () => {
    if (hackingProgress.isHacking && hackingProgress.wd != null && hackingProgress.fileSystem != []) {
      output = ""
      for (let i = 0; i < fileSystem.length; i++) {
        filePath = "";
        if (fileSystem[i] == hackingProgress.wd) {
          filePath += "W"
        }

        if (fileSystem[i] == hackingProgress.homedir) {
          filePath += "H"
        }

        filePath += " - " + fileSystem[i] + "\n";
        output += filePath;
      }
      document.getElementById("terminal-output").innerHTML += output;
    } else {
      document.getElementById("terminal-output").innerHTML += `ERROR: No server connection established.\n`;
    }
  },

  cd: (path) => {
    if (hackingProgress.isHacking && hackingProgress.wd != null && hackingProgress.fileSystem != []) {
      if (path == ".." || path == "~") {
        hackingProgress.wd = hackingProgress.homedir;
      } else {
        if (hackingProgress.fileSystem.includes(path)) {
          hackingProgress.wd = path;
          commands.ls();
        } else {
          document.getElementById("terminal-output").innerHTML += `No such directory: ${path}.\n`;
        }
      }
    } else {
      document.getElementById("terminal-output").innerHTML += `ERROR: No server connection established.\n`;
    }
  },

  pwd: () => {
    if (hackingProgress.isHacking && hackingProgress.wd != null && hackingProgress.fileSystem != []) {
      document.getElementById("terminal-output").innerHTML += `Current working directory: ${hackingProgress.wd}\n`
    } else {
      document.getElementById("terminal-output").innerHTML += `ERROR: No server connection established.\n`;
    }
  },

  simulateDatabaseHack: () => {
    hackingProgress.fileSystem = generateRandomFileSystem();

    hackingProgress.homedir = hackingProgress.fileSystem[Math.floor(Math.random() * hackingProgress.fileSystem.length)];
    hackingProgress.wd = hackingProgress.homedir;
    hackingProgress.vitalFile = hackingProgress.fileSystem[Math.floor(Math.random() * hackingProgress.fileSystem.length)]
  },

  scan: () => {
    if (!hackingProgress.isHacking) {
      document.getElementById("terminal-output").innerHTML += `Scan cannot be intiated. No hack active.\n`;
    } else {
      if (hackingProgress.scanning) {
        document.getElementById("terminal-output").innerHTML += `Scan already in progress.\n`;
      } else {
        hackingProgress.scanning = true;
        setTimeout(() => {
          hackingProgress.scanning = false;

          if (Math.random() < 0.5) {
            const vulnerability = hackingProgress.vulnerabilities[Math.floor(Math.random() * hackingProgress.vulnerabilities.length)];
            document.getElementById("terminal-output").innerHTML += `Vulnerability found: ${vulnerability}\n`;

            if (!hackingProgress.exploits.includes(vulnerability)) {
              hackingProgress.exploits.push(vulnerability);
            }
          } else {
            document.getElementById("terminal-output").innerHTML += `Error in scan.\n`;
          }
        }, Math.random() * (5000 - 500) + 500);
        document.getElementById("terminal-output").innerHTML += `Scanning for vulnerabilities...\n`;
      }
    }
  },

  exploit: (vulnerability) => {
    if (vulnerability == "database" && hackingProgress.exploits.includes("Database") && !hackingProgress.usedExploits.includes("Database")) {
      hackingProgress.usedExploits.push("Database");

      document.getElementById("terminal-output").innerHTML += "Database hacked. Accsessing server files.";
      commands.simulateDatabaseHack();
    } else if (vulnerability == "ftp_access" && hackingProgress.exploits.includes("FTP Access")) {
      document.getElementById("terminal-output").innerHTML += "FTP exploited. Login timer stopped.\nCountdown frozen!\n";
      hackingProgress.frozen = true;
    } else {
      document.getElementById("terminal-output").innerHTML += "Exploit failed. Invalid arguments.\n";
    }
  },

  reward: () => {
    if (hackingProgress.level == 1) {
      updateMoney(count * 1.15);
    } else if (hackingProgress.level == 2) {
      updateMoney(count * 1.2);
    } else if (hackingProgress.level == 3) {
      updateMoney(count * 1.25);
    } else if (hackingProgress.level == 4) {
      updateMoney(count * 1.3);
    } else if (hackingProgress.level == 5) {
      updateMoney(count * 1.35);
    } else {
      document.getElementById("terminal-output").innerHTML += "ERROR: Invalid hacking level.\n";
      return;
    }
    document.getElementById("terminal-output").innerHTML += `Reward granted: ${format(count * (0.15 + 0.05 * hackingProgress.level))}\n`;
    resetHack();
  },

  hack: (level) => {
    if (hackingProgress.isHacking) return "ERROR: Hacking already in progress!";

    level = parseInt(level) || 1;
    if (level < 1 || level > 5) return "ERROR: Invalid level (1-5)";

    hackingProgress.level = level;
    hackingProgress.attempts = 0;
    hackingProgress.sequence = [];
    hackingProgress.targetSequence = [];
    hackingProgress.isHacking = true;
    hackingProgress.countdown = hackingProgress.maxTime - level;

    for (let i = 0; i < level + 2; i++) {
      hackingProgress.targetSequence.push(Math.floor(Math.random() * 9) + 1);
    }

    setTimeout(() => {
      document.getElementById("terminal-output").innerHTML += commands.hackingTimeout();
    }, (hackingProgress.maxTime - level) * 1000);

    interval = setInterval(() => {
      if (hackingProgress.isHacking && !hackingProgress.frozen) {
        hackingProgress.countdown -= 1;
      } else if (hackingProgress.isHacking && hackingProgress.frozen) {
        document.getElementById("terminal-output").innerHTML += `Countdown frozen!\n`;
      }
    }, 1000)

    hackingProgress.hackingCountdownInterval = interval;

    return `INITIATING LEVEL ${level} HACK...\nEnter 'bypass' followed by ${level + 2} numbers (1-9)\nExample: bypass ${Array(level + 2).fill('X').join(' ')}\nTime limit: ${hackingProgress.maxTime - level} seconds`;
  },

  hackingTimeout: () => {
    clearInterval(hackingProgress.hackingCountdownInterval);
    hackingProgress.hackingCountdownInterval = null;
    hackingProgress.isHacking = false;

    hackingProgress.fileSystem = [];
    return "HACK FAILED: Time limit exceeded!\n";
  },

  bypass: (input) => {
    if (!hackingProgress.isHacking) return "ERROR: No hack in progress. Use 'hack' command first.";

    const numbers = input.match(/\d/g);
    if (!numbers || numbers.length !== hackingProgress.targetSequence.length) {
      return "ERROR: Invalid bypass sequence";
    }

    const countdown = hackingProgress.countdown;

    if (countdown <= 0) {
      hackingProgress.isHacking = false;
      clearInterval(hackingProgress.hackingCountdownInterval);
      hackingProgress.hackingCountdownInterval = null;
      return "[ERROR]: Time limit exceeded! Start another hack.";
    }

    const sequence = numbers.map(n => parseInt(n));
    const matches = sequence.filter((num, i) => num === hackingProgress.targetSequence[i]).length;
    const binaryMatches = sequence.map((num, i) => num === hackingProgress.targetSequence[i] ? 1 : 0);
    hackingProgress.attempts++;

    if (matches === hackingProgress.targetSequence.length) {
      const reward = Math.floor(count * (0.05 * hackingProgress.level));
      hackingProgress.isHacking = false;
      updateMoney(reward);
      return `HACK SUCCESSFUL!\nTime: ${countdown.toFixed(2)}s\nReward: ${format(reward)}`;
    } else {
      return `SEQUENCE FAILED\nMatched digits: ${matches}\nBinary Matches: ${binaryMatches.join(' ')}`;
    }
  }
};

function updateUserNameDisplay() {
  const userNameElement = document.getElementById("username");
  if (playerName) {
    userNameElement.innerText = `Username: ${playerName}`;
  } else {
    userNameElement.innerText = "Username: Anonymous";
  }
}

function updateHighScoreOnServer(data) {
  fetch('/set-highscore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      password: 'th1s1smyp@ssw0rd',
      highscore: data.highscore,
      player: data.player
    })
  }).then(res => res.json())
    .then(res => {
      updateLocalHighScore(data.highscore, data.player);
    });
}

function processCommand(input) {
  const terminal = document.getElementById("terminal-output");
  const [cmd, ...args] = input.toLowerCase().trim().split(' ');

  terminal.innerHTML += `\n> ${input}\n`;

  if (cmd === "clear") {
    terminal.innerHTML = "";
  } else if (cmd === "exit") {
    terminal.innerHTML = "";
    toggleTerminal();
  } else if (cmd === "hack") {
    terminal.innerHTML += commands.hack(args[0]) + "\n";
  } else if (cmd === "bypass") {
    terminal.innerHTML += commands.bypass(args.join(' ')) + "\n";
  } else if (cmd == "cd") {
    commands.cd(args[0]);
  } else if (cmd === "exploit") {
    commands.exploit(args[0]);
  } else if (commands[cmd]) {
    if (typeof commands[cmd] === "function") {
      commands[cmd]()
    }
  } else {
    terminal.innerHTML += "Command not recognized. Type 'help' for available commands.\n";
  }

  document.getElementById("terminal-input").value = "";

  document.getElementById("terminal").scrollTop = document.getElementById("terminal").scrollHeight;
}

function updateOnlinePeopleDisplay(newCount) {
  online_people = newCount;  // update global variable
  const onlineElement = document.getElementById("online-people");
  onlineElement.innerText = `${online_people}`;
}

function updateLocalHighScore(newHighScore, player) {
  highScore = newHighScore;
  highScoreElement = document.getElementById("high-score");
  highScoreElement.innerText = format(highScore);
}

function checkForHighScoreUpdate() {
  fetch('/get-highscore')
    .then(res => res.json())
    .then(data => {
      if (data.highscore > highScore) {
        if (highScore > 0) {
          displayInfo(`New high score! ${data.player} set a new high score of ${format(data.highscore)}!`, "yellow");
        }
        updateLocalHighScore(data.highscore, data.player);
      }
    })
    .catch(err => console.error("Error fetching high score:", err));
}

function checkForPlayerUpdate() {
  fetch('/get-online-count')
    .then(res => res.json())
    .then(data => {
      online_people = data.people_online || 0;
      updateOnlinePeopleDisplay(online_people);
    })
    .catch(err => console.error("Error fetching online people:", err));
}

function checkForServerUpdates() {
  checkForHighScoreUpdate();
  checkForPlayerUpdate();
}

document.getElementById("count").addEventListener("animationend", function() {
  this.classList.remove("insufficient");
});

document.getElementById("auto-power").addEventListener("animationend", function() {
  this.classList.remove("active");
});

document.getElementById("particleCountSlider").addEventListener("input", function() {
  particleSpawnCount = parseInt(this.value);
  document.getElementById("particleCount").innerText = "Particles: " + particleSpawnCount;
});

document.addEventListener('mousemove', onMouseUpdate);
document.addEventListener('mousedown', mouseDown);

window.addEventListener('load', () => {
  fetch('/add-player', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'th1s1smyp@ssw0rd' })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'ok') {
      console.log('Player added successfully!');
      // Immediately increment and display
      updateOnlinePeopleDisplay(online_people + 1);
    } else {
      console.error('Error:', data);
    }
  })
  .catch(error => {
    console.error('Request failed:', error);
  });
  loadGameData();
});

window.addEventListener('beforeunload', () => {
  saveGameData();

  fetch('/remove-player', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'th1s1smyp@ssw0rd' })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'ok') {
      console.log('Player removed successfully!');
      updateOnlinePeopleDisplay(Math.max(online_people - 1, 0));
    } else {
      console.error('Error:', data);
    }
  })
  .catch(error => {
    console.error('Request failed:', error);
  });
});

setInterval(() => {
  fetch('/heartbeat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'th1s1smyp@ssw0rd' })
  });
}, 10000);

setInterval(updateTitle, 500);

setInterval(checkForServerUpdates, 1000);
checkForServerUpdates();
updateMoney(0);
updateAutoPowerDisplay();
updateCriticalClickDisplay()
updateGoldRushDisplay();
updateAutoDelayDisplay();
updateClickPowerDisplay();
updateAutoClickInterval();
updateUpgrades();
updateUpgradeDisplay();
sortUpgradesByType();
startGoldenCountdown();
updateUserNameDisplay();