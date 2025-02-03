let quizData = {};
let currentQuestionIndex = 0;
import { displayUserNameWithEffect } from "./textAnimation.js";

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
      JSON.stringify(randomizedQuestions) /// to make an instance of it and use it as frequent as you want "same instance"
    );
    localStorage.setItem(
      "quizTime",
      JSON.stringify({ hours, minutes, seconds })
    );

    startCountdown(hours, minutes, seconds);
    initQuiz();
  } catch (error) {
    window.location.replace("notFound.html");
    console.error("Error fetching quiz data:", error);
    / * * * * Redirect to error page * * * * * /;
  }
}

function initQuiz() {
  currentQuestionIndex =
    parseInt(localStorage.getItem("currentQuestionIndex")) || 0;
  displayQuestion(
    quizData.questions[currentQuestionIndex],
    currentQuestionIndex
  );
}

/ * * * *   Disply  * * * * /;
function displayQuestion(question, index) {
  localStorage.setItem("currentQuestionIndex", index);

  quizData.questions.forEach((q) => {
    if (!q.flags) {
      q.flags = { isFlagged: false };
    }
  });

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

      radioInput.checked = question.choosedOptionId === option.id;

      radioInput.addEventListener("click", (event) =>
        handleOptionClick(event, optionElement, option.id)
      );
    }
  });
  updateButtonState();
}

// Unified function to handle answer selection
function handleOptionClick(event, optionElement, optionId = null) {
  const input = optionElement.querySelector("input");
  const questionIndex = localStorage.getItem("currentQuestionIndex");

  document.querySelectorAll("input[name='choice']").forEach((el) => {
    el.checked = false;
  });

  input.checked = true;

  const selectedOptionId =
    optionId ||
    quizData.questions[questionIndex].options[
      parseInt(input.id.split("-").pop())
    ].id;

  console.log("Q-id", quizData.questions[questionIndex].id);
  console.log("A.id", selectedOptionId);

  trackAnswer(quizData.questions[questionIndex].id, selectedOptionId);
}

// Attach event listeners after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".option");

  options.forEach((option) => {
    option.addEventListener("click", (event) =>
      handleOptionClick(event, option)
    );
  });
});

/ * * * * Tracking Answers * * * * /;
function trackAnswer(questionId, optionId) {
  const currentQuestion = quizData.questions.find((q) => q.id === questionId);
  const selectedOption = currentQuestion.options.find((o) => o.id === optionId);

  currentQuestion.choosedOptionId = optionId;
  currentQuestion.selectedAnswer = selectedOption.text;

  // Save updated questions to localStorage
  localStorage.setItem(
    "randomizedQuestions",
    JSON.stringify(quizData.questions)
  );
}

/ * * * *  Shuffling question * * * * /;
function shuffleQuestions(questions) {
  return questions.sort(() => Math.random() - 0.5);
}

/ * * * * * * * previous and next * * * * * * * * /;
function updateButtonState() {
  const nextButton = document.getElementById("next");
  const prevButton = document.getElementById("previous");
  const flagIcon = document.getElementById("flag-icon");
  const currentQuestion = quizData.questions[currentQuestionIndex];
  console.log("FROM UPDATE", currentQuestion.flags.isFlagged);
  if (!currentQuestion.flags.isFlagged) {
    flagIcon.classList.remove("text-flag-color");
    flagIcon.classList.add("text-main-color");
  } else {
    flagIcon.classList.remove("text-main-color");
    flagIcon.classList.add("text-flag-color");
  }

  // Disable/enable buttons based on the current index
  prevButton.style.visibility =
    currentQuestionIndex === 0 ? "hidden" : "visible";
  nextButton.style.visibility =
    currentQuestionIndex === quizData.questions.length - 1
      ? "hidden"
      : "visible";
}

document.getElementById("next").addEventListener("click", () => {
  if (currentQuestionIndex < quizData.questions.length - 1) {
    currentQuestionIndex++;
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex); // Save index
    displayQuestion(
      quizData.questions[currentQuestionIndex],
      currentQuestionIndex
    );
    checkCardColor();
    updateButtonState();
  }
});

document.getElementById("previous").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex); // Save index
    displayQuestion(
      quizData.questions[currentQuestionIndex],
      currentQuestionIndex
    );
    checkCardColor();
    updateButtonState();
  }
});

