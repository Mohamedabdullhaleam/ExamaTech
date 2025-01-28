import {
  validateName,
  validateRequiredFields,
  validateEmailFormat,
  validatePasswordStrength,
  validatePasswordMatch,
  validateUser,
} from "./userValidation.js";

import { displayUserNameWithEffect } from "./textAnimation.js";
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");

/ * * DOM * * /;

/ * * Showing error msgs in front * * /;
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  validate();
});

async function validate() {
  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password-input").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  // console.log(firstName, lastName, email, password, confirmPassword);

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
  const requiredFieldsError = validateRequiredFields(newUser);
  if (requiredFieldsError)
    errors.push({ id: "error-first-name", message: requiredFieldsError });

  const emailExists = await checkEmailExists(newUser.email);
  if (emailExists) {
    errors.push({ id: "account-exists-alert", message: emailExists });
  }

  if (errors.length > 0) {
    displyError(errors);
  } else {
    popUp(newUser.username, newUser);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  setupInputListeners(); // Initialize input listeners
});

async function postUserData(newUser) {
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
    // popUp(result.userName);
  } catch (error) {
    window.location.replace("notFound.html");
    console.error("Error posting data:", error);
  }
}

const logIn = document
  .getElementById("log-in")
  .addEventListener("click", () => {
    window.location.href = "SignIn.html";
  });

/ * * *  Helper functions * * * /;

/ * * *  user_name generation * * * /;
const generateUserName = function (firstName, lastName) {
  const timestamp = Date.now().toString().slice(-4);
  return `${firstName.slice(0, 2)}_${lastName}${timestamp}`;
};

function displyError(errors) {
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

document.getElementById("sign-in").addEventListener("click", function (e) {
  window.location.href = "SignIn.html";
});

async function checkEmailExists(email) {
  if (!email.trim()) {
    return false;
  }
  const url = `http://localhost:3000/users?email=${email}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.length > 0) {
      return `<i class="fa-solid fa-circle-exclamation text-red-500"></i>
        <span>Account already exists. Please try logging in.</span>`;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return null;
  }
}

function popUp(userName, user) {
  const popUp = document.getElementById("popup-modal");
  const okButton = document.getElementById("ok-btn");
  const msg = document.getElementById("username-reveal");
  const close = document.getElementById("close");

  popUp.classList.remove("hidden");
  popUp.classList.add("flex");

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
    const text = userName;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log(`Copied: ${text}`);
        tooltip.textContent = "Copied!";
        setTimeout(() => {
          tooltip.textContent = "Copy";
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  });

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

function setupInputListeners() {
  const fields = [
    { id: "first-name", errorId: "error-first-name" },
    { id: "last-name", errorId: "error-last-name" },
    { id: "email", errorId: "error-email" },
    { id: "password-input", errorId: "error-password" },
    { id: "confirm-password", errorId: "error-confirm-password" },
  ];

  fields.forEach((field) => {
    const inputField = document.getElementById(field.id);
    const errorElement = document.getElementById(field.errorId);
    const emailExist = document.getElementById("account-exists-alert");
    // console.log("Input Field:", inputField, "Error Element:", errorElement);
    if (inputField && errorElement) {
      if (field.id === "email") {
        console.log("email changed");
        inputField.addEventListener("input", () => {
          errorElement.textContent = "";
          emailExist.textContent = "";
          emailExist.classList.add("invisible");
          errorElement.classList.add("invisible");
        });
      }
      inputField.addEventListener("input", () => {
        errorElement.textContent = "";
        errorElement.classList.add("invisible");
      });
    } else {
      console.error(`Missing field or error element for ${field.id}`);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupInputListeners();
});
