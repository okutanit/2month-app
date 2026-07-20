const prizes = [
  {
    icon: "♨️",
    title: "温泉旅行券",
    description: "ふたりでゆっくり温泉旅行に行こう。行き先も一緒に決めよな。"
  },
  {
    icon: "🏰",
    title: "ディズニーデート券",
    description: "一日たっぷり遊んで、ふたりの思い出をまた増やそう。"
  },
  {
    icon: "🍖",
    title: "焼肉おごり券",
    description: "好きなお肉を好きなだけ。今日はたくとがごちそうします。"
  },
  {
    icon: "☕",
    title: "カフェデート券",
    description: "気になってたおしゃれなカフェへ。ゆっくり一緒に過ごそう。"
  },
  {
    icon: "🚗",
    title: "ドライブ券",
    description: "行き先はその日の気分で。音楽かけて、ふたりで出かけよう。"
  },
  {
    icon: "💌",
    title: "なんでもお願い券",
    description: "なーちゃんのお願いをひとつ叶えます。大事に使ってな。"
  }
];

const screens = {
  opening: document.getElementById("openingScreen"),
  gacha: document.getElementById("gachaScreen"),
  result: document.getElementById("resultScreen"),
  final: document.getElementById("finalScreen")
};

const startButton = document.getElementById("startButton");
const handleButton = document.getElementById("handleButton");
const gachaMachine = document.getElementById("gachaMachine");
const gachaStatus = document.getElementById("gachaStatus");
const dropCapsule = document.getElementById("dropCapsule");
const ticket = document.getElementById("ticket");
const prizeIcon = document.getElementById("prizeIcon");
const prizeTitle = document.getElementById("prizeTitle");
const prizeDescription = document.getElementById("prizeDescription");
const againButton = document.getElementById("againButton");
const memoryButton = document.getElementById("memoryButton");
const restartButton = document.getElementById("restartButton");
const sparkleLayer = document.getElementById("sparkleLayer");

let isDrawing = false;
let lastPrizeIndex = -1;

function showScreen(targetName) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[targetName].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getRandomPrizeIndex() {
  if (prizes.length === 1) return 0;

  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * prizes.length);
  } while (nextIndex === lastPrizeIndex);

  lastPrizeIndex = nextIndex;
  return nextIndex;
}

function createSparkles(count = 28) {
  const symbols = ["♡", "✦", "•", "✧"];

  for (let i = 0; i < count; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.setProperty("--drift", `${(Math.random() - 0.5) * 180}px`);
    sparkle.style.animationDuration = `${2.8 + Math.random() * 2.4}s`;
    sparkle.style.animationDelay = `${Math.random() * 0.8}s`;
    sparkle.style.opacity = `${0.55 + Math.random() * 0.45}`;
    sparkleLayer.appendChild(sparkle);

    sparkle.addEventListener("animationend", () => sparkle.remove());
  }
}

function updatePrize(prize) {
  prizeIcon.textContent = prize.icon;
  prizeTitle.textContent = prize.title;
  prizeDescription.textContent = prize.description;
}

function resetGachaAnimation() {
  handleButton.classList.remove("turning");
  gachaMachine.classList.remove("shaking");
  dropCapsule.classList.remove("dropping");
  void handleButton.offsetWidth;
}

function drawGacha() {
  if (isDrawing) return;

  isDrawing = true;
  handleButton.disabled = true;
  gachaStatus.textContent = "NOW DRAWING...";
  resetGachaAnimation();

  const prize = prizes[getRandomPrizeIndex()];

  handleButton.classList.add("turning");
  gachaMachine.classList.add("shaking");

  window.setTimeout(() => {
    dropCapsule.classList.add("dropping");
    gachaStatus.textContent = "A CAPSULE APPEARED!";
  }, 650);

  window.setTimeout(() => {
    updatePrize(prize);
    ticket.classList.remove("reveal");
    void ticket.offsetWidth;
    ticket.classList.add("reveal");
    showScreen("result");
    createSparkles(34);
    isDrawing = false;
    handleButton.disabled = false;
  }, 1900);
}

startButton.addEventListener("click", () => {
  showScreen("gacha");
});

handleButton.addEventListener("click", drawGacha);

document.getElementById("gachaMachine").addEventListener("click", (event) => {
  if (event.target.closest("button")) return;
  drawGacha();
});

againButton.addEventListener("click", () => {
  resetGachaAnimation();
  gachaStatus.textContent = "TAP TO TURN";
  showScreen("gacha");
});

memoryButton.addEventListener("click", () => {
  showScreen("final");
  createSparkles(46);
});

restartButton.addEventListener("click", () => {
  resetGachaAnimation();
  gachaStatus.textContent = "TAP TO TURN";
  showScreen("opening");
});
