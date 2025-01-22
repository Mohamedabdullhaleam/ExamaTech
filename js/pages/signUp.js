import {
  validateRequiredFields,
  validateEmailFormat,
  validatePasswordStrength,
  validatePasswordMatch,
  validateUser,
} from "./userValidation.js";

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

//*** get and validate the data from the user ***/
/*** handling no repeated data --email--*/
async function checkEmailExists(email) {
  const url = `http://localhost:3000/users?email=${email}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Return true if email already exists, false otherwise
    return data.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return true; // Treat as existing email if error occurs
  }
}

// these will be fetched from the form
let firstname = "kholoud";
let lastname = "Ahmeddddd";
/*
/ * * *  Helper functions * * * /
*/
const generateUserName = function () {
  const timestamp = Date.now().toString().slice(-5);
  //   const randomNum = Math.floor(Math.random() * 100);
  return `${firstname}_${lastname.slice(0, 5)}_${timestamp}`;
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
  email: "shdbs@gmaixl.com",
  password: "Hashed_password_456",
  confirmPassword: "Hashed_password_456",
};

postUserData(newUser);
