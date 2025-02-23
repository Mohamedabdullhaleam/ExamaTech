import { displayUserNameWithEffect } from "../utils/textAnimation.js";

/ * * * Animation * * * /;
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");
/ * * * Redirection * * * /;
const login = document.getElementById("login");
login.addEventListener("click", () => {
  localStorage.clear();
  window.location.replace("SignIn.html");
});
