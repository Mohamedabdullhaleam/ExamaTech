let quizData = {};
let currentQuestionIndex = 0;
// Fetch quiz data
async function fetchQuizData() {
  // get data from local storage first
  try {
    const savedQuestions = localStorage.getItem("randomizedQuestions");
    if (savedQuestions) {
      quizData.questions = JSON.parse(savedQuestions);
      initQuiz();
      return;
    }
    // if not now fetch data
    const response = await fetch("http://localhost:3010/quiz");
    if (!response.ok) {
      throw new Error("Failed to fetch quiz data");
    }

    quizData = await response.json();
    const { hours, minutes, seconds } = quizData.quizTime;

    const randomizedQuestions = shuffleQuestions(quizData.questions);
    quizData.questions = randomizedQuestions; // Store shuffled questions in quizData

    // Save shuffled questions in localStorage
    localStorage.setItem(
      "randomizedQuestions",
      JSON.stringify(randomizedQuestions)
    );
    localStorage.setItem(
      "quizTime",
      JSON.stringify({ hours, minutes, seconds })
    );

    startCountdown(hours, minutes, seconds);
    initQuiz();
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
}

function initQuiz() {
  const currentQuestionIndex =
    parseInt(localStorage.getItem("currentQuestionIndex")) || 0;
  displayQuestion(
    quizData.questions[currentQuestionIndex],
    currentQuestionIndex
  );
}

function displayQuestion(question, index) {
  const questionNumberElement = document.getElementById("q-number-text");
  // const answersContainer = document.querySelector(".answer");

  questionNumberElement.innerHTML = `${
    index + 1
  }. <span id="question-text" class="font-bold">${question.question}</span>`;

  // Loop through the options and update the existing divs
  question.options.forEach((option, optionIndex) => {
    const optionElement = document.getElementById(`option-${optionIndex + 1}`);

    if (optionElement) {
      const radioInput = optionElement.querySelector("input");
      const radioLabel = optionElement.querySelector("label");

      radioInput.id = `choice-${index}-${optionIndex}`;
      radioLabel.setAttribute("for", radioInput.id);
      radioLabel.textContent = option.text;
    }
  });
}

// Function to display the questions on the page
function displayQuestion(question, index) {
  localStorage.setItem("currentQuestionIndex", index);

  const questionNumberElement = document.getElementById("q-number-text");
  questionNumberElement.innerHTML = `${
    index + 1
  }. <span id="question-text" class="font-bold">${question.question}</span>`;

  question.options.forEach((option, optionIndex) => {
    const optionElement = document.getElementById(`option-${optionIndex + 1}`);
    if (optionElement) {
      const radioInput = optionElement.querySelector("input");
      const radioLabel = optionElement.querySelector("label");

      radioInput.id = `choice-${index}-${optionIndex}`;
      radioLabel.setAttribute("for", radioInput.id);
      radioLabel.textContent = option.text;

      // Pre-select if previously chosen
      radioInput.checked = question.choosedOptionId === option.id;
      radioInput.onclick = () => trackAnswer(question.id, option.id);
    }
  });
}

/ * * * *  Shuffling question * * * * /;
function shuffleQuestions(questions) {
  return questions.sort(() => Math.random() - 0.5);
}

/ * * * * Tracking Answers * * * * /;
function trackAnswer(questionId, optionId) {
  const currentQuestion = quizData.questions.find((q) => q.id === questionId);
  currentQuestion.choosedOptionId = optionId;
  // Save updated questions to localStorage
  console.log(quizData.questions);
  localStorage.setItem(
    "randomizedQuestions",
    JSON.stringify(quizData.questions)
  );
}
/ * * * * * * * previous and next * * * * * * * * /;
function updateButtonState() {
  const nextButton = document.getElementById("next");
  const prevButton = document.getElementById("previous");

  // Disable/enable buttons based on the current index
  prevButton.style.visibility =
    currentQuestionIndex === 0 ? "hidden" : "visible";
  nextButton.style.visibility =
    currentQuestionIndex === quizData.questions.length - 1
      ? "hidden"
      : "visible";
}

// Event listeners for Next and Previous buttons
document.getElementById("next").addEventListener("click", () => {
  if (currentQuestionIndex < quizData.questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(
      quizData.questions[currentQuestionIndex],
      currentQuestionIndex
    );
    updateButtonState();
  }
});
document.getElementById("previous").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(
      quizData.questions[currentQuestionIndex],
      currentQuestionIndex
    );
    updateButtonState();
  }
});

/ * * * * * Need to submit on another json * * * * * /;
/// includes  -- user-name & user email --- answers (correct and wrong )  --- score)
function submitQuiz() {
  const questions = quizData.questions;
  let score = 0;

  questions.forEach((question) => {
    if (question.choosedOptionId === question.correctOptionId) {
      score++;
    }
  });

  alert(`Your score: ${score} out of ${questions.length}`);

  // Clear local storage to reset quiz
  localStorage.removeItem("randomizedQuestions");
  localStorage.removeItem("currentQuestionIndex");
  localStorage.removeItem("countdownFinishTime");
}
/ * * Timer logic  ✔✔    icon pulse* * /;
function startCountdown(hours, minutes, seconds) {
  const finishTime = localStorage.getItem("countdownFinishTime");
  if (!finishTime) {
    const currentTime = new Date().getTime(); // Define currentTime here
    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    const countdownFinishTime = currentTime + totalMilliseconds;
    localStorage.setItem("countdownFinishTime", countdownFinishTime);
    console.log("Countdown finish time set to:", countdownFinishTime);
  }
  initCountdown(); // Ensure the countdown starts
}
function initCountdown() {
  console.log("Initializing countdown...");
  const timerElement = document.getElementById("timer");
  const warningTimer = document.getElementById("warning-timer");
  const warningIcon = document.getElementById("warning-icon");

  const intervalId = setInterval(() => {
    const currentTime = new Date().getTime();
    const finishTime = localStorage.getItem("countdownFinishTime");

    if (!finishTime) {
      clearInterval(intervalId);
      return;
    }

    const remainingTime = Math.max(finishTime - currentTime, 0);

    if (remainingTime <= 0) {
      clearInterval(intervalId);
      localStorage.removeItem("countdownFinishTime");
      window.location.href = "TimeOut.html";
      return;
    }

    const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );

    const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    console.log(remainingHours, remainingMinutes, remainingSeconds); // nothing displayed //

    timerElement.textContent = `${String(remainingHours).padStart(
      2,
      "0"
    )}:${String(remainingMinutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;

    // Handle the warning styles when less than 2 minutes remain
    if (remainingHours === 0 && remainingMinutes < 2) {
      warningTimer.classList.add("text-red-500");
      warningIcon.classList.remove("text-sec-color");
      warningIcon.classList.add("text-red-500", "fa-beat-fade");
    } else {
      warningTimer.classList.remove("text-red-500");
      warningIcon.classList.remove("text-red-500", "fa-beat-fade");
      warningIcon.classList.add("text-sec-color");
    }
  }, 1000);
}

window.onload = () => {
  fetchQuizData();
  initCountdown();
};
