import { displayUserNameWithEffect } from "./textAnimation.js";
import { popUp, toggleErrorMessage } from "../utils/regestration/display.js";
import { clearErrorOnInput } from "../utils/regestration/userValidation.js";
import { togglePassword } from "../utils/regestration/passIcon.js";

/ * * * Animation * * * /;
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");

/ * * * Check User Credentials * * * /;
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
    window.location.replace("notFound.html");
    return null;
  }
}

/ * * * * Validate User Credintials * * * * /;
async function validate() {
  const userNameOrEmail = document.getElementById("username-or-email").value;
  const password = document.getElementById("password-input").value;
  const userNameErrorMsg = document.getElementById("username-error-msg");
  const passwordErrorMsg = document.getElementById("password-error-msg");
  const credintials = document.getElementById("invalid-credentials");

  toggleErrorMessage(userNameErrorMsg, !userNameOrEmail);
  toggleErrorMessage(passwordErrorMsg, !password);

  if (!userNameOrEmail || !password) return;

  const userName = await checkUserCredentials(userNameOrEmail, password);

  if (userName) {
    console.log("Login successful: ", userName);
    localStorage.setItem("loggedInUser", userName);
    popUp();
  } else {
    console.log("Invalid login credentials");
    toggleErrorMessage(credintials, true);
  }
}

/ * * * Dynamic Validation * * * /;
clearErrorOnInput("username-or-email", [
  "username-error-msg",
  "invalid-credentials",
]);

clearErrorOnInput("password-input", ["password-error-msg"]);

/ * * * * * * * * * * * * * * * * Event-Listeners * * * * * * * * * * * * * * * * /;
/ * * * Validation on submit * * * /;
document
  .getElementById("sign-in-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    validate();
  });

/ * * * Redirection * * * /;
document.getElementById("sign-up").addEventListener("click", (e) => {
  window.location.href = "SignUp.html";
});

/ * * * Toggle PassIcon * * * /;
document.getElementById("pass-icon").addEventListener("click", togglePassword);
