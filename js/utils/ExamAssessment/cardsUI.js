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
