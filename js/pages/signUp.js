import {
  validateRequiredFields,
  validateEmailFormat,
  validatePasswordStrength,
  validatePasswordMatch,
  validateUser,
} from "./userValidation.js";

async function postUserData(newUser) {
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

let firstname = "kh";
let lastname = "ahmed";
/*
/ * * *  Helper functions * * * /
*/
const generateUserName = function () {
  const timestamp = Date.now().toString().slice(-5);
  //   const randomNum = Math.floor(Math.random() * 100);
  return `${firstname}_${lastname.slice(4)}_${timestamp}`;
};

// const generateId = () => {
//   currentId = currentId + 1;
//   return currentId;
// };

// edit to be fetched from the sign-up page

/ * * *  * * * End * * * * * * * /;
const newUser = {
  username: generateUserName(),
  firstname: "Kholoud",
  lastname: "Ahmed",
  email: "shdbs@gmail.com",
  password: "Hashed_password_456",
  confirmPassword: "Hashed_password_456",
};

postUserData(newUser);
