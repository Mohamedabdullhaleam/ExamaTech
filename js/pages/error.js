import { displayUserNameWithEffect } from "./textAnimation.js";
const title = document.getElementById("title");
const login = document.getElementById("login");

displayUserNameWithEffect(title, "Exama-Tech");
login.addEventListener("click", () => {
  localStorage.clear();
  window.location.replace("SignIn.html");
});
