import { displayUserNameWithEffect } from "../utils/textAnimation.js";

/ * * * Animation * * * /;
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");

/ * * * get user data * * * /;
function getCurrentUsername() {
  return localStorage.getItem("loggedInUser");
}

/ * * * Get last user data * * * /;
async function fetchGradesByUsername() {
  const username = getCurrentUsername();
  if (!username) {
    console.error("No logged-in user found.");
    throw new Error(`No User Founded`);
  }
  const url = `http://localhost:3020/grades?username=${username}`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch grades: ${response.status}`);
    const data = await response.json();
    // get the lasr user data
    return data.length > 0 ? data[data.length - 1] : null;
  } catch (error) {
    window.location.replace("notFound.html");
    console.error("Error fetching grades:", error);
    return null;
  }
}

/ * * * Calculate grade percentage * * * /;
function calculateGradePercentage(userData) {
  const totalQuestions = userData.quizAttempts[0].attempts[0].answers.length;
  const quizAttempts = userData.quizAttempts[0].attempts;
  const lastAttempt = quizAttempts[quizAttempts.length - 1];
  const score = lastAttempt.score;
  if (totalQuestions === 0) return "0.00";
  const percentage = (score / totalQuestions) * 100;
  return percentage.toFixed(2);
}

/ * * * Prepare data to be displayed * * * /;
async function getUserQuizReport() {
  const userData = await fetchGradesByUsername();
  if (userData) {
    return {
      username: userData.username,
      gradePercentage: calculateGradePercentage(userData),
    };
  }
  return null;
}

/ * * *   Display data * * * /;
getUserQuizReport().then((data) => {
  if (data) {
    document.getElementById("user-name").textContent = data.username;
    document.getElementById("grade").textContent = `${data.gradePercentage}%`;
  } else {
    document.getElementById("grade").textContent = "No grades available.";
  }
});

/ * * * Event listeners * * * /;
/ * * Redirecctions * * /;
const report = document.getElementById("report");
report.addEventListener("click", () => {
  window.location.href = "report.html";
});
