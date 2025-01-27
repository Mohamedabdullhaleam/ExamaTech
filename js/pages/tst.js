const generateUserId = function () {
  const timestamp = Date.now().toString().slice(-5);
  const randomNum = Math.floor(Math.random() * 100);
  return `user_${timestamp}_${randomNum}`;
};

async function checkEmailExists(email) {
  const url = `http://localhost:3000/users?email=${email}`;
  console.log(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return true;
  }
}

/ * * * * * * * * * +/;
// Define a global variable to store quiz data
let quizData = {};
let currentQuestionIndex = 0;

// Fetch quiz data from the server
async function fetchQuizData() {
  try {
    const response = await fetch("http://localhost:3010/quiz");
    if (!response.ok) {
      throw new Error("Failed to fetch quiz data");
    }
    quizData = await response.json();
    displayQuestion(); // Display the first question
    populateQuestionNumbers();
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
}

// Display the current question
function displayQuestion() {
  const questionContainer = document.querySelector(".question");
  const answerContainer = document.querySelector(".answer");

  // Clear previous question and answers
  questionContainer.innerHTML = "";
  answerContainer.innerHTML = "";

  const question = quizData.questions[currentQuestionIndex];

  // Set question text
  questionContainer.innerHTML = `${
    currentQuestionIndex + 1
  }. <span class="font-bold">${question.question}</span>`;

  // Populate answers
  question.options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.classList.add(
      "border-2",
      "rounded-lg",
      "border-main-color",
      "w-full",
      "h-12",
      "p-3"
    );

    optionElement.innerHTML = `
      <input class="accent-sec-color cursor-pointer" type="radio" name="choice" id="option-${option.id}" value="${option.id}" />
      <label for="option-${option.id}">${option.text}</label>
    `;

    // Add click event to track selected answer
    optionElement.querySelector("input").addEventListener("click", () => {
      trackAnswer(question.id, option.id);
    });

    answerContainer.appendChild(optionElement);
  });
}

// Track the selected answer
function trackAnswer(questionId, optionId) {
  const question = quizData.questions.find((q) => q.id === questionId);
  if (question) {
    question.choosedOptionId = optionId;
  }
}

// Populate question numbers
function populateQuestionNumbers() {
  const questionNumbersContainer = document.querySelector(".question-number");
  questionNumbersContainer.innerHTML = "";

  quizData.questions.forEach((_, index) => {
    const questionNumberElement = document.createElement("li");
    questionNumberElement.classList.add(
      "text-white",
      "w-12",
      "h-12",
      "flex",
      "items-center",
      "justify-center",
      "rounded",
      "cursor-pointer",
      "hover:border",
      "hover:border-main-color"
    );

    if (index === currentQuestionIndex) {
      questionNumberElement.classList.add("bg-main-color");
    }

    questionNumberElement.textContent = index + 1;
    questionNumberElement.addEventListener("click", () => {
      currentQuestionIndex = index;
      displayQuestion();
      updateQuestionNumbers();
    });

    questionNumbersContainer.appendChild(questionNumberElement);
  });
}

// Update question numbers highlight
function updateQuestionNumbers() {
  const questionNumbers = document.querySelectorAll(".question-number li");
  questionNumbers.forEach((number, index) => {
    number.classList.remove("bg-main-color");
    if (index === currentQuestionIndex) {
      number.classList.add("bg-main-color");
    }
  });
}

// Navigate to the next question
function goToNextQuestion() {
  if (currentQuestionIndex < quizData.questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
    updateQuestionNumbers();
  }
}

// Navigate to the previous question
function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
    updateQuestionNumbers();
  }
}

// Calculate and display the quiz score
function submitQuiz() {
  const score = quizData.questions.reduce((total, question) => {
    return question.choosedOptionId === question.correctOptionId
      ? total + 1
      : total;
  }, 0);

  alert(`Your score: ${score} out of ${quizData.questions.length}`);
}

// Add event listeners to navigation and submit buttons
document
  .querySelector(".controls .fa-angle-right")
  .addEventListener("click", goToNextQuestion);
