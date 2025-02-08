export function updateCardUI(index, quizData) {
  const cardElement = document.getElementById(`card-${index + 1}`);
  const question = quizData.questions[index];
  cardElement.classList.toggle("answered", question.flags.isAnswered);
  cardElement.classList.toggle("flagged", question.flags.isFlagged);
}
