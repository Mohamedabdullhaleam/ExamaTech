import { showLoading, hideLoading } from "../loading/loadingState.js";
export function startCountdown(hours, minutes, seconds) {
  const finishTime = localStorage.getItem("countdownFinishTime");
  if (!finishTime) {
    const currentTime = new Date().getTime();
    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    const countdownFinishTime = currentTime + totalMilliseconds;
    localStorage.setItem("countdownFinishTime", countdownFinishTime);
    localStorage.setItem("quizStartTime", currentTime);
  }
  initCountdown();
}

export function initCountdown() {
  showLoading(); // Show loading before processing the timer

  const timerElement = document.getElementById("timer");
  const warningTimer = document.getElementById("warning-timer");
  const warningIcon = document.getElementById("warning-icon");

  function updateTimer() {
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
      window.location.replace("timeOut.html");
      return;
    }

    const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
    const remainingMinutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const remainingSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    timerElement.textContent = `${String(remainingHours).padStart(
      2,
      "0"
    )}:${String(remainingMinutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
    warningTimer.classList.remove("invisible");

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

    hideLoading(); // Hide loading after the first timer update
  }

  updateTimer();
  const intervalId = setInterval(updateTimer, 1000);
}
