const quizzes = [
  {
    question: "今日は付き合って何ヶ月記念でしょう？",
    choices: ["1ヶ月", "2ヶ月", "100ヶ月"],
    answerIndex: 1,
    correctMessage: "さすが！2ヶ月記念やで♡",
    wrongMessage: "正解は2ヶ月！ここは覚えといてな♡"
  },
  {
    question: "なーちゃんの彼氏は誰でしょう？",
    choices: ["たくと", "大谷翔平", "カフェの店員さん"],
    answerIndex: 0,
    correctMessage: "正解！たくとです。これは落とせへんな♡",
    wrongMessage: "正解はたくと！ライバル強すぎ問題。"
  },
  {
    question: "これからふたりで一番増やしたいものは？",
    choices: ["残業時間", "未読LINE", "楽しい思い出"],
    answerIndex: 2,
    correctMessage: "大正解！これからもいっぱい作ろうな♡",
    wrongMessage: "正解は楽しい思い出！残業は増やさんでええ。"
  }
];

const prizes = [
  {
    icon: "⚾",
    title: "野球観戦券",
    description: "一緒に野球観戦へ。好きな球場と試合を選んで行こう。"
  },
  {
    icon: "✈️",
    title: "行きたい場所に旅行券",
    description: "なーちゃんが行きたい場所へ、ふたりで旅行に行こう。"
  },
  {
    icon: "🍽️",
    title: "ご飯おごり券（たくとが）",
    description: "食べたいものを選んでな。今日はたくとがごちそうします。"
  },
  {
    icon: "☕",
    title: "カフェデート券（なーが奢る）",
    description: "おしゃれなカフェでゆっくりデート。今日はなーちゃんがごちそうしてくれます。"
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
  quiz: document.getElementById("quizScreen"),
  quizResult: document.getElementById("quizResultScreen"),
  gacha: document.getElementById("gachaScreen"),
  result: document.getElementById("resultScreen"),
  final: document.getElementById("finalScreen")
};

const startButton = document.getElementById("startButton");
const quizCard = document.getElementById("quizCard");
const quizProgress = document.getElementById("quizProgress");
const quizCoinCount = document.getElementById("quizCoinCount");
const quizQuestion = document.getElementById("quizQuestion");
const quizChoices = document.getElementById("quizChoices");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestionButton = document.getElementById("nextQuestionButton");
const quizScoreText = document.getElementById("quizScoreText");
const earnedCoinCount = document.getElementById("earnedCoinCount");
const quizResultMessage = document.getElementById("quizResultMessage");
const goGachaButton = document.getElementById("goGachaButton");
const retryQuizButton = document.getElementById("retryQuizButton");
const handleButton = document.getElementById("handleButton");
const gachaMachine = document.getElementById("gachaMachine");
const gachaCoinCount = document.getElementById("gachaCoinCount");
const gachaStatus = document.getElementById("gachaStatus");
const dropCapsule = document.getElementById("dropCapsule");
const ticket = document.getElementById("ticket");
const prizeIcon = document.getElementById("prizeIcon");
const prizeTitle = document.getElementById("prizeTitle");
const prizeDescription = document.getElementById("prizeDescription");
const remainingCoinText = document.getElementById("remainingCoinText");
const againButton = document.getElementById("againButton");
const memoryButton = document.getElementById("memoryButton");
const restartButton = document.getElementById("restartButton");
const sparkleLayer = document.getElementById("sparkleLayer");

let currentQuizIndex = 0;
let correctAnswers = 0;
let coins = 0;
let answeredCurrentQuiz = false;
let isDrawing = false;
let lastPrizeIndex = -1;

function showScreen(targetName) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[targetName].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
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

function renderQuiz() {
  const quiz = quizzes[currentQuizIndex];
  answeredCurrentQuiz = false;

  quizProgress.textContent = `QUESTION ${currentQuizIndex + 1} / ${quizzes.length}`;
  quizCoinCount.textContent = String(correctAnswers);
  quizQuestion.textContent = quiz.question;
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";
  nextQuestionButton.classList.add("hidden");
  nextQuestionButton.firstChild.textContent = currentQuizIndex === quizzes.length - 1
    ? "結果を見る"
    : "次の問題へ";
  quizChoices.innerHTML = "";
  quizCard.classList.remove("quiz-pop");
  void quizCard.offsetWidth;
  quizCard.classList.add("quiz-pop");

  quiz.choices.forEach((choice, choiceIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-choice";
    button.textContent = choice;
    button.addEventListener("click", () => answerQuiz(choiceIndex));
    quizChoices.appendChild(button);
  });
}

function answerQuiz(choiceIndex) {
  if (answeredCurrentQuiz) return;

  answeredCurrentQuiz = true;
  const quiz = quizzes[currentQuizIndex];
  const isCorrect = choiceIndex === quiz.answerIndex;
  const choiceButtons = [...quizChoices.querySelectorAll(".quiz-choice")];

  choiceButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === quiz.answerIndex) {
      button.classList.add("correct");
    } else if (index === choiceIndex) {
      button.classList.add("wrong");
    }
  });

  if (isCorrect) {
    correctAnswers += 1;
    quizCoinCount.textContent = String(correctAnswers);
    quizFeedback.textContent = `🪙 GET！ ${quiz.correctMessage}`;
    quizFeedback.classList.add("correct");
    createSparkles(18);
  } else {
    quizFeedback.textContent = quiz.wrongMessage;
    quizFeedback.classList.add("wrong");
  }

  nextQuestionButton.classList.remove("hidden");
}

