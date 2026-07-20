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
  selection: document.getElementById("selectionScreen"),
  schedule: document.getElementById("scheduleScreen"),
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
const ticketNumber = document.getElementById("ticketNumber");
const ticket = document.getElementById("ticket");
const prizeIcon = document.getElementById("prizeIcon");
const prizeTitle = document.getElementById("prizeTitle");
const prizeDescription = document.getElementById("prizeDescription");
const remainingCoinText = document.getElementById("remainingCoinText");
const againButton = document.getElementById("againButton");
const memoryButton = document.getElementById("memoryButton");
const selectionCards = document.getElementById("selectionCards");
const selectionHint = document.getElementById("selectionHint");
const confirmSelectionButton = document.getElementById("confirmSelectionButton");
const schedulePrizeIcon = document.getElementById("schedulePrizeIcon");
const schedulePrizeTitle = document.getElementById("schedulePrizeTitle");
const datePicker = document.getElementById("datePicker");
const datePreview = document.getElementById("datePreview");
const backToSelectionButton = document.getElementById("backToSelectionButton");
const confirmDateButton = document.getElementById("confirmDateButton");
const finalChosenLabel = document.getElementById("finalChosenLabel");
const finalPrizeIcon = document.getElementById("finalPrizeIcon");
const finalPrizeTitle = document.getElementById("finalPrizeTitle");
const finalPrizeDescription = document.getElementById("finalPrizeDescription");
const finalDateText = document.getElementById("finalDateText");
const saveImageButton = document.getElementById("saveImageButton");
const shareLineButton = document.getElementById("shareLineButton");
const shareHelpText = document.getElementById("shareHelpText");
const shareCaptureCard = document.getElementById("shareCaptureCard");
const restartButton = document.getElementById("restartButton");
const sparkleLayer = document.getElementById("sparkleLayer");

let currentQuizIndex = 0;
let correctAnswers = 0;
let coins = 0;
let answeredCurrentQuiz = false;
let isDrawing = false;
let drawnPrizeIndices = [];
let selectedPrizeIndex = null;
let selectedDate = "";

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
  nextQuestionButton.innerHTML = currentQuizIndex === quizzes.length - 1
    ? '結果を見る <span aria-hidden="true">→</span>'
    : '次の問題へ <span aria-hidden="true">→</span>';
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
    quizResultMessage.textContent = `ガチャを${coins}回まわせるで！同じ結果は出ない仕様にしてるから安心や♡`;
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
  drawnPrizeIndices = [];
  selectedPrizeIndex = null;
  selectedDate = "";
  isDrawing = false;
  quizCoinCount.textContent = "0";
  renderQuiz();
}

function updateGachaCoinDisplay() {
  gachaCoinCount.textContent = String(coins);
  handleButton.disabled = isDrawing || coins <= 0;

  if (coins <= 0 && !isDrawing) {
    gachaStatus.textContent = "コインを使い切ったよ。結果を確認してね";
  } else if (!isDrawing) {
    gachaStatus.textContent = "コインを1枚使います";
  }
}

function getRandomPrizeIndex() {
  const availablePrizeIndices = prizes
    .map((_, index) => index)
    .filter((index) => !drawnPrizeIndices.includes(index));

  if (availablePrizeIndices.length === 0) {
    return 0;
  }

  const randomIndex = Math.floor(Math.random() * availablePrizeIndices.length);
  return availablePrizeIndices[randomIndex];
}

function renderTicketParts(iconElement, titleElement, descriptionElement, prize) {
  iconElement.textContent = prize.icon;
  titleElement.textContent = prize.title;
  descriptionElement.textContent = prize.description;
}

function resetGachaAnimation() {
  handleButton.classList.remove("turning");
  gachaMachine.classList.remove("shaking");
  dropCapsule.classList.remove("dropping");
  void handleButton.offsetWidth;
}

function updateResultActions() {
  const drawCount = drawnPrizeIndices.length;
  ticketNumber.textContent = `No. 0${drawCount}`;

  if (coins > 0) {
    remainingCoinText.textContent = `残りコイン：${coins}枚（同じ結果はもう出ないで）`;
    againButton.classList.remove("hidden");
    memoryButton.classList.add("hidden");
  } else {
    remainingCoinText.textContent = `全${drawCount}枚の結果がそろったよ。最後に好きな1枚を選んでね。`;
    againButton.classList.add("hidden");
    memoryButton.classList.remove("hidden");
    memoryButton.innerHTML = 'ガチャ結果を選ぶ <span aria-hidden="true">→</span>';
  }
}

