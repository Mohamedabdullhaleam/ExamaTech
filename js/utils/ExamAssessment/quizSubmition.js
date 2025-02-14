import { clearLocalStorageAndRedirect, formatTimeTaken } from "./helpers.js";
import { hideLoading, showLoading } from "../loading/loadingState.js";
/ * * * getting user info * * * /;
export function getUserInfo() {
  const username = localStorage.getItem("loggedInUser") || "Ash_1803";
  const email = localStorage.getItem("email") || "john.doe@example.com";
  return { username, email };
}

showLoading();
/ * * * fetch current user grades * * * /;
export async function fetchUserGrades(username) {
  try {
    const response = await fetch(
      `http://localhost:3020/grades?username=${username}`
    );
    hideLoading();
    return response.ok ? await response.json() : [];
  } catch (error) {
    hideLoading();
    window.location.replace("notFound.html");
    console.error("Error fetching user grades:", error);
    return [];
  }
}

/ * * *  Calculate score * * * /;
export function calculateScoreAndAnswers(questions) {
  let score = 0;
  const answers = [];

  questions.forEach((question, index) => {
    const isCorrect = question.choosedOptionId === question.correctOptionId;
    if (isCorrect) score++;

    answers.push({
      questionIndex: index,
      question: question.question,
      selectedOptionId: question.choosedOptionId || null,
      selectedAnswer: question.selectedAnswer || "",
      isCorrect: isCorrect,
    });
  });

  return { score, answers };
}

/ * * * Prepare the payload based on the user data and new attempt * * * /;
export function preparePayload(
  userData,
  username,
  email,
  score,
  answers,
  timeTaken
) {
  const completedAt = new Date().toISOString();
  const newAttempt = {
    attemptId: 1,
    score,
    answers,
    timeTaken,
    completedAt,
  };

  // if user has multiple attempts
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

/ * * * Post grades * * * /;
showLoading();
export async function submitQuizData(payload) {
  try {
    const response = await fetch("http://localhost:3020/grades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    hideLoading();
    return response.ok;
  } catch (error) {
    hideLoading();
    window.location.replace("notFound.html");
    console.error("Error submitting quiz data:", error);
    return false;
  }
}

/ * * * Main function for submition * * * /;
export async function submitQuiz(quizData) {
  const { username, email } = getUserInfo();
  const { score, answers } = calculateScoreAndAnswers(quizData.questions);
  const quizStartTime = localStorage.getItem("quizStartTime");
  const quizEndTime = new Date().getTime();
  const timeTaken = quizStartTime ? quizEndTime - parseInt(quizStartTime) : 0;

  const formattedTimeTaken = formatTimeTaken(timeTaken);

  const userData = await fetchUserGrades(username);
  const payload = preparePayload(
    userData,
    username,
    email,
    score,
    answers,
    formattedTimeTaken
  );

  await submitQuizData(payload);
  if (score > 5) {
    clearLocalStorageAndRedirect();
    window.location.replace("successPage.html");
  } else {
    clearLocalStorageAndRedirect();
    window.location.replace("failurePage.html");
  }
}