function showQuizResult() {
  coins = correctAnswers;
  quizScoreText.textContent = `${quizzes.length}問中${correctAnswers}問正解`;
  earnedCoinCount.textContent = String(coins);

  if (coins > 0) {
    quizResultMessage.textContent = `ガチャを${coins}回まわせるで！どの券が出るかお楽しみ♡`;
    goGachaButton.classList.remove("hidden");
    retryQuizButton.classList.add("hidden");
    createSparkles(34);
  } else {
    quizResultMessage.textContent = "今回はコイン0枚！もう一度挑戦して、1枚以上ゲットしよう。";
    goGachaButton.classList.add("hidden");
    retryQuizButton.classList.remove("hidden");
  }

  showScreen("quizResult");
}

function resetQuiz() {
  currentQuizIndex = 0;
  correctAnswers = 0;
  coins = 0;
  quizCoinCount.textContent = "0";
  renderQuiz();
}

function updateGachaCoinDisplay() {
  gachaCoinCount.textContent = String(coins);
  handleButton.disabled = isDrawing || coins <= 0;

  if (coins <= 0 && !isDrawing) {
    gachaStatus.textContent = "コインを使い切りました";
  } else if (!isDrawing) {
    gachaStatus.textContent = "コインを1枚使います";
  }
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

function updateResultActions() {
  remainingCoinText.textContent = coins > 0
    ? `残りコイン：${coins}枚（あと${coins}回まわせるで）`
    : "ガチャコインをすべて使いました";

  againButton.classList.toggle("hidden", coins <= 0);
  memoryButton.innerHTML = coins > 0
    ? 'ガチャを終えてメッセージへ <span aria-hidden="true">→</span>'
    : '最後のメッセージへ <span aria-hidden="true">→</span>';
}

function drawGacha() {
  if (isDrawing || coins <= 0) return;

  isDrawing = true;
  coins -= 1;
  updateGachaCoinDisplay();
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
    updateResultActions();
    ticket.classList.remove("reveal");
    void ticket.offsetWidth;
    ticket.classList.add("reveal");
    showScreen("result");
    createSparkles(34);
    isDrawing = false;
    updateGachaCoinDisplay();
  }, 1900);
}

startButton.addEventListener("click", () => {
  resetQuiz();
  showScreen("quiz");
});

nextQuestionButton.addEventListener("click", () => {
  if (!answeredCurrentQuiz) return;

  if (currentQuizIndex < quizzes.length - 1) {
    currentQuizIndex += 1;
    renderQuiz();
  } else {
    showQuizResult();
  }
});

retryQuizButton.addEventListener("click", () => {
  resetQuiz();
  showScreen("quiz");
});

goGachaButton.addEventListener("click", () => {
  resetGachaAnimation();
  updateGachaCoinDisplay();
  showScreen("gacha");
});

handleButton.addEventListener("click", drawGacha);

gachaMachine.addEventListener("click", (event) => {
  if (event.target.closest("button")) return;
  drawGacha();
});

againButton.addEventListener("click", () => {
  resetGachaAnimation();
  updateGachaCoinDisplay();
  showScreen("gacha");
});

memoryButton.addEventListener("click", () => {
  showScreen("final");
  createSparkles(46);
});

restartButton.addEventListener("click", () => {
  currentQuizIndex = 0;
  correctAnswers = 0;
  coins = 0;
  isDrawing = false;
  lastPrizeIndex = -1;
  resetGachaAnimation();
  showScreen("opening");
});
