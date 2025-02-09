let currentFilter = "all";
let quizData = {};
let currentQuestionIndex = 0;

import { displayUserNameWithEffect } from "../utils/textAnimation.js";
import {
  updateButtonState,
  updateFlagUI,
} from "../utils/ExamAssessment/buttonsUI.js";
import {
  updateCardUI,
  checkCardColor,
  updateCardColor,
  filterQuestions,
} from "../utils/ExamAssessment/cardsUI.js";

import { submitQuiz } from "../utils/ExamAssessment/quizSubmition.js";

import { shuffleQuestions } from "../utils/ExamAssessment/helpers.js";

import {
  startCountdown,
  initCountdown,
} from "../utils/ExamAssessment/timer.js";

/ * * *  Animation * * * /;
setTimeout(() => {
  const title = document.getElementById("title");
  const userName = document.getElementById("user");
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    displayUserNameWithEffect(title, "Exama-Tech");
    displayUserNameWithEffect(
      userName,
      `Welcome ${loggedInUser} , Good Luck ❣`
    );
  }
}, 100);

/ * * * Fetching Data * * * /;
// check local storage first to get the data
// if not found fetch from the Api
async function fetchQuizData() {
  try {
    const savedQuestions = localStorage.getItem("randomizedQuestions");
    if (savedQuestions) {
      quizData.questions = JSON.parse(savedQuestions);
      initQuiz();
      return;
    }
    // no data in local storage // time to fetch data
    const response = await fetch("http://localhost:3010/quiz");
    if (!response.ok) {
      throw new Error("Failed to fetch quiz data");
    }

    quizData = await response.json();
    const { hours, minutes, seconds } = quizData.quizTime;
    const randomizedQuestions = shuffleQuestions(quizData.questions);
    quizData.questions = randomizedQuestions; // Store shuffled questions in quizData

    localStorage.setItem(
      "randomizedQuestions",
      JSON.stringify(randomizedQuestions) /// to make an instance of it and use it as frequent as you want "same instance"
    );
    localStorage.setItem(
      "quizTime",
      JSON.stringify({ hours, minutes, seconds })
    );
    / * * * Start quiz displaying and logic * * * /;
    startCountdown(hours, minutes, seconds);
    initQuiz();
  } catch (error) {
    window.location.replace("notFound.html");
    console.error("Error fetching quiz data:", error);
  }
}

/ * * * intializing quiz from specific question * * * /;
function initQuiz() {
  currentQuestionIndex =
    parseInt(localStorage.getItem("currentQuestionIndex")) || 0;
  displayQuestion(
    quizData.questions[currentQuestionIndex],
    currentQuestionIndex
  );
}

/ * * * *   Display  * * * * /;
function displayQuestion(question, index) {
  localStorage.setItem("currentQuestionIndex", index);

  quizData.questions.forEach((q) => {
    if (!q.flags) {
      q.flags = { isFlagged: false };
    }
  });

  / * * * displaying questions  * * * /;
  const questionNumberElement = document.getElementById("q-number-text");
  questionNumberElement.innerHTML = `${
    index + 1
  }. <span id="question-text" class="font-bold">${question.question}</span>`;

  / * * * displaying Answesrs  * * * /;
  question.options.forEach((option, optionIndex) => {
    const optionElement = document.getElementById(`option-${optionIndex + 1}`);
    if (optionElement) {
      const radioInput = optionElement.querySelector("input");
      const radioLabel = optionElement.querySelector("label");

      radioInput.id = `choice-${index}-${optionIndex}`;
      radioLabel.setAttribute("for", radioInput.id);
      radioLabel.textContent = option.text;

      radioInput.checked = question.choosedOptionId === option.id;
      if (question.choosedOptionId === option.id) {
        optionElement.classList.add("bg-main-color");
      } else {
        optionElement.classList.remove("bg-main-color");
      }

      radioInput.addEventListener("click", (event) =>
        handleOptionClick(event, optionElement, option.id)
      );
    }
  });
  updateButtonState(quizData);
}

// Unified function to handle answer selection
function handleOptionClick(event, optionElement, optionId = null) {
  const input = optionElement.querySelector("input");
  const questionIndex = localStorage.getItem("currentQuestionIndex");
  // Remove 'bg-main-color' from all options in the current question
  document.querySelectorAll(".option").forEach((el) => {
    el.classList.remove("bg-main-color");
  });

  // Add 'bg-main-color' to the clicked option
  optionElement.classList.add("bg-main-color");

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
  // Save selected option styling to localStorage
  saveSelectedOptionStyle(questionIndex, optionElement.id);

  // Update the card UI after answering
  updateCardUI(questionIndex, quizData);
}

// Save selected option styles to localStorage
function saveSelectedOptionStyle(questionIndex, optionId) {
  let savedStyles =
    JSON.parse(localStorage.getItem("selectedOptionsStyles")) || {};
  savedStyles[questionIndex] = optionId;
  localStorage.setItem("selectedOptionsStyles", JSON.stringify(savedStyles));
}

