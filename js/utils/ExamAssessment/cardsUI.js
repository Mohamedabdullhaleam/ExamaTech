import { updateFlagUI } from "./buttonsUI.js";

export function updateCardUI(index, quizData) {
  const cardElement = document.getElementById(`card-${index + 1}`);
  const question = quizData.questions[index];
  cardElement.classList.toggle("answered", question.flags.isAnswered);
  cardElement.classList.toggle("flagged", question.flags.isFlagged);
}

/ * * * Update card dynamically * * * /;
export function checkCardColor() {
  const listItems = document.querySelectorAll(".question-number li");
  const currentQuestionIndex = parseInt(
    localStorage.getItem("currentQuestionIndex")
  );
  listItems.forEach((item, i) => {
    if (i === currentQuestionIndex) {
      item.classList.add("bg-main-color");
    } else {
      item.classList.remove("bg-main-color");
    }
  });
}
/ * * * update flagged card color * * * /;
export function updateCardColor() {
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

/ * * * * * * * Filters UI * * * * * * * /;
export function filterQuestions(filterType, currentFilter) {
  const cards = document.querySelectorAll("#cards li");
  currentFilter = filterType;
  const savedQuestions =
    JSON.parse(localStorage.getItem("randomizedQuestions")) || [];

  cards.forEach((card, index) => {
    const question = savedQuestions[index];
    const isAnswered = question.flags?.isAnswered || false;
    const isFlagged = question.flags?.isFlagged || false;

    let shouldShow = false;

    switch (filterType) {
      case "all":
        shouldShow = true;
        break;
      case "answered":
        shouldShow = isAnswered; // Show only answered questions
        break;
      case "not-answered":
        shouldShow = !isAnswered;
        break;
      case "flagged":
        shouldShow = isFlagged;
        break;
      default:
        shouldShow = true;
    }

    // Use visibility instead of display
    if (shouldShow) {
      card.style.visibility = "visible";
      card.style.opacity = "1";
    } else {
      card.style.visibility = "hidden";
      card.style.opacity = "0";
    }
  });
}