/ * * * * * Need to submit on another json * * * * * /;
/// includes  -- user-name & user email --- answers (correct and wrong )  --- score)
// Retrieve user information from localStorage
function getUserInfo() {
  const username = localStorage.getItem("loggedInUser") || "Ash_1803";
  const email = localStorage.getItem("email") || "john.doe@example.com"; // sent from login
  return { username, email };
}

// Calculate score and prepare answers array
function calculateScoreAndAnswers(questions) {
  let score = 0;
  const answers = [];

  questions.forEach((question, index) => {
    const isCorrect = question.choosedOptionId === question.correctOptionId;
    if (isCorrect) score++;

    answers.push({
      questionIndex: index,
      question: question.question, // Include the question text
      selectedOptionId: question.choosedOptionId || null,
      selectedAnswer: question.selectedAnswer || "",
      isCorrect: isCorrect,
    });
  });

  return { score, answers };
}

async function fetchUserGrades(username) {
  try {
    const response = await fetch(
      `http://localhost:3020/grades?username=${username}`
    );
    return response.ok ? await response.json() : [];
  } catch (error) {
    window.location.replace("notFound.html");
    console.error("Error fetching user grades:", error);
    return [];
  }
}

// Prepare the payload based on the user data and new attempt
function preparePayload(userData, username, email, score, answers, timeTaken) {
  const completedAt = new Date().toISOString();
  const newAttempt = {
    attemptId: 1,
    score,
    answers,
    timeTaken,
    completedAt,
  };

  if (userData.length > 0) {
    const payload = { ...userData[0] };
    const quizIndex = payload.quizAttempts.findIndex(
      (q) => q.quizId === "quiz_101"
    );

    if (quizIndex >= 0) {
      const existingQuiz = payload.quizAttempts[quizIndex];
      newAttempt.attemptId = existingQuiz.attempts.length + 1;
      existingQuiz.attempts.push(newAttempt);
      existingQuiz.bestScore = Math.max(existingQuiz.bestScore, score);
    } else {
      payload.quizAttempts.push({
        quizId: "quiz_101",
        attempts: [newAttempt],
        bestScore: score,
      });
    }
    return payload;
  } else {
    return {
      username,
      email,
      quizAttempts: [
        {
          quizId: "quiz_101",
          attempts: [newAttempt],
          bestScore: score,
        },
      ],
    };
  }
}

