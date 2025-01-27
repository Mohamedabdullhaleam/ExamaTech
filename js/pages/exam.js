let quizData = {};
let currentQuestionIndex = 0;

// Fetch quiz data
async function fetchQuizData() {
  // get data from local storage first
  try {
    const savedQuestions = localStorage.getItem("randomizedQuestions");
    if (savedQuestions) {
      quizData.questions = JSON.parse(savedQuestions);
      initQuiz();
      return;
    }
    // if not now fetch data
    const response = await fetch("http://localhost:3010/quiz");
    if (!response.ok) {
      throw new Error("Failed to fetch quiz data");
    }

    quizData = await response.json();
    const { hours, minutes, seconds } = quizData.quizTime;
    const randomizedQuestions = shuffleQuestions(quizData.questions);
    quizData.questions = randomizedQuestions; // Store shuffled questions in quizData

    // Save shuffled questions in localStorage
    localStorage.setItem(
      "randomizedQuestions",
      JSON.stringify(randomizedQuestions) /// to make an instance of it and use it as frequent as you want "same instance"
    );
    localStorage.setItem(
      "quizTime",
      JSON.stringify({ hours, minutes, seconds })
    );

    startCountdown(hours, minutes, seconds);
    initQuiz();
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    / * * * * Redirect to error page * * * * * /;
  }
}

function initQuiz() {
  const currentQuestionIndex =
    parseInt(localStorage.getItem("currentQuestionIndex")) || 0;
  displayQuestion(
    quizData.questions[currentQuestionIndex],
    currentQuestionIndex
  );
}

/ * * * *   Disply  * * * * /;
function displayQuestion(question, index) {
  localStorage.setItem("currentQuestionIndex", index);

  const questionNumberElement = document.getElementById("q-number-text");
  questionNumberElement.innerHTML = `${
    index + 1
  }. <span id="question-text" class="font-bold">${question.question}</span>`;

  question.options.forEach((option, optionIndex) => {
    const optionElement = document.getElementById(`option-${optionIndex + 1}`);
    if (optionElement) {
      const radioInput = optionElement.querySelector("input");
      const radioLabel = optionElement.querySelector("label");

      radioInput.id = `choice-${index}-${optionIndex}`;
      radioLabel.setAttribute("for", radioInput.id);
      radioLabel.textContent = option.text;

      radioInput.checked = question.choosedOptionId === option.id; // / Pre-select the radio button if the option was previously chosen
      // console.log("option-id:", option.id);
      radioInput.onclick = () => trackAnswer(question.id, option.id);
    }
  });
}

/ * * * * Tracking Answers * * * * /;
function trackAnswer(questionId, optionId) {
  const currentQuestion = quizData.questions.find((q) => q.id === questionId);
  currentQuestion.choosedOptionId = optionId;
  // Save updated questions to localStorage with it's answer
  console.log(quizData.questions);
  localStorage.setItem(
    "randomizedQuestions",
    JSON.stringify(quizData.questions)
  );
}

/ * * * *  Shuffling question * * * * /;
function shuffleQuestions(questions) {
  return questions.sort(() => Math.random() - 0.5);
}

/ * * * * * * * previous and next * * * * * * * * /;
function updateButtonState() {
  const nextButton = document.getElementById("next");
  const prevButton = document.getElementById("previous");

  // Disable/enable buttons based on the current index
  prevButton.style.visibility =
    currentQuestionIndex === 0 ? "hidden" : "visible";
  nextButton.style.visibility =
    currentQuestionIndex === quizData.questions.length - 1
      ? "hidden"
      : "visible";
}

// Event listeners for Next and Previous buttons
document.getElementById("next").addEventListener("click", () => {
  if (currentQuestionIndex < quizData.questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(
      quizData.questions[currentQuestionIndex],
      currentQuestionIndex
    );
    updateButtonState();
  }
});
document.getElementById("previous").addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(
      quizData.questions[currentQuestionIndex],
      currentQuestionIndex
    );
    updateButtonState();
  }
});

