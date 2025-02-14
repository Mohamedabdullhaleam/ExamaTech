import { displayUserNameWithEffect } from "../utils/textAnimation.js";
import {
  calculateGradePercentage,
  fetchGradesByUsername,
} from "../utils/gradeCalculations/examStats.js";

/ * * * Animation * * * /;
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");

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
