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
    return "Invalid name format. Name should only contain alphabetic characters and spaces.";
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
  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[@$!%*?&#_]/.test(password)
  ) {
    return "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.";
  }
  return null;
}

// Checks if passwords match
export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return null;
}

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
