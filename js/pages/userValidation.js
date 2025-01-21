export function validateUser(user) {
  const errors = [];

  if (
    !user.username ||
    !user.email ||
    !user.password ||
    !user.confirmPassword
  ) {
    errors.push("All fields are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    errors.push("Invalid email format.");
  }
  // Check if password is strong enough
  if (
    user.password &&
    (user.password.length < 8 ||
      !/[A-Z]/.test(user.password) ||
      !/[0-9]/.test(user.password) ||
      !/[@$!%*?&#]/.test(user.password))
  ) {
    errors.push(
      "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character."
    );
  }
  if (
    user.password &&
    user.confirmPassword &&
    user.password !== user.confirmPassword
  ) {
    errors.push("Passwords do not match.");
  }
  return errors;
}