/ * * * * * Need to submit on another json * * * * * /;
/// includes  -- user-name & user email --- answers (correct and wrong )  --- score)
async function submitQuiz() {
  const username = localStorage.getItem("username") || "user_101"; // Retrieve from localStorage or use default
  const email = localStorage.getItem("email") || "john.doe@example.com";

  const questions = quizData.questions;
  let score = 0;
  const answers = [];

  // Calculate the score and prepare answers
  questions.forEach((question, index) => {
    const isCorrect = question.choosedOptionId === question.correctOptionId;
    if (isCorrect) score++;
    answers.push({
      questionIndex: index,
      selectedOptionId: question.choosedOptionId || null,
      isCorrect: isCorrect,
    });
  });

  try {
    // Fetch existing grades for this user
    const response = await fetch(
      `http://localhost:3020/grades?username=${username}`
    );
    const userData = response.ok ? await response.json() : [];

    // Determine the new attempt number
    let attemptNumber = 1;
    if (userData.length > 0) {
      const existingQuiz = userData[0].quizAttempts.find(
        (q) => q.quizId === "quiz_101"
      );
      if (existingQuiz) {
        attemptNumber = existingQuiz.attempts.length + 1;
      }
    }

    // Prepare the quiz attempt data
    const completedAt = new Date().toISOString();
    const newAttempt = {
      attemptId: attemptNumber,
      score,
      answers,
      completedAt,
    };

    let payload;

    if (userData.length > 0) {
      // Append to existing user data
      payload = { ...userData[0] };
      const quizIndex = payload.quizAttempts.findIndex(
        (q) => q.quizId === "quiz_101"
      );

      if (quizIndex >= 0) {
        // Append new attempt to existing quizAttempts
        payload.quizAttempts[quizIndex].attempts.push(newAttempt);
        payload.quizAttempts[quizIndex].bestScore = Math.max(
          payload.quizAttempts[quizIndex].bestScore,
          score
        );
      } else {
        // Add a new quizAttempts entry
        payload.quizAttempts.push({
          quizId: "quiz_101",
          attempts: [newAttempt],
          bestScore: score,
        });
      }
    } else {
      // New user data
      payload = {
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

    const postResponse = await fetch("http://localhost:3020/grades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (postResponse.ok) {
      alert(`Quiz submitted successfully! Your score: ${score}`);
      console.log("Submitted data:", payload);

      localStorage.removeItem("randomizedQuestions");
      localStorage.removeItem("currentQuestionIndex");
      localStorage.removeItem("countdownFinishTime");

      window.location.href = "report.html";
    } else {
      throw new Error("Failed to submit quiz.");
    }
  } catch (error) {
    console.error("Error submitting quiz:", error);
    alert("An error occurred while submitting the quiz. Please try again.");
  }
}
const submit = document.getElementById("submit");

submit.addEventListener("click", () => {
  submitQuiz();
});

/ * * Timer logic  ✔✔    icon pulse* * /;
function startCountdown(hours, minutes, seconds) {
  const finishTime = localStorage.getItem("countdownFinishTime");
  if (!finishTime) {
    const currentTime = new Date().getTime(); // Define currentTime here
    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    const countdownFinishTime = currentTime + totalMilliseconds;
    localStorage.setItem("countdownFinishTime", countdownFinishTime);
    console.log("Countdown finish time set to:", countdownFinishTime);
  }
  initCountdown();
}
function initCountdown() {
  console.log("Initializing countdown...");
  const timerElement = document.getElementById("timer");
  const warningTimer = document.getElementById("warning-timer");
  const warningIcon = document.getElementById("warning-icon");

  const intervalId = setInterval(() => {
    const currentTime = new Date().getTime();
    const finishTime = localStorage.getItem("countdownFinishTime");

    if (!finishTime) {
      clearInterval(intervalId);
      return;
    }

    const remainingTime = Math.max(finishTime - currentTime, 0);

    if (remainingTime <= 0) {
      clearInterval(intervalId);
      localStorage.removeItem("countdownFinishTime");
      window.location.href = "TimeOut.html";
      return;
    }

    const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );

    const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    console.log(remainingHours, remainingMinutes, remainingSeconds); // nothing displayed //

    timerElement.textContent = `${String(remainingHours).padStart(
      2,
      "0"
    )}:${String(remainingMinutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;

    // Handle the warning styles when less than 2 minutes remain
    if (remainingHours === 0 && remainingMinutes < 2) {
      warningTimer.classList.add("text-red-500");
      warningIcon.classList.remove("text-sec-color");
      warningIcon.classList.add("text-red-500", "fa-beat-fade");
    } else {
      warningTimer.classList.remove("text-red-500");
      warningIcon.classList.remove("text-red-500", "fa-beat-fade");
      warningIcon.classList.add("text-sec-color");
    }
  }, 1000);
}

window.onload = () => {
  fetchQuizData();
  initCountdown();
  updateButtonState();
};
