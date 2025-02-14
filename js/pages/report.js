import {
  displayUserNameWithEffect,
  animateIcons,
} from "../utils/textAnimation.js";
import {
  calculateGradePercentage,
  fetchGradesByUsername,
} from "../utils/gradeCalculations/examStats.js";
import { hideLoading, showLoading } from "../utils/loading/loadingState.js";

/ * * *  Animation * * * /;
//1- Text
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");
//2- Icon
document.addEventListener("DOMContentLoaded", () => {
  animateIcons();
});

/ * * * prepare the data to be displayed * * * /;
async function getUserQuizReport() {
  showLoading(); // Show loading indicator
  const userData = await fetchGradesByUsername();
  hideLoading(); // Hide loading indicator once data is fetched

  if (userData) {
    const quizAttempts = userData.quizAttempts[0].attempts;
    const lastAttempt = quizAttempts[quizAttempts.length - 1];
    const score = lastAttempt.score;
    const date = lastAttempt.completedAt;
    const timeTaken = lastAttempt.timeTaken;
    const username = userData.username;
    const gradePercentage = calculateGradePercentage(userData);
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(timeTaken);

    return {
      username,
      score,
      date,
      timeTaken,
      gradePercentage,
      formattedDate,
      formattedTime,
    };
  }
  return null;
}

/ * * * Format Data to be displayed * * * /;
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-GB", options);
}

function formatTime(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  return `${totalMinutes} mins`;
}

/ * * * Display all data * * * /;
getUserQuizReport().then((data) => {
  if (data) {
    const userName = document.getElementById("user-name");
    displayUserNameWithEffect(userName, `Hello ${data.username} 🖤`);
    document.getElementById("grade").textContent = `${data.gradePercentage}%`;
    document.getElementById("date").textContent = `${data.formattedDate}`;
    document.getElementById("time").textContent = `${data.formattedTime}`;
  }
});

/ * * * * * * * * * View Questions * * * * * * /;
// Function to display questions dynamically
async function displayQuestions() {
  showLoading(); // Show loading before fetching data
  const userData = await fetchGradesByUsername();
  hideLoading(); // Hide loading after data is fetched

  const quizAttempts = userData.quizAttempts[0].attempts;
  const questions = quizAttempts[quizAttempts.length - 1].answers;

  // Container to append the questions dynamically
  const container = document.getElementById("question-container");

  questions.forEach((element, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = `border-2 rounded-lg flex justify-center items-center gap-2 h-16 w-full transition duration-500 ease-in-out cursor-pointer ${
      element.isCorrect ? "border-main-color" : "border-red-500"
    }`;

    const icon = document.createElement("i");
    icon.className = `fa-regular ${
      element.isCorrect
        ? "fa-circle-check text-green-500"
        : "fa-circle-xmark text-red-500"
    } text-xl`;

    const paragraph = document.createElement("p");
    paragraph.className = "text-xl";
    paragraph.textContent = `${index + 1}. ${element.question}`;

    // Append icon and paragraph to the question div
    questionDiv.appendChild(icon);
    questionDiv.appendChild(paragraph);

    // Add the question div to the container
    container.appendChild(questionDiv);
    questionDiv.addEventListener("click", () => {
      const originalText = `${index + 1}. ${element.question}`;
      if (paragraph.textContent === originalText) {
        // Update text based on the icon type
        paragraph.textContent = `Your Answer: ${
          element.selectedAnswer ? element.selectedAnswer : "Not Answered"
        }`;
        if (icon) icon.style.display = "none";
      } else {
        paragraph.textContent = originalText;
        if (icon) icon.style.display = "inline-block";
      }

      questionDiv.classList.add("scale-105");
      setTimeout(() => questionDiv.classList.remove("scale-105"), 300);
    });
  });
}

/ * * *  Event Listeners * * * /;
/ * * Sign-Out * */;
const signOutButton = document.getElementById("sign-out");
signOutButton.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "signIn.html";
});

// 💔💔💔 window.location.replace() 😥

document.addEventListener("DOMContentLoaded", () => {
  displayQuestions();
  / * * * to prevent going back after sign-out * * * * /;
  if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "signIn.html";
  }
});
