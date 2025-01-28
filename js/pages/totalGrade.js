import { displayUserNameWithEffect } from "./textAnimation.js";

window.onload = () => {
  function getCurrentUsername() {
    return localStorage.getItem("loggedInUser");
  }

  async function fetchGradesByUsername() {
    const username = getCurrentUsername();
    if (!username) {
      console.error("No logged-in user found.");
      return null;
    }

    const url = `http://localhost:3020/grades?username=${username}`;

    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Failed to fetch grades: ${response.status}`);
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Error fetching grades:", error);
      return null;
    }
  }

  function calculateGradePercentage(userData) {
    const totalQuestions = userData.quizAttempts[0].attempts[0].answers.length;
    const score = userData.quizAttempts[0].bestScore;
    if (totalQuestions === 0) return "0.00";
    const percentage = (score / totalQuestions) * 100;
    return percentage.toFixed(2);
  }

  async function getUserQuizReport() {
    const userData = await fetchGradesByUsername();
    if (userData) {
      return {
        username: userData.username,
        bestScore: userData.quizAttempts[0].bestScore,
        gradePercentage: calculateGradePercentage(userData),
      };
    }
    return null;
  }

  getUserQuizReport().then((data) => {
    if (data) {
      document.getElementById("user-name").textContent = data.username;
      document.getElementById("grade").textContent = `${data.gradePercentage}%`;
    } else {
      document.getElementById("grade").textContent = "No grades available.";
    }
  });

  const title = document.getElementById("title");
  if (title) {
    displayUserNameWithEffect(title, "Exama-Tech");
  }

  const report = document.getElementById("report");
  if (report) {
    report.addEventListener("click", () => {
      window.location.href = "report.html";
    });
  }
};
