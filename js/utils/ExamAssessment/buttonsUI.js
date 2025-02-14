/ * * * * * * * Flags , previous and Next UI update* * * * * * * * /;

export function updateButtonState(quizData) {
  const nextButton = document.getElementById("next");
  const prevButton = document.getElementById("previous");
  const flagIcon = document.getElementById("flag-icon");
  const currentQuestionIndex = parseInt(
    localStorage.getItem("currentQuestionIndex")
  );
  console.log("from update button: ", currentQuestionIndex);
  const currentQuestion = quizData.questions[currentQuestionIndex];
  console.log("FROM UPDATE", currentQuestion.flags.isFlagged);
  if (!currentQuestion.flags.isFlagged) {
    flagIcon.classList.remove("text-flag-color");
    flagIcon.classList.add("text-main-color");
  } else {
    flagIcon.classList.remove("text-main-color");
    flagIcon.classList.add("text-flag-color");
  }
  prevButton.style.visibility =
    currentQuestionIndex === 0 ? "hidden" : "visible";
  nextButton.style.visibility =
    currentQuestionIndex === quizData.questions.length - 1
      ? "hidden"
      : "visible";
}

/ * * * Toggle flag depending on its state * * * /;
export function updateFlagUI(index, isFlagged) {
  const cardElement = document.getElementById(`card-${index + 1}`);
  if (isFlagged) {
    cardElement.classList.add("bg-flag-color");
  } else {
    cardElement.classList.remove("bg-flag-color");
  }
}
