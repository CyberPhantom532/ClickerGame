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
var goldenCountdown;
let golden = false;
let moneyFromGolden = 0;
let totalMondeyFromGolden = 0;
let goldRushes = 0;
let shortenClicks = false;
let goldTimer = 0;
var goldInfoInterval;

let goldIncPercent = 1;

let stage = 0;

let userBid = -1;
let totPot = 0;

let bidInProgress = false;
let countdownInterval;

let usedCodes = [];

let names = [];

let hardMode = true;

let upgradeCostMultiplier = 1.4;

fetch('names.txt')
.then(response => response.text())
.then(data => {
  names = data.split('\n');
});

let upgrades = {
  "Click Power_1": {
    amount: 1,
    cost: 10,
    id: "Click Power_1",
    amountBought: 0
  },
  "Click Power_5": {
    amount: 5,
    cost: 25,
    id: "Click Power_5",
    amountBought: 0
  },
  "Click Power_20": {
    amount: 20,
    cost: 100,
    id: "Click Power_20",
    amountBought: 0
  },
  "Auto Click_1": {
    amount: 1,
    cost: 50,
    id: "Auto Click_1",
    amountBought: 0
  },
  "Auto Click_5": {
    amount: 5,
    cost: 100,
    id: "Auto Click_5",
    amountBought: 0
  },
  "Auto Click_20": {
    amount: 20,
    cost: 500,
    id: "Auto Click_20",
    amountBought: 0
  },
  "Auto Delay_0.9": {
    amount: 0.9,
    cost: 1000,
    id: "Auto Delay_0.9",
    amountBought: 0
  },
  "Auto Delay_0.8": {
    amount: 0.8,
    cost: 2000,
    id: "Auto Delay_0.8",
    amountBought: 0
  },
  "Auto Delay_0.6": {
    amount: 0.6,
    cost: 10000,
    id: "Auto Delay_0.6",
    amountBought: 0
  },
  "Click Power_100": {
    amount: 100,
    cost: 10000,
    id: "Click Power_100",
    amountBought: 0
  },
  "Auto Click_100": {
    amount: 100,
    cost: 50000,
    id: "Auto Click_100",
    amountBought: 0
  },
  "Auto Delay_0.5": {
    amount: 0.5,
    cost: 50000,
    id: "Auto Delay_0.5",
    amountBought: 0
  },
  "Gold Rush Time_1.25": {
    amount: 1.25,
    cost: 5000,
    id: "Gold Rush Time_1.25",
    amountBought: 0
  },
  "Gold Rush Time_2": {
    amount: 2,
    cost: 25000,
    id: "Gold Rush Time_2",
    amountBought: 0
  },
  "Click Power_500": {
    amount: 500,
    cost: 100000,
    id: "Click Power_500",
    amountBought: 0
  },
  "Auto Click_500": {
    amount: 500,
    cost: 500000,
    id: "Auto Click_500",
    amountBought: 0
  },
  "Click Power_1000": {
    amount: 1000,
    cost: 10000000,
    id: "Click Power_1000",
    amountBought: 0
  },
  "Auto Click_1000": {
    amount: 1000,
    cost: 50000000,
    id: "Auto Click_1000",
    amountBought: 0
  },
  "Click Power_5000": {
    amount: 5000,
    cost: 1000000000,
    id: "Click Power_5000",
    amountBought: 0
  },
  "Auto Click_5000": {
    amount: 5000,
    cost: 5000000000,
    id: "Auto Click_5000",
    amountBought: 0
  },
  "Click Power_10000": {
    amount: 10000,
    cost: 100000000000,
    id: "Click Power_10000",
    amountBought: 0
  },
  "Auto Click_10000": {
    amount: 10000,
    cost: 500000000000,
    id: "Auto Click_10000",
    amountBought: 0
  }
};

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

