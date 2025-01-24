async function checkUserCredentials(userNameOrEmail, password) {
  try {
    const emailUrl = `http://localhost:3000/users?email=${userNameOrEmail}`;
    const emailResponse = await fetch(emailUrl);
    const emailData = await emailResponse.json();

    // Check if the user was found by email
    if (emailData.length > 0) {
      const user = emailData[0];
      if (user.password === password) {
        return user.username;
      }
    }

    // Query by username if no match by email
    const usernameUrl = `http://localhost:3000/users?username=${userNameOrEmail}`;
    const usernameResponse = await fetch(usernameUrl);
    const usernameData = await usernameResponse.json();
    // console.log(usernameData);

    // Check if the user was found by username
    if (usernameData.length > 0) {
      const user = usernameData[0];
      console.log(user);
      if (user.password === password) {
        return user.username;
      }
    }
    return null; // No user found
  } catch (error) {
    console.error("Error checking user credentials:", error);
    return null;
  }
}

async function run() {
  const userName = await checkUserCredentials(
    "kholoud_ddddd_58540",
    "Hashed_password_456"
  );
  console.log(userName); // This will log the result of checkUserCredentials (true, false, null, or the username)
}

// run();

// console.log(checkUserCredentials("kholoud_ddddd_58540", "Hashed_password_456"));

document
  .getElementById("sign-in-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const userNameOrEmail = document.getElementById("username-or-email").value;
    const password = document.getElementById("password-input").value;

    const userName = await checkUserCredentials(userNameOrEmail, password);

    if (!userNameOrEmail) {
      document
        .getElementById("username-error-msg")
        .classList.remove("invisible");
    } else {
      document.getElementById("username-error-msg").classList.add("invisible");
    }

    if (!password) {
      document
        .getElementById("password-error-msg")
        .classList.remove("invisible");
    } else {
      document.getElementById("password-error-msg").classList.add("invisible");
    }

    if (userName) {
      console.log("Login successful: ", userName);
      localStorage.setItem("loggedInUser", userName);
      popUp();
      // window.location.href = "Confirmation.html";
    } else {
      console.log("Invalid login credentials");

      // alert("Invalid credentials. Please try again.");
    }
  });

document.getElementById("sign-up").addEventListener("click", function (e) {
  window.location.href = "SignUp.html";
});

function startTimer() {
  let timerValue = 5;
  const timerElement = document.getElementById("timer");
  const cancelButton = document.getElementById("cancel-btn");

  // Update the timer every second
  const interval = setInterval(() => {
    timerElement.textContent = timerValue;
    if (timerValue < 3) {
      timerElement.style.color = "red";
    }
    if (timerValue <= 0) {
      clearInterval(interval);
      window.location.href = "ExamPage.html";
    }
    timerValue--;
  }, 1000);

  cancelButton.addEventListener("click", () => {
    clearInterval(interval);
    window.location.href = "Dashboard.html";
  });
}

function popUp() {
  const popUp = document.getElementById("popup-modal");
  popUp.classList.remove("hidden");
  popUp.classList.add("flex");
  startTimer();
}
