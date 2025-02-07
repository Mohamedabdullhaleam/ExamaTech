import { displayUserNameWithEffect } from "../utils/textAnimation.js";

/ * * *  Animation * * * /;
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");

function getCurrentUsername() {
  return localStorage.getItem("loggedInUser");
}

/ * * * * *  * * * * * * * *  * * * * * *  * * * /;
function calculateGradePercentage(userData) {
  const totalQuestions = userData.quizAttempts[0].attempts[0].answers.length;
  const quizAttempts = userData.quizAttempts[0].attempts;
  const lastAttempt = quizAttempts[quizAttempts.length - 1];
  const score = lastAttempt.score;
  //   console.log("Sc", score);
  const percentage = (score / totalQuestions) * 100;
  return percentage.toFixed(2);
}

async function fetchGradesByUsername() {
  const username = getCurrentUsername();
  const url = `http://localhost:3020/grades?username=${username}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    if (data.length > 0) {
      return data[data.length - 1];
    } else {
      console.error("No grades found for the user.");
      window.location.replace("notFound.html");
      return null;
    }
  } catch (error) {
    window.location.replace("notFound.html");
    console.error("Error fetching grades data:", error);
  }
}

/ * * * * * * *  * * * *  * * * *  * * * * * *  * * * /;
// Get and display the user data
async function getUserQuizReport() {
  const userData = await fetchGradesByUsername();
  if (userData) {
    const quizAttempts = userData.quizAttempts[0].attempts;
    const lastAttempt = quizAttempts[quizAttempts.length - 1];
    const bestScore = lastAttempt.score;
    const date = lastAttempt.completedAt;
    const timeTaken = lastAttempt.timeTaken;
    const username = userData.username;
    const gradePercentage = calculateGradePercentage(userData);
    const formattedDate = formatDate(date);
    const formattedTime = formatTime(timeTaken);

    return {
      username,
      bestScore,
      date,
      timeTaken,
      gradePercentage,
      formattedDate,
      formattedTime,
    };
  }
  return null;
}

/ * * * * * Calculations functions * * * * * /;
// Function to calculate the grade percentage
// 1- grade percentage

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
  const userData = await fetchGradesByUsername();
  const quizAttempts = userData.quizAttempts[0].attempts;
  const questions = quizAttempts[quizAttempts.length - 1].answers;

  // Container to append the questions dynamically
  const container = document.getElementById("question-container");
  if (!container) {
    console.error("Container element not found!");
    / * * * * I think no error may happen here * * * * /;
    return;
  }

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
          element.selectedAnswer ? element.selectedAnswer : "Not Answerd"
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

const signOutButton = document.getElementById("sign-out");

signOutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  localStorage.clear();
  window.location.href = "signIn.html";
});

document.addEventListener("DOMContentLoaded", () => {
  displayQuestions();

  / * * * to prevent going back after sign-out * * * * /;
  if (!localStorage.getItem("loggedInUser")) {
    window.location.href = "signIn.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const gradeCard = document.querySelector(".grade");
  const timeCard = document.querySelector(".time");
  const dateCard = document.querySelector(".date");

  const medalIcon = gradeCard.querySelector(".fa-medal");
  const sandIcon = timeCard.querySelector(".fa-hourglass-half");
  const calendarIcon = dateCard.querySelector(".fa-calendar-days");

  // Function to add a temporary class
  const addTemporaryClass = (element, className, duration) => {
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, duration);
  };

  // Add hover event listeners
  gradeCard.addEventListener("mouseenter", () => {
    addTemporaryClass(medalIcon, "fa-flip", 1000);
  });

  timeCard.addEventListener("mouseenter", () => {
    addTemporaryClass(sandIcon, "fa-flip", 1000);
  });

  dateCard.addEventListener("mouseenter", () => {
    addTemporaryClass(calendarIcon, "fa-bounce", 500);
  });
});