function upgradeGoldRushTime(upgrade) {
  if (golden) {
    displayInfo("You cannot buy this upgrade while gold rush is active.")
    return;
  }
  if (goldIncPercent >= 4) {
    displayInfo("Gold rush time multiplier cannot be more than 4.");
    return;
  }
  let cost = upgrades[upgrade].cost;
  let amount = upgrades[upgrade].amount;
  if (updateMoney(-cost)) {
    goldIncPercent *= amount;
    upgrades[upgrade].amountBought += 1;

    if (goldIncPercent > 4) {
      goldIncPercent = 4;
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

function updateUpgradeDisplay() {
  for (var key in upgrades) {
    let type = key.split("_")[0];
    document.getElementById(key).innerText = `$${format(upgrades[key].cost)}: Increase ${type} by ${upgrades[key].amount}, ${upgrades[key].amountBought} owned`;
  }
  updateUpgrades();
}

function upgradeAutoDelay(upgradeName) {
  let cost = upgrades[upgradeName].cost;

  if (autoDelay <= 10) {
    autoDelay = 10;
    updateAutoDelayDisplay();
    displayInfo("Auto Click Delay cannot be lower than 10ms");
    return;
  }
  
  if (updateMoney(-cost)) {
    autoDelay *= upgrades[upgradeName].amount;
    if (autoDelay < 10) {
      autoDelay = 10;
    }
    upgrades[upgradeName].cost = Math.floor(upgrades[upgradeName].cost);
    upgrades[upgradeName].amountBought += 1;
    updateAutoDelayDisplay();
    updateAutoClickInterval();

    if (hardMode) {
      upgrades[upgradeName].cost *= upgradeCostMultiplier;
      upgrades[upgradeName].cost = Math.floor(upgrades[upgradeName].cost);
      updateUpgradeDisplay()      
    }
  }
}

function updateMoney(amount) {
  const countElement = document.getElementById("count");
  if (golden && amount > 0) {
    amount *= 2;
    moneyFromGolden += amount;
    totalMondeyFromGolden += amount;
  }
  if (count + amount >= 0) {
    count += amount;
    countElement.innerText = format(count);

    if (!usedCodes.includes("iAmThe@dmin1234")) {
      if (count >= "100") {
        addCheatCode("1uoenjg85124ngf", "Only 100?");
      } else if (count >= "1111") {
        addCheatCode("9a0d8fyhunjo#iasud0!#$%^T!@#$", "Good Start!");
      } else if (count >= "999999999") {
        addCheatCode("asuhbjn%1598yckj", "End of game?");
      }
    }
    updateUpgrades();
    return true;
  } else {
    countElement.classList.add("insufficient");
    return false;
  }
}

function addCheatCode(code, msg) {
  let listElement = document.getElementById("cheatCodeList");
  let existingCodes = listElement.querySelectorAll("li");
  let alreadyExists = false;

  existingCodes.forEach(element => {
    if (element.textContent === code) {
      alreadyExists = true;
    }
  });

  if (!alreadyExists) {
    let liElement = document.createElement("li");
    liElement.textContent = code;
    listElement.appendChild(liElement);
    displayInfo("Cheat Code Added: " + code + ". " + msg);
  }
}

function upgradeAuto(upgradeName) {
  let cost = upgrades[upgradeName].cost;
  if (updateMoney(-cost)) {
    autoPower += upgrades[upgradeName].amount;
    upgrades[upgradeName].amountBought += 1;
    updateAutoPowerDisplay();

    if (hardMode) {
      upgrades[upgradeName].cost *= upgradeCostMultiplier;
      upgrades[upgradeName].cost = Math.floor(upgrades[upgradeName].cost);
      updateUpgradeDisplay()      
    }
  }
}

function onClick() {
  updateMoney(clickPower);
  clicks += 1
  document.getElementById("totalClicks").innerText = "Clicks: " + format(clicks);
}

function upgradeClick(upgradeName) {
  let cost = upgrades[upgradeName].cost;
  if (updateMoney(-cost)) {
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

function updateAutoDelayDisplay() {
  document.getElementById("auto-delay").innerText = `Auto Click Delay: ${format(Math.round(autoDelay))}ms`;
}

function updateAutoPowerDisplay() {
  document.getElementById("auto-power").innerText = `Auto Click: ${format(autoPower)}`;
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
  // Update the pot display when the bidding section is opened or closed
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
  updateUpgrades();
  displayInfo("Game reset.");
  const listElement = document.getElementById("cheatCodeList");
  listElement.innerHTML = "";
  document.getElementById("count").innerText = count;
  updateClickPowerDisplay();
  updateAutoPowerDisplay();
  updateAutoDelayDisplay();
  updateAutoClickInterval();

  toggleSettings();
}

function updateAutoClickInterval() {
  if (autoClickInterval) {
    clearInterval(autoClickInterval);
  }
  autoClickInterval = setInterval(function () {
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

function codeSubmission() {
  let value = document.getElementById("code").value;
  if (value === "1uoenjg85124ngf" && !usedCodes.includes("1uoenjg85124ngf")) {
    updateMoney(count);
    usedCodes.push("1uoenjg85124ngf");
  } else if (value === "asuhbjn%1598yckj" && !usedCodes.includes("asuhbjn%1598yckj")) {
    autoPower *= 1.5
    updateAutoPowerDisplay()
    usedCodes.push("asuhbjn%1598yckj");
  } else if (value === "9a0d8fyhunjo#iasud0!#$%^T!@#$" && !usedCodes.includes("9a0d8fyhunjo#iasud0!#$%^T!@#$")) {
    updateMoney(count * count);
    autoPower *= 2;
    autoDelay *= 0.5;
    updateAutoDelayDisplay();
    updateAutoPowerDisplay();
    usedCodes.push("9a0d8fyhunjo#iasud0!#$%^T!@#$");
  } else if (value === "iAmThe@dmin1234"  && !usedCodes.includes("iAmThe@dmin1234")) {
    addCheatCode("iAmThe@dmin1234", "Welcome, Admin.");
    usedCodes.push("iAmThe@dmin1234");
    updateMoney(99999999999);
  }
  document.getElementById("code").value = "";
}

function displayInfo(info, color) {
  let infoElement = document.getElementById("infoBox");

  if (color != null || color != undefined) {
    infoElement.style.backgroundColor = `${color}`;
  }
  infoElement.classList.add("visible");
  infoElement.textContent = info;
  setTimeout(() => {
    infoElement.classList.remove("visible");
  }, 5000);
  setTimeout(() => {
    infoElement.style.backgroundColor = "#fff";
  }, 5500)
}

function sortUpgradesByType() {
  const autoPowerUpgrades = [];
  const autoDelayUpgrades = [];
  const clickerUpgrades = [];
  const goldRushUpgrades = [];

  for (const key in upgrades) {
    const upgrade = upgrades[key]
    
    if (key.includes("Auto Click")) {
      autoPowerUpgrades.push(upgrade);
    } else if (key.includes("Auto Delay")) {
      autoDelayUpgrades.push(upgrade);
    } else if (key.includes("Click Power")) {
      clickerUpgrades.push(upgrade);
    } else {
      goldRushUpgrades.push(upgrade);
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
}

function bidSubmission() {
  if (!bidInProgress) {
    totalBids += 1;
    document.getElementById("totalBids").innerText = "Total bids: " + format(totalBids);
    const bidAmount = parseInt(document.getElementById("bidAmount").value);
    if (!isNaN(bidAmount) && bidAmount > 0 && bidAmount <= count) {
      userBid = bidAmount;
      totPot += userBid;
      document.getElementById("bidInfo").innerText = `Pot: ${format(totPot)}, Chance: ${Math.round((userBid / totPot) * 100)}%, Bid: ${format(userBid)}`;
      document.getElementById("bidInfo").style.color = "green";
      document.getElementById("bidAmount").value = "";
      const bidsList = document.getElementById("bids");
      bidsList.innerHTML = "";
      const bidElement = document.createElement("li");
      bidElement.innerText = "You: " + bidAmount;
      bidsList.appendChild(bidElement);
      bidInProgress = true;
      let totalDelay = 0;
      while (true) {
        if (totalDelay < 30000) {
          const randomDelay = Math.floor(Math.random() * (10000 - 2000)) + 1;
          totalDelay += randomDelay;
          setTimeout(addBid, totalDelay);
        } else {
          break
        }
      }
      countdownInterval = setInterval(updateInterval, 1000);
      secondsLeft = 30;
      document.getElementById("countdown").innerHTML = `Time Left: ${secondsLeft}s`;
    } else {
      displayInfo("Please enter a valid integer bid amount that is within your current balance.");
    }
  } else {
    displayInfo("A bid is already in progress.");
  }
}

function updateInterval() {
  let countdownElement = document.getElementById("countdown");
  if (secondsLeft > 0) {
    countdownElement.innerText = `Time Left: ${secondsLeft}s`;
    secondsLeft--;
  } else {
    clearInterval(countdownInterval);
    endBidding();
  }
}

function endBidding() {
  bidInProgress = false;
  clearInterval(countdownInterval);
  const bidsList = document.getElementById("bids");
  const bids = bidsList.querySelectorAll("li");

  let winningNumber = Math.floor(Math.random() * totPot);

  if (winningNumber < userBid) {
    displayInfo(`You won the bid for ${format(totPot)} with a chance of ${Math.round((userBid / totPot) * 100)}%`);
    lostBids += 1;
    document.getElementById("lostBids").innerText = "Bids lost: " + format(lostBids);
    updateMoney(totPot);
  } else {
    let bidIterationCount = 0;
    for (let i = 0; i < bids.length; i++) {
      let lowerNum = bidIterationCount;
      let bidAmount = parseInt(bids[i].innerText.split(":")[1]);
      let bidName = bids[i].innerText.split(":")[0];
      let upperNum = bidIterationCount + bidAmount;

      if (winningNumber >= lowerNum && winningNumber <= upperNum) {
        displayInfo(`${bidName} wins the bid with a bid of ${format(bidAmount)}!`);
        wonBids += 1;
        document.getElementById("wonBids").innerText = "Bids wone: " + format(wonBids);
        updateMoney(-userBid);
        break;
      }
      bidIterationCount += bidAmount;
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
}

function addBid() {
  if (!bidInProgress) {
    return;
  }
  const bidsList = document.getElementById("bids");
  const bidElement = document.createElement("li");
  let upperRange = Math.floor(userBid );
  let lowerRange = Math.floor(userBid * 0.7);

  if (upperRange == userBid) {
    upperRange += userBid;
  }
  if (lowerRange == userBid) {
    lowerRange -= userBid;
  }

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
  }  else {
    red = Math.round(255 * (colorPercent / 100));
  }
  let blue = 0

  bidInfoElement.style.color = `rgb(${red}, ${green}, ${blue})`;

  document.getElementById("bidInfo").innerText = `Pot: ${format(totPot)}, Chance: ${winChance}%, Bid: ${format(userBid)}`;
}

function scrollToCategory(category) {  
  const targetElement = document.getElementById(category);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth'});
  }
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
      goldTimer -= 1000;
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
  delay = Math.floor(Math.random() * (300000 - 60000)) + 60000;
  // delay = 5000;
  goldenCountdown = delay;
  goldInfoInterval = setInterval(updateGoldCountdownInfo, 1000);
}

function updateGoldCountdownInfo() {
  goldenCountdown -= 1000;

  if (goldenCountdown <= 0) {
    startGolden();
    document.getElementById("goldenCountdown").innerText = `Gold Rush Is Active!`;
  } else {
    let timeUntilGold = goldenCountdown;
    let goldMinutes = Math.floor(timeUntilGold / (1000 * 60));
    let goldSeconds = Math.floor((timeUntilGold % (1000 * 60)) / 1000);
    document.getElementById("goldenCountdown").innerText = `Gold Rush Countdown: ${goldMinutes}m ${goldSeconds}s`;
  }
}

function startGolden() {
  clearInterval(goldInfoInterval);
  golden = true;
  goldTimer = 15000 * goldIncPercent
  displayInfo("Gold rush started. All changes in money will be multiplied by 2.")
  setTimeout(endGolden, 15000 * goldIncPercent);
  document.getElementById("count").classList.add("gold");
  updateGoldTimer();
  goldTimerinterval = setInterval(updateGoldTimer, 1000);
}

function updateGoldRushDisplayInfo() {
  if (goldRushes == 1) {
    document.getElementById("moneyFromGolden").innerText = "Money from gold rush: " + format(totalMondeyFromGolden);
  } else if (goldRushes >= 1) {
    document.getElementById("moneyFromGolden").innerText = "Money from gold rushes: " + format(totalMondeyFromGolden);
  } else {
    document.getElementById("moneyFromGolden").innerText = "No gold rush yet.";
  }
}

function endGolden() {
  clearInterval(goldTimerinterval);
  golden = false;
  displayInfo("Golden rush has ended. You earned a total of " + format(moneyFromGolden) + " money from the gold rush.")

  updateGoldRushDisplayInfo();

  moneyFromGolden = 0;
  document.getElementById("count").classList.remove("gold");
  document.getElementById("goldTimer").innerText = ""

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
    moneyFromGolden: totalMondeyFromGolden,
    goldRushes: goldRushes,
    shortenClicks: shortenClicks,
    goldIncPercent: goldIncPercent,
    usedCodes: usedCodes,
    hardMode: hardMode,
    upgrades: upgrades
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
    totalMondeyFromGolden = gameData.moneyFromGolden;
    goldRushes = gameData.goldRushes;
    shortenClicks = gameData.shortenClicks;
    goldIncPercent = gameData.goldIncPercent;
    usedCodes = gameData.usedCodes;
    hardMode = gameData.hardMode;
    upgrades = gameData.upgrades;
    updateMoney(0);
    updateAutoPowerDisplay();
    updateAutoDelayDisplay();
    updateClickPowerDisplay();
    updateUpgrades();
    updateUpgradeDisplay();
    updateAutoClickInterval();
    document.getElementById("totalClicks").innerText = "Clicks: " + format(clicks);
    document.getElementById("totalBids").innerText = "Total bids: " + format(totalBids);
    document.getElementById("wonBids").innerText = "Bids won: " + format(wonBids);
    document.getElementById("lostBids").innerText = "Bids lost: " + format(lostBids);

    updateGoldRushDisplayInfo();
    
    document.getElementById("local-button").style.display = "none";
    displayInfo("Game data loaded successfully.")

    document.getElementById("easyMode").checked = !hardMode; 
    document.getElementById("shorten").checked = shortenClicks;
  } else {
    displayInfo("Game data load failed.")
  }
}

window.onbeforeunload = function() {
  saveGameData();
};

document.getElementById("count").addEventListener("animationend", function () {
  this.classList.remove("insufficient");
});

document.getElementById("auto-power").addEventListener("animationend", function () {
  this.classList.remove("active");
});

updateMoney(0);
updateAutoPowerDisplay();
updateAutoDelayDisplay();
updateClickPowerDisplay();
updateAutoClickInterval();
updateUpgrades();
updateUpgradeDisplay();
sortUpgradesByType();
startGoldenCountdown();