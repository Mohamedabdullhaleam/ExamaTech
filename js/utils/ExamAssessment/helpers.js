/ * * * *  Shuffling question * * * * /;
export function shuffleQuestions(questions) {
  return questions.sort(() => Math.random() - 0.5);
}

// Clear localStorage and redirect after submission
export function clearLocalStorageAndRedirect() {
  localStorage.removeItem("randomizedQuestions");
  localStorage.removeItem("currentQuestionIndex");
  localStorage.removeItem("countdownFinishTime");
}

export function formatTimeTaken(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}
