// Checks if all required fields are present
export function validateRequiredFields(user) {
  if (
    !user.username ||
    !user.email ||
    !user.password ||
    !user.confirmPassword
  ) {
    return "All fields are required.👹";
  }
  return null;
}

export function validateName(name) {
  if (!/^[A-Za-z\s]+$/.test(name)) {
    return "Name should only contain alphabetic characters.";
  }
  return null;
}

// Validates the email format
export function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return null;
}

// Validates the strength of the password
export function validatePasswordStrength(password) {
  const errors = [];
  if (password.length < 8) errors.push("8+ chars");
  if (!/[A-Z]/.test(password)) errors.push("1 uppercase");
  if (!/[0-9]/.test(password)) errors.push("1 number");
  if (!/[@$!%*?&#_]/.test(password)) errors.push("1 symbol");
  return errors.length > 0 ? `Password: ${errors.join(", ")}.` : null;
}

// Checks if passwords match
export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return null;
}
/// Show error msg only without prevent posting
export async function checkEmailExists(email) {
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

// do we need this //
// Main function to validate the user
export function validateUser(user) {
  const errors = [];

  const requiredFieldsError = validateRequiredFields(user);
  if (requiredFieldsError) errors.push(requiredFieldsError);

  const emailError = validateEmailFormat(user.email);
  if (emailError) errors.push(emailError);

  if (user.password) {
    const passwordStrengthError = validatePasswordStrength(user.password);
    if (passwordStrengthError) errors.push(passwordStrengthError);

    const passwordMatchError = validatePasswordMatch(
      user.password,
      user.confirmPassword
    );
    if (passwordMatchError) errors.push(passwordMatchError);
  }

  return errors;
}

/ * * * Dynamic Validation * * * /;
export function dynamicValidation() {
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

/ * * * Log-In * * * /;
export function validateSignInFields(emailOrUsername, password) {
  if (!emailOrUsername || !password) {
    return "Both email/username and password are required.";
  }
  return null;
}
