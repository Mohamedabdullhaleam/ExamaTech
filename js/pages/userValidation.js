// Checks if all required fields are present
export function validateRequiredFields(user) {
  if (
    !user.username ||
    !user.email ||
    !user.password ||
    !user.confirmPassword
  ) {
    return "All fields are required.";
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
    return `<i class="fa-solid fa-circle-exclamation text-red-500"></i>
    <span>Account already exists. Please try logging in.</span>`;
  } catch (error) {
    window.location.replace("notFound.html");
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

/ * * * Log-In * * * /;
export function validateSignInFields(emailOrUsername, password) {
  if (!emailOrUsername || !password) {
    return "Both email/username and password are required.";
  }
  return null;
}
