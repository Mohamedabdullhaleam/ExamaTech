let quizData = {};

// Fetch only the questions from the endpoint
async function fetchQuestions() {
  try {
    const response = await fetch("http://localhost:3010/questions");

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const questions = await response.json();

    if (!questions || questions.length === 0) {
      console.error("No questions available.");
      return;
    }

    quizData.questions = questions;

    console.log("Questions fetched successfully:", quizData.questions);

    // localStorage.setItem("quizQuestions", JSON.stringify(quizData.questions));
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
  }
}

// Call the fetchQuestions function to get the questions
fetchQuestions();
async function logQuizQuestions() {
  await fetchQuestions();
  console.log(quizData.questions);
}