// Submit the quiz data to the server
async function submitQuizData(payload) {
  try {
    const response = await fetch("http://localhost:3020/grades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    window.location.replace("notFound.html");
    console.error("Error submitting quiz data:", error);
    return false;
  }
}

// Clear localStorage and redirect after submission
function clearLocalStorageAndRedirect() {
  localStorage.removeItem("randomizedQuestions");
  localStorage.removeItem("currentQuestionIndex");
  localStorage.removeItem("countdownFinishTime");
  // window.location.replace("report.html");
}

// Main function to handle quiz submission
async function submitQuiz() {
  const { username, email } = getUserInfo();
  const { score, answers } = calculateScoreAndAnswers(quizData.questions);
  const quizStartTime = localStorage.getItem("quizStartTime");
  const quizEndTime = new Date().getTime();
  const timeTaken = quizStartTime ? quizEndTime - parseInt(quizStartTime) : 0;

  const formattedTimeTaken = formatTimeTaken(timeTaken); // Format time taken

  const userData = await fetchUserGrades(username);
  const payload = preparePayload(
    userData,
    username,
    email,
    score,
    answers,
    formattedTimeTaken
  );
  const success = await submitQuizData(payload);
  if (score > 5) {
    clearLocalStorageAndRedirect();
    window.location.replace("successPage.html");
  } else {
    clearLocalStorageAndRedirect();
    window.location.replace("failurePage.html");
  }
}

const submit = document.getElementById("submit");

submit.addEventListener("click", () => {
  submitQuiz();
});

/ * * * * * * * * * * * * * * *  * * Timer logic  ✔✔    icon pulse* * * * * * * * * * * * * * * * * * * * * * * * /;

function formatTimeTaken(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function startCountdown(hours, minutes, seconds) {
  const finishTime = localStorage.getItem("countdownFinishTime");
  if (!finishTime) {
    const currentTime = new Date().getTime();
    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    const countdownFinishTime = currentTime + totalMilliseconds;
    localStorage.setItem("countdownFinishTime", countdownFinishTime);
    localStorage.setItem("quizStartTime", currentTime);
    // console.log("Countdown finish time set to:", countdownFinishTime);
  }
  initCountdown();
}
function initCountdown() {
  // console.log("Initializing countdown...");
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
      window.location.replace("timeOut.html");
      return;
    }

    const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );

    const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    // console.log(remainingHours, remainingMinutes, remainingSeconds); // nothing displayed //

    timerElement.textContent = `${String(remainingHours).padStart(
      2,
      "0"
    )}:${String(remainingMinutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
    warningTimer.classList.remove("invisible");

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

// console.log(currentQuestionIndex);
/ * * * * Flags functionality * * * * /;
const flagIcon = document.getElementById("flag-icon");
flagIcon.addEventListener("click", () => {
  const currentQuestion = quizData.questions[currentQuestionIndex];
  flagIcon.classList.toggle("text-main-color");
  flagIcon.classList.toggle("text-flag-color");
  console.log("flag--orange");
  if (!currentQuestion.flags) {
    currentQuestion.flags = { isFlagged: false };
  }
  currentQuestion.flags.isFlagged = !currentQuestion.flags.isFlagged;

  localStorage.setItem(
    "randomizedQuestions",
    JSON.stringify(quizData.questions)
  );

  updateFlagUI(currentQuestionIndex, currentQuestion.flags.isFlagged);

  console.log(
    `Question ${currentQuestionIndex + 1} is ${
      currentQuestion.flags.isFlagged ? "flagged" : "unflagged"
    }.`
  );
});

function updateFlagUI(index, isFlagged) {
  const cardElement = document.getElementById(`card-${index + 1}`);
  if (isFlagged) {
    cardElement.classList.add("bg-flag-color");
  } else {
    cardElement.classList.remove("bg-flag-color");
  }
}

/ * * * *  Cards Color and clicks * * * * * */;
// / * * * * also check next prev to combine the logic * * * * * * /
function checkCardColor() {
  const listItems = document.querySelectorAll(".question-number li");

  // Ensure currentQuestionIndex is used to set the active background
  listItems.forEach((item, i) => {
    if (i === currentQuestionIndex) {
      item.classList.add("bg-main-color");
    } else {
      item.classList.remove("bg-main-color");
    }
  });
}
function updateCardColor() {
  const savedQuestions = JSON.parse(
    localStorage.getItem("randomizedQuestions")
  );
  if (savedQuestions) {
    savedQuestions.forEach((question, index) => {
      const isFlagged = question.flags && question.flags.isFlagged;
      updateFlagUI(index, isFlagged);
    });
  }
}
const cards = document.getElementById("cards");
cards.addEventListener("click", (event) => {
  const liElement = event.target;
  if (liElement.tagName === "LI") {
    const index = Array.from(cards.children).indexOf(liElement);
    currentQuestionIndex = index;
    localStorage.setItem("currentQuestionIndex", index);
    updateButtonState();
    displayQuestion(
      quizData.questions[currentQuestionIndex],
      currentQuestionIndex
    );
    checkCardColor();
  }
});
window.onload = () => {
  fetchQuizData();
  checkCardColor();
  initCountdown();
  updateCardColor();
  updateButtonState();

  const title = document.getElementById("title");
  displayUserNameWithEffect(title, "Exama-Tech");

  // const userName = document.getElementById("user");
  // if (localStorage.getItem("loggedInUser")) {
  //   displayUserNameWithEffect(
  //     userName,
  //     `Welcome ${localStorage.getItem("loggedInUser")} , Good Luck ❣`
  //   );
  // }

  const savedIndex = parseInt(localStorage.getItem("currentQuestionIndex"));
  if (!isNaN(savedIndex)) {
    currentQuestionIndex = savedIndex;
  }
};
setTimeout(() => {
  const userName = document.getElementById("user");
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    displayUserNameWithEffect(
      userName,
      `Welcome ${loggedInUser} , Good Luck ❣`
    );
  }
}, 100); // Delay by 100ms or adjust as needed
