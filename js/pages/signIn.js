async function checkUserCredentials(userNameOrEmail, password) {
  try {
    // Query by email first
    const emailUrl = `http://localhost:3000/users?email=${userNameOrEmail}`;
    const emailResponse = await fetch(emailUrl);
    const emailData = await emailResponse.json();

    // Check if the user was found by email
    if (emailData.length > 0) {
      const user = emailData[0];
      if (user.password === password) {
        return true;
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
  const result = await checkUserCredentials(
    "kholoud_ddddd_58540",
    "Hashed_password_456"
  );
  console.log(result); // This will log the result of checkUserCredentials (true, false, null, or the username)
}

// run();

// console.log(checkUserCredentials("kholoud_ddddd_58540", "Hashed_password_456"));

document
  .getElementById("sign-in-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const userNameOrEmail = document.getElementById("username-or-email").value;
    const password = document.getElementById("password-input").value;

    const result = await checkUserCredentials(userNameOrEmail, password);

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

    if (result) {
      console.log("Login successful: ", result);
      alert("Login successful! Welcome " + result);
      // Redirect user or take other actions after successful login
    } else {
      console.log("Invalid login credentials");
      alert("Invalid credentials. Please try again."); // redirect to error page or
    }
  });
