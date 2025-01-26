let quizData = {}; // Store the quiz data

// Fetch quiz data
async function fetchQuizData() {
  try {
    const response = await fetch("http://localhost:3010/quiz");
    if (!response.ok) {
      throw new Error("Failed to fetch quiz data");
    }
    quizData = await response.json();
    const { hours, minutes, seconds } = quizData.quizTime;

    console.log("hours" + hours);
    console.log("minutes" + minutes);
    console.log("seconds" + seconds);
    // console.log(quizData.questions);
    displayQuestions();
    startCountdown(hours, minutes, seconds);
    const randomizedQuestions = shuffleQuestions(quizData.questions);
    displayQuestion(randomizedQuestions[0], 0);
    console.log("aaa", randomizedQuestions);
  } catch (error) {
    console.error("Error fetching quiz data:", error);
  }
}

function displayQuestion(question, index) {
  const questionNumberElement = document.getElementById("q-number-text");
  // const answersContainer = document.querySelector(".answer");

  questionNumberElement.innerHTML = `${
    index + 1
  }. <span id="question-text" class="font-bold">${question.question}</span>`;

  // Loop through the options and update the existing divs
  question.options.forEach((option, optionIndex) => {
    const optionElement = document.getElementById(`option-${optionIndex + 1}`);

    if (optionElement) {
      const radioInput = optionElement.querySelector("input");
      const radioLabel = optionElement.querySelector("label");

      radioInput.id = `choice-${index}-${optionIndex}`;
      radioLabel.setAttribute("for", radioInput.id);
      radioLabel.textContent = option.text;
    }
  });
}

// fetchQuizData();
// const questions = quizData.questions;
// const randomizedQuestions = shuffleArray(questions);
// console.log(random);

// Function to display the questions on the page
function displayQuestions() {
  const questions = quizData.questions;
  const randomizedQuestions = shuffleQuestions(questions);
  console.log("To-be-shown-questions-inquiz", randomizedQuestions);

  // Loop through each question and display
  // randomizedQuestions.forEach((question, index) => {
  //   const questionElement = document.createElement("div");
  //   questionElement.classList.add("question");

  //   // Question title
  //   const questionTitle = document.createElement("h3");
  //   questionTitle.textContent = `${index + 1}. ${question.question}`;
  //   questionElement.appendChild(questionTitle);

  //   // Options
  //   question.options.forEach((option) => {
  //     const optionLabel = document.createElement("label");
  //     optionLabel.innerHTML = `
  //       <input type="radio" name="q${question.id}" value="${option.id}" onclick="trackAnswer('${question.id}', '${option.id}')">
  //       ${option.text}
  //     `;
  //     questionElement.appendChild(optionLabel);
  //   });

  //   // Append question to container
  //   questionsContainer.appendChild(questionElement);
  // });
}

/ * * * *  Shuffling question * * * * /;
function shuffleQuestions(questions) {
  return questions.sort(() => Math.random() - 0.5);
}

/ * * * * Tracking Answers * * * * /;
function trackAnswer(questionId, optionId) {
  const currentQuestion = quizData.questions.find((q) => q.id === questionId);
  currentQuestion.choosedOptionId = optionId;
}

/ * * * * * Need to submit on another json * * * * * /;
/// includes  -- user-name & user email --- answers (correct and wrong )  --- score)
function submitQuiz() {
  const questions = quizData.questions;
  let score = 0;

  // Calculate the score
  questions.forEach((question) => {
    if (question.choosedOptionId === question.correctOptionId) {
      score++;
    }
  });

  alert(`Your score: ${score} out of ${questions.length}`);
}

window.onload = fetchQuizData;

/ * * Timer logic  ✔✔    icon pulse* * /;
function startCountdown(hours, minutes, seconds) {
  const countdownInterval = setInterval(() => {
    // Decrement seconds
    if (seconds > 0) {
      seconds--;
    } else if (minutes > 0) {
      minutes--;
      seconds = 59;
    } else if (hours > 0) {
      hours--;
      minutes = 59;
      seconds = 59;
    } else {
      clearInterval(countdownInterval);
      window.location.href = "TimeOut.html";
    }
    updateTimerDisplay(hours, minutes, seconds);
  }, 1000);
}
function updateTimerDisplay(hours, minutes, seconds) {
  const timerElement = document.getElementById("timer");
  const warningTimer = document.getElementById("warning-timer");
  const warningIcon = document.getElementById("warning-icon");
  timerElement.textContent = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  //// enhancement code
  if (hours === 0 && minutes < 2) {
    warningTimer.classList.add("text-red-500");
    warningIcon.classList.remove("text-sec-color");
    warningIcon.classList.add("text-red-500");
    console.log("red");
  } else {
    warningTimer.classList.remove("text-red-500");
    warningIcon.classList.remove("text-red-500");
    warningIcon.classList.add("text-sec-color");
  }
}
