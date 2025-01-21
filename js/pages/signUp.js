async function postUserData(newUser) {
  const url = "http://localhost:3000/users";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log("Data posted successfully:", result);
  } catch (error) {
    console.error("Error posting data:", error);
  }
}

// const User = {
//   username: document.querySelector("#username"),
//   email: document.querySelector("#email"),
//   password: document.querySelector("#password"),
//   confirmPassword: document.querySelector("#confirm-password"),
// };

/*
/ * * *  Helper functions * * * /
*/
const generateUserId = function () {
  const timestamp = Date.now().toString().slice(-5);
  const randomNum = Math.floor(Math.random() * 100);
  return `user_${timestamp}_${randomNum}`;
};

// const generateId = () => {
//   currentId = currentId + 1;
//   return currentId;
// };

// edit to be fetched from the sign-up page

/ * * *  * * * End * * * * * * * /;
const newUser = {
  userId: generateUserId(),
  username: "kholoud",
  name: "Kholoud Ahmed",
  email: "shdbs@gmail.com",
  password: "hashed_password_456",
};

postUserData(newUser);
