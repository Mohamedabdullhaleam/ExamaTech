import {
  validateName,
  validateRequiredFields,
  validateEmailFormat,
  validatePasswordStrength,
  validatePasswordMatch,
  validateUser,
} from "./userValidation.js";

/ * * DOM * * /;

/ * * Showing error msgs in front * * /;
document.getElementById("signup-form").addEventListener("submit", validate);

async function validate(event) {
  event.preventDefault();

  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password-input").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  console.log(firstName, lastName, email, password, confirmPassword);

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
    const alertDiv = document.getElementById("account-exists-alert");
    alertDiv.classList.remove("hidden");
    alertDiv.classList.add("flex");
  }

  if (errors.length > 0) {
    displyError(errors);
  } else {
    postUserData(newUser);
  }
}

async function postUserData(newUser) {
  const emailExists = await checkEmailExists(newUser.email);

  if (emailExists) {
    console.error("Error: Email is already in use.");
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
  } catch (error) {
    console.error("Error posting data:", error);
  }
}

/ * * *  Helper functions * * * /;

/ * * *  user_name generation * * * /;
const generateUserName = function (firstName, lastName) {
  const timestamp = Date.now().toString().slice(-5);
  //   const randomNum = Math.floor(Math.random() * 100);
  return `${firstName}_${lastName.slice(0, 5)}_${timestamp}`;
};

/ * * * * mail duplication * * * /;
async function checkEmailExists(email) {
  const url = `http://localhost:3000/users?email=${email}`;
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

function displyError(errors) {
  // 1- clear all previous errors
  document.querySelectorAll(".text-red-500").forEach(function (errorElement) {
    errorElement.textContent = "mk";
    // errorElement.classList.remove("visible");
    errorElement.classList.add("invisible");
  });
  // 2- display new errors
  errors.forEach(function (error) {
    const errorElement = document.getElementById(error.id);
    errorElement.textContent = error.message;
    // errorElement.classList.add("visible");
    errorElement.classList.remove("invisible");
  });
}
