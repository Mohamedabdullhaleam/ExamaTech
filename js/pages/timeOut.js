import { displayUserNameWithEffect } from "../utils/textAnimation.js";
const tryAgain = document.getElementById("try-again");

/ * * * Animation * * * /;
const title = document.getElementById("title");
displayUserNameWithEffect(title, "Exama-Tech");

/ * * * Display user * * */;
const userName = localStorage.getItem("loggedInUser");
const userText = document.getElementById("user-name");
userText.textContent = `${userName}`;

/ * * * Event Listeners * * * /;
/ * *  Redirection * * /;
tryAgain.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "signIn.html";
});
