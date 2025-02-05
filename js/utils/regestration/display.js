export function displayError(errors) {
  // 1- clear all previous errors
  document.querySelectorAll(".text-red-500").forEach(function (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.add("invisible");
  });
  // 2- display new errors
  errors.forEach(function (error) {
    const errorElement = document.getElementById(error.id);
    if (error.id === "account-exists-alert") {
      errorElement.classList.remove("invisible");
      errorElement.innerHTML = error.message;
    } else {
      errorElement.textContent = error.message;
      errorElement.classList.remove("invisible");
    }
  });
}

/ * * * Display toolTip * * * /;
export function showToolTip(userName) {
  const msg = document.getElementById("username-reveal");

  msg.innerHTML = `Your UserName is <span id="copyUserName" class="relative text-Btn-color font-semibold cursor-pointer active:text-main-color">"${userName}"<span class="tooltip hidden absolute -top-8 left-1/2 transform -translate-x-1/2 bg-text-color text-white text-xs py-1 px-2 rounded-lg">Copy</span></span>. Keep it in mind!`;

  const copyUserName = document.getElementById("copyUserName");
  const tooltip = copyUserName.querySelector(".tooltip");

  copyUserName.addEventListener("mouseenter", () => {
    tooltip.classList.remove("hidden");
  });

  copyUserName.addEventListener("mouseleave", () => {
    tooltip.classList.add("hidden");
  });

  copyUserName.addEventListener("click", () => {
    navigator.clipboard
      .writeText(userName)
      .then(() => {
        console.log(`Copied: ${userName}`);
        tooltip.textContent = "Copied!";
        setTimeout(() => {
          tooltip.textContent = "Copy";
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  });
}

/ * * * * * * * * * * * * * * LogIn * * * * * * * * * * * * * * /;

/ * * * popUp * * * /;
export function popUp() {
  const popUp = document.getElementById("popup-modal");
  popUp.classList.remove("hidden");
  popUp.classList.add("flex");
  startTimer();
}
/ * * * popUp Timer * * * /;
export function startTimer() {
  let timerValue = 6;
  const timerElement = document.getElementById("timer");
  const cancelButton = document.getElementById("cancel-btn");

  // Update the timer every second
  const interval = setInterval(() => {
    timerElement.textContent = timerValue;
    if (timerValue < 4) {
      timerElement.style.color = "red";
    }
    if (timerValue <= 0) {
      clearInterval(interval);
      window.location.href = "exam.html";
    }
    timerValue--;
  }, 1000);

  cancelButton.addEventListener("click", () => {
    clearInterval(interval);
    window.location.replace("SignIn.html");
  });
}

export function toggleErrorMessage(element, condition) {
  if (condition) {
    element.classList.remove("invisible");
  } else {
    element.classList.add("invisible");
  }
}