// Load selected options styles from localStorage
function loadSelectedOptionStyles() {
  let savedStyles =
    JSON.parse(localStorage.getItem("selectedOptionsStyles")) || {};
  const questionIndex = localStorage.getItem("currentQuestionIndex");

  if (savedStyles[questionIndex]) {
    const optionId = savedStyles[questionIndex];
    const optionElement = document.getElementById(optionId);
    if (optionElement) {
      optionElement.classList.add("bg-main-color");
    }
  }
}

// Attach event listeners after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".option");

  options.forEach((option) => {
    option.addEventListener("click", (event) =>
      handleOptionClick(event, option)
    );
  });
  loadSelectedOptionStyles(); // Load saved styles on page reload
});

/ * * * * Tracking Answers * * * * /;
function trackAnswer(questionId, optionId) {
  const currentQuestion = quizData.questions.find((q) => q.id === questionId);
  const selectedOption = currentQuestion.options.find((o) => o.id === optionId);

  currentQuestion.choosedOptionId = optionId;
  currentQuestion.selectedAnswer = selectedOption.text;
  // Update flags.isAnswered to true
  if (!currentQuestion.flags) {
    currentQuestion.flags = { isAnswered: false };
  }

  currentQuestion.flags.isAnswered = true;

  // Save updated questions to localStorage
  localStorage.setItem(
    "randomizedQuestions",
    JSON.stringify(quizData.questions)
  );
  filterQuestions(currentFilter, currentFilter); // Refresh the filter
  updateCardUI(currentQuestionIndex, quizData);
}

/ * * * * * * * * * * * Event listeners * * * * * * * * * * * * * * */;
/ * * * buttons * * * /;
//1-Next
document.getElementById("next").addEventListener("click", () => {
  if (currentQuestionIndex < quizData.questions.length - 1) {
    currentQuestionIndex++;
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex); // Save index
    displayQuestion(
      quizData.questions[currentQuestionIndex],
      currentQuestionIndex
    );
    checkCardColor();
    updateButtonState(quizData);
  }
});
//2-previous
document.getElementById("previous").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex); // Save index
    displayQuestion(
      quizData.questions[currentQuestionIndex],
      currentQuestionIndex
    );
    checkCardColor();
    updateButtonState(quizData);
  }
});
//3-Flag
const flagIcon = document.getElementById("flag-icon");
flagIcon.addEventListener("click", () => {
  const currentQuestion = quizData.questions[currentQuestionIndex];
  if (!currentQuestion.flags) {
    currentQuestion.flags = { isFlagged: false };
  }
  currentQuestion.flags.isFlagged = !currentQuestion.flags.isFlagged;

  flagIcon.classList.toggle("text-main-color");
  flagIcon.classList.toggle("text-flag-color");
  console.log("flag--orange");

  localStorage.setItem(
    "randomizedQuestions",
    JSON.stringify(quizData.questions)
  );
  filterQuestions(currentFilter, currentFilter);

  updateFlagUI(currentQuestionIndex, currentQuestion.flags.isFlagged);
  updateCardUI(currentQuestionIndex, quizData);

  console.log(
    `Question ${currentQuestionIndex + 1} is ${
      currentQuestion.flags.isFlagged ? "flagged" : "unflagged"
    }.`
  );
});
/ * * * Cards * * * /;
const cards = document.getElementById("cards");
cards.addEventListener("click", (event) => {
  const liElement = event.target;
  if (liElement.tagName === "LI") {
    const index = Array.from(cards.children).indexOf(liElement);
    currentQuestionIndex = index;
    localStorage.setItem("currentQuestionIndex", index);
    updateButtonState(quizData);
    displayQuestion(
      quizData.questions[currentQuestionIndex],
      currentQuestionIndex
    );
    checkCardColor();
  }
});

/ * * * * Event listener to Submit quiz * * * * /;
const submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  submitQuiz(quizData);
});

document.addEventListener("DOMContentLoaded", () => {
  const listItems = document.querySelectorAll(".questions-list li");

  listItems.forEach((item) => {
    item.addEventListener("click", () => {
      listItems.forEach((li) => {
        li.classList.remove("bg-main-color");
        li.classList.remove("text-white");
      });
      item.classList.add("bg-main-color");
      item.classList.add("text-white");

      // Get the filter type from the clicked item's text content [answered - not answered - flagged]
      const filterType = item.textContent.trim().toLowerCase();
      currentFilter = filterType;
      filterQuestions(filterType, currentFilter);
    });
  });

  // Initially show all questions
  filterQuestions("all", currentFilter);
});

window.onload = () => {
  fetchQuizData();
  filterQuestions("all", currentFilter); // Show all questions initially
  updateCardUI(currentQuestionIndex, quizData); // Update the UI for the current question
  checkCardColor();
  initCountdown();
  updateCardColor();
  updateButtonState(quizData);

  const savedIndex = parseInt(localStorage.getItem("currentQuestionIndex"));
  if (!isNaN(savedIndex)) {
    currentQuestionIndex = savedIndex;
  }
};