function drawGacha() {
  if (isDrawing || coins <= 0) return;

  isDrawing = true;
  coins -= 1;
  updateGachaCoinDisplay();
  gachaStatus.textContent = "NOW DRAWING...";
  resetGachaAnimation();

  const prizeIndex = getRandomPrizeIndex();
  const prize = prizes[prizeIndex];

  handleButton.classList.add("turning");
  gachaMachine.classList.add("shaking");

  window.setTimeout(() => {
    dropCapsule.classList.add("dropping");
    gachaStatus.textContent = "A CAPSULE APPEARED!";
  }, 650);

  window.setTimeout(() => {
    if (!drawnPrizeIndices.includes(prizeIndex)) {
      drawnPrizeIndices.push(prizeIndex);
    }
    renderTicketParts(prizeIcon, prizeTitle, prizeDescription, prize);
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

function renderSelectionCards() {
  selectionCards.innerHTML = "";

  drawnPrizeIndices.forEach((prizeIndex, index) => {
    const prize = prizes[prizeIndex];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `selection-item${selectedPrizeIndex === prizeIndex ? " selected" : ""}`;
    button.setAttribute("aria-pressed", selectedPrizeIndex === prizeIndex ? "true" : "false");
    button.innerHTML = `
      <span class="selection-order">RESULT ${index + 1}</span>
      <span class="selection-icon" aria-hidden="true">${prize.icon}</span>
      <strong class="selection-title">${prize.title}</strong>
      <span class="selection-description">${prize.description}</span>
    `;
    button.addEventListener("click", () => {
      selectedPrizeIndex = prizeIndex;
      renderSelectionCards();
      selectionHint.textContent = `「${prize.title}」を選択中♡`;
      confirmSelectionButton.disabled = false;
    });
    selectionCards.appendChild(button);
  });

  if (selectedPrizeIndex === null) {
    selectionHint.textContent = "カードをタップして選択してね。";
    confirmSelectionButton.disabled = true;
  }
}

function openSelectionScreen() {
  selectedPrizeIndex = null;
  renderSelectionCards();
  showScreen("selection");
}

function formatDateForDisplay(dateValue) {
  if (!dateValue) return "";

  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function getTodayLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function openScheduleScreen() {
  const prize = prizes[selectedPrizeIndex];
  schedulePrizeIcon.textContent = prize.icon;
  schedulePrizeTitle.textContent = prize.title;
  datePicker.min = getTodayLocalDateString();
  datePicker.value = selectedDate;
  datePreview.textContent = selectedDate
    ? `${formatDateForDisplay(selectedDate)}にデート予定♡`
    : "カレンダーから日付を選んでね。";
  confirmDateButton.disabled = !selectedDate;
  showScreen("schedule");
}

function prepareFinalScreen() {
  const prize = prizes[selectedPrizeIndex];
  renderTicketParts(finalPrizeIcon, finalPrizeTitle, finalPrizeDescription, prize);
  finalChosenLabel.textContent = `なーちゃんが選んだ1枚は「${prize.title}」♡`;
  finalDateText.textContent = formatDateForDisplay(selectedDate);
  shareHelpText.textContent = "スマホではそのまま共有、PCでは画像保存してからLINEで送るのがおすすめ。";
  showScreen("final");
  createSparkles(46);
}

async function buildShareBlob() {
  const canvas = await html2canvas(shareCaptureCard, {
    backgroundColor: null,
    scale: 2,
    useCORS: true
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("画像の生成に失敗しました"));
      }
    }, "image/png");
  });
}

async function downloadShareImage() {
  try {
    const blob = await buildShareBlob();
    const prize = prizes[selectedPrizeIndex];
    const safeTitle = prize.title.replace(/[\\/:*?"<>|（）\s]/g, "-");
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `2month-anniversary-${safeTitle}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    shareHelpText.textContent = "画像を保存したで！そのままLINEに添付して送れるよ。";
  } catch (error) {
    console.error(error);
    shareHelpText.textContent = "画像の保存に失敗しました。もう一度試してみてね。";
  }
}

async function shareToLine() {
  if (selectedPrizeIndex === null) return;

  const prize = prizes[selectedPrizeIndex];
  const shareText = `2ヶ月記念で選んだのは「${prize.title}」♡ デート日は${formatDateForDisplay(selectedDate)}！`;

  try {
    const blob = await buildShareBlob();
    const file = new File([blob], "2month-anniversary-ticket.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "2ヶ月記念ガチャ",
        text: shareText
      });
      shareHelpText.textContent = "共有シートを開いたで。LINEを選べばそのまま送れるはず！";
      return;
    }

    await downloadShareImage();
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(location.href)}`;
    window.open(lineUrl, "_blank", "noopener");
    shareHelpText.textContent = "画像を保存したで。開いたLINE画面で、保存した画像を添付して送ってね。";
  } catch (error) {
    console.error(error);
    shareHelpText.textContent = "共有に失敗しました。画像保存してからLINEで送ってみてな。";
  }
}

function resetExperience() {
  currentQuizIndex = 0;
  correctAnswers = 0;
  coins = 0;
  answeredCurrentQuiz = false;
  isDrawing = false;
  drawnPrizeIndices = [];
  selectedPrizeIndex = null;
  selectedDate = "";
  resetGachaAnimation();
  showScreen("opening");
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
  openSelectionScreen();
});

confirmSelectionButton.addEventListener("click", () => {
  if (selectedPrizeIndex === null) return;
  openScheduleScreen();
});

datePicker.addEventListener("change", () => {
  selectedDate = datePicker.value;
  confirmDateButton.disabled = !selectedDate;
  datePreview.textContent = selectedDate
    ? `${formatDateForDisplay(selectedDate)}にデート予定♡`
    : "カレンダーから日付を選んでね。";
});

backToSelectionButton.addEventListener("click", () => {
  renderSelectionCards();
  showScreen("selection");
});

confirmDateButton.addEventListener("click", () => {
  if (!selectedDate) return;
  prepareFinalScreen();
});

saveImageButton.addEventListener("click", downloadShareImage);
shareLineButton.addEventListener("click", shareToLine);
restartButton.addEventListener("click", resetExperience);
