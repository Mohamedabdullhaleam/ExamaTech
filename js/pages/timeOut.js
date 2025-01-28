import { displayUserNameWithEffect } from "./textAnimation.js";
const tryAgain = document.getElementById("try-again");

tryAgain.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "signIn.html";
});

window.onload = () => {
  const userName = localStorage.getItem("loggedInUser");
  const userText = document.getElementById("user-name");
  userText.textContent = `${userName}`;
  const title = document.getElementById("title");
  displayUserNameWithEffect(title, "Exama-Tech");
};
