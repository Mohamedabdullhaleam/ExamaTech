import {
  validateName,
  validateRequiredFields,
  validateEmailFormat,
  validatePasswordStrength,
  validatePasswordMatch,
  validateUser,
  checkEmailExists,
  dynamicValidation,
} from "../utils/regestration/userValidation.js";
import { generateUserName } from "../utils/regestration/userData.js";
import { displayError, showToolTip } from "../utils/regestration/display.js";
import { displayUserNameWithEffect } from "./textAnimation.js";
import { togglePassword } from "../utils/regestration/passIcon.js";
/ * * * Animation * * * /;
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");

/ * * * Combine all validation logic * * * /;
async function validate() {
  / * * * Dom * * */;
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password-input").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  / * * * JSON User object to be posted * * * /;
  const newUser = {
    username: generateUserName(firstName, lastName),
    firstname: firstName,
    lastname: lastName,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  };
  / * * * * setting the array of object that holds all errors  * * * * /;
  const errors = []; // array of object to save and display errors
  const firstNameError = validateName(firstName);
  if (firstNameError) {
    errors.push({ id: "error-first-name", message: firstNameError });
  }
  const lastNameError = validateName(lastName);
  if (lastNameError) {
    errors.push({ id: "error-last-name", message: lastNameError });
  }
  const emailError = validateEmailFormat(email);
  if (emailError) {
    errors.push({ id: "error-email", message: emailError });
  }
  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    errors.push({ id: "error-password", message: passwordError });
  }
  const passwordMatchError = validatePasswordMatch(password, confirmPassword);
  if (passwordMatchError) {
    errors.push({
      id: "error-confirm-password",
      message: passwordMatchError,
    });
  }
  //// Check if all fields are filled
  const emailExists = await checkEmailExists(newUser.email);
  if (emailExists) {
    errors.push({ id: "account-exists-alert", message: emailExists });
  }
  const requiredFieldsError = validateRequiredFields(newUser);
  if (requiredFieldsError)
    errors.push({ id: "account-exists-alert", message: requiredFieldsError });

  if (errors.length > 0) {
    displayError(errors);
  } else {
    popUp(newUser.username, newUser);
  }
}

/ * * * Post User Data * * * /;
async function postUserData(newUser) {
  /// prevent posting data if the email already exists
  const emailExists = await checkEmailExists(newUser.email);
  if (emailExists) {
    // console.error("Error: Email is already in use.");
    return;
  }
  const url = "http://localhost:3000/users";
  try {
    const errors = validateUser(newUser);
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log("Data posted successfully:", result);
    console.log(`HI : result.userName`);
    window.location.href = "SignIn.html";
  } catch (error) {
    console.error("Error posting data:", error);
    window.location.replace("notFound.html");
  }
}

/ * * * * pop-up * * */;
function popUp(userName, user) {
  const popUp = document.getElementById("popup-modal");
  const okButton = document.getElementById("ok-btn");
  const close = document.getElementById("close");

  popUp.classList.remove("hidden");
  popUp.classList.add("flex");

  showToolTip(userName);

  close.onclick = () => {
    popUp.classList.remove("flex");
    popUp.classList.add("hidden");
  };

  okButton.onclick = () => {
    popUp.classList.remove("flex");
    popUp.classList.add("hidden");
    postUserData(user);
  };
}

/ * * * * * * * * * * * * * * * * Event-Listeners * * * * * * * * * * * * * * * * /;
/ * * * Validation on submit * * * /;
// event listener that call the validate function when submit button kicked
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  validate();
});

/ * * * Dynamic validation * * * /;
document.addEventListener("DOMContentLoaded", () => {
  dynamicValidation();
});

/ * * * Redirection to LogIn * * */;
document.getElementById("log-in").addEventListener("click", () => {
  window.location.href = "SignIn.html";
});

/ * * * Toggle PassIcon * * * /;
document.getElementById("pass-icon").addEventListener("click", togglePassword);
