import { displayUserNameWithEffect } from "./textAnimation.js";
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");

async function checkUserCredentials(userNameOrEmail, password) {
  try {
    const emailUrl = `http://localhost:3000/users?email=${userNameOrEmail}`;
    const emailResponse = await fetch(emailUrl);
    const emailData = await emailResponse.json();

    // Check if the user was found by email
    if (emailData.length > 0) {
      const user = emailData[0];
      if (user.password === password) {
        return user.username;
      }
    }

    // Query by username if no match by email
    const usernameUrl = `http://localhost:3000/users?username=${userNameOrEmail}`;
    const usernameResponse = await fetch(usernameUrl);
    const usernameData = await usernameResponse.json();

    // Check if the user was found by username
    if (usernameData.length > 0) {
      const user = usernameData[0];
      console.log(user);
      if (user.password === password) {
        return user.username;
      }
    }
    return null; // No user found
  } catch (error) {
    console.error("Error checking user credentials:", error);
    return null;
  }
}

// async function run() {
//   const userName = await checkUserCredentials(
//     "kholoud_ddddd_58540",
//     "Hashed_password_456"
//   );
//   console.log(userName);
// }

document
  .getElementById("sign-in-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const userNameOrEmail = document.getElementById("username-or-email").value;
    const password = document.getElementById("password-input").value;
    const userNameErrorMsg = document.getElementById("username-error-msg");
    const passwordErrorMsg = document.getElementById("password-error-msg");
    const credintials = document.getElementById("invalid-credentials");

    // Validate inputs
    toggleErrorMessage(userNameErrorMsg, !userNameOrEmail);
    toggleErrorMessage(passwordErrorMsg, !password);

    if (!userNameOrEmail || !password) return;

    const userName = await checkUserCredentials(userNameOrEmail, password);

    if (userName) {
      console.log("Login successful: ", userName);
      localStorage.setItem("loggedInUser", userName);
      popUp();
      // window.location.href = "Confirmation.html";
    } else {
      console.log("Invalid login credentials");
      toggleErrorMessage(credintials, true);
    }
  });

document.getElementById("sign-up").addEventListener("click", function (e) {
  window.location.href = "SignUp.html";
});

function startTimer() {
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

function popUp() {
  const popUp = document.getElementById("popup-modal");
  popUp.classList.remove("hidden");
  popUp.classList.add("flex");
  startTimer();
}

function toggleErrorMessage(element, condition) {
  if (condition) {
    element.classList.remove("invisible");
  } else {
    element.classList.add("invisible");
  }
}

document.getElementById("username-or-email").addEventListener("input", () => {
  const userNameErrorMsg = document.getElementById("username-error-msg");
  const emailErrorMsg = document.getElementById("invalid-credentials");
  userNameErrorMsg.classList.add("invisible");
  emailErrorMsg.classList.add("invisible");
});

document.getElementById("password-input").addEventListener("input", () => {
  const passwordErrorMsg = document.getElementById("password-error-msg");
  passwordErrorMsg.classList.add("invisible");
});
