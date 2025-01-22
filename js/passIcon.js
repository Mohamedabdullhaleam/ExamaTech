function togglePassword() {
  const passwordInput = document.getElementById("password-input");
  const passwordIcon = document.getElementById("password-icon");

  passwordInput.type = passwordInput.type === "password" ? "text" : "password";

  passwordIcon.classList.toggle("fa-eye");
  passwordIcon.classList.toggle("fa-eye-slash");
}