document
  .querySelector(".controls .fa-angle-left")
  .addEventListener("click", goToPreviousQuestion);
document
  .querySelector("input[type='submit']")
  .addEventListener("click", submitQuiz);

// Initialize the quiz
document.addEventListener("DOMContentLoaded", fetchQuizData);

// function displayQuestions() {
//   const questions = quizData.questions;
//   const randomizedQuestions = shuffleQuestions(questions);
//   console.log("To-be-shown-questions-inquiz", randomizedQuestions);

//   // Loop through each question and display
//   // randomizedQuestions.forEach((question, index) => {
//   //   const questionElement = document.createElement("div");
//   //   questionElement.classList.add("question");

//   //   // Question title
//   //   const questionTitle = document.createElement("h3");
//   //   questionTitle.textContent = `${index + 1}. ${question.question}`;
//   //   questionElement.appendChild(questionTitle);

//   //   // Options
//   //   question.options.forEach((option) => {
//   //     const optionLabel = document.createElement("label");
//   //     optionLabel.innerHTML = `
//   //       <input type="radio" name="q${question.id}" value="${option.id}" onclick="trackAnswer('${question.id}', '${option.id}')">
//   //       ${option.text}
//   //     `;
//   //     questionElement.appendChild(optionLabel);
//   //   });

//   //   // Append question to container
//   //   questionsContainer.appendChild(questionElement);
//   // });
// }

// function startCountdown(hours, minutes, seconds) {
//   const finishTime = localStorage.getItem("countdownFinishTime");
//   if (!finishTime) {
//     const currentTime = new Date().getTime(); // Define currentTime here
//     const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
//     const countdownFinishTime = currentTime + totalMilliseconds;
//     localStorage.setItem("countdownFinishTime", countdownFinishTime);
//     console.log("Countdown finish time set to:", countdownFinishTime);
//   }
//   initCountdown();
// }
// function initCountdown() {
//   console.log("Initializing countdown...");

//   const warningTimer = document.getElementById("warning-timer");
//   warningTimer.innerHTML = ` <i id="warning-icon" class="fa-solid fa-hourglass-start text-sec-color text-4xl"></i>
//       <!-- <i class="fa-solid fa-clock fa-spin text-sec-color text-4xl"></i> -->
//       <div class="flex items-baseline"></div>
//       <p class="text-xl font-semibold">Timer:</p>
//       <span id="timer" class="text-xl font-semibold"></span>`;

//   const warningIcon = document.getElementById("warning-icon");
//   const timerElement = document.getElementById("timer");
//   const intervalId = setInterval(() => {
//     const currentTime = new Date().getTime();
//     const finishTime = localStorage.getItem("countdownFinishTime");

//     if (!finishTime) {
//       clearInterval(intervalId);
//       return;
//     }

//     const remainingTime = Math.max(finishTime - currentTime, 0);

//     if (remainingTime <= 0) {
//       clearInterval(intervalId);
//       localStorage.removeItem("countdownFinishTime");
//       window.location.href = "TimeOut.html";
//       return;
//     }

//     const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
//     const remainingMinutes = Math.floor(
//       (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
//     );

//     const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
//     console.log(remainingHours, remainingMinutes, remainingSeconds); // nothing displayed //

//     timerElement.textContent = `${String(remainingHours).padStart(
//       2,
//       "0"
//     )}:${String(remainingMinutes).padStart(2, "0")}:${String(
//       remainingSeconds
//     ).padStart(2, "0")}`;

//     // Handle the warning styles when less than 2 minutes remain
//     if (remainingHours === 0 && remainingMinutes < 2) {
//       warningTimer.classList.add("text-red-500");
//       warningIcon.classList.remove("text-sec-color");
//       warningIcon.classList.add("text-red-500", "fa-beat-fade");
//     } else {
//       warningTimer.classList.remove("text-red-500");
//       warningIcon.classList.remove("text-red-500", "fa-beat-fade");
//       warningIcon.classList.add("text-sec-color");
//     }
//   }, 1000);
// }
