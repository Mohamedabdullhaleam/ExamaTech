function getCurrentUsername() {
  return localStorage.getItem("username") || "Ash_1803";
}
// Async function to fetch user data by username
async function fetchGradesByUsername() {
  const username = getCurrentUsername();
  const url = `http://localhost:3020/grades?username=${username}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    if (data.length > 0) {
      return data[0];
    } else {
      console.error("No grades found for the user.");

      / * * * Handling Empty state * * * /;

      return null;
    }
  } catch (error) {
    console.error("Error fetching grades data:", error);
    / * * * *  ERROR * * * * * * /;
  }
}

/ * * * * * * * * * JS animation file * * * * * * * /;
function displayUserNameWithEffect(messageElement, message) {
  let index = 0;
  const intervalId = setInterval(() => {
    messageElement.textContent = message.substring(0, index + 1);
    index++;
    if (index >= message.length) {
      clearInterval(intervalId);
      const blinkInterval = setInterval(() => {
        messageElement.textContent = message + (index % 2 === 0 ? "|" : ""); // Blink cursor effect
        index++;
        if (index >= message.length + 6) {
          clearInterval(blinkInterval);
          messageElement.textContent = message; // Stop blinking and show complete message
        }
      }, 500);
    }
  }, 150);
}
/ * * * * * heading * * * /;
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");

// Get and display the user data
async function getUserQuizReport() {
  const userData = await fetchGradesByUsername();
  if (userData) {
    // console.log(userData);
    const quizData = userData.quizAttempts[0].attempts[0];
    const bestScore = userData.quizAttempts[0].bestScore;
    // console.log("bestScore", bestScore);
    const date = quizData.completedAt;
    const timeTaken = quizData.timeTaken;
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
function calculateGradePercentage(userData) {
  const totalQuestions = userData.quizAttempts[0].attempts[0].answers.length;
  //   console.log("tq", totalQuestions);
  const score = userData.quizAttempts[0].bestScore;
  //   console.log("Sc", score);
  const percentage = (score / totalQuestions) * 100;
  //   console.log("percent", percentage);
  return percentage.toFixed(2);
}
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

getUserQuizReport().then((data) => {
  if (data) {
    document.getElementById(
      "user-name"
    ).textContent = `Hello ${data.username}🥰`;
    document.getElementById("grade").textContent = `${data.gradePercentage}%`;
    document.getElementById("date").textContent = `${data.formattedDate}`;
    document.getElementById("time").textContent = `${data.formattedTime}`;
  }
});

/ * * * * * * * * * View Questions * * * * * * /;
// Function to display questions dynamically
async function displayQuestions() {
  const userData = await fetchGradesByUsername();
  const questions = userData.quizAttempts[0].attempts[0].answers;

  // Container to append the questions dynamically
  const container = document.getElementById("question-container");
  if (!container) {
    console.error("Container element not found!");
    / * * * * I thin no error may happen here * * * * /;
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
  localStorage.removeItem("username");
  window.location.href = "login.html";
});

// Prevent navigating back after signing out  ❌❌Not Working❌❌
// if (!localStorage.getItem("username")) {
//   history.pushState(null, null, window.location.href);
//   window.addEventListener("popstate", () => {
//     history.pushState(null, null, window.location.href);
//   });
// }

document.addEventListener("DOMContentLoaded", () => {
  displayQuestions();

  / * * * to prevent going back after sign-out * * * * /;
  //   if (!localStorage.getItem("username")) {
  //     window.location.href = "login.html";
  //   }
});
