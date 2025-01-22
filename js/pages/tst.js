const generateUserId = function () {
  const timestamp = Date.now().toString().slice(-5);
  const randomNum = Math.floor(Math.random() * 100);
  return `user_${timestamp}_${randomNum}`;
};

async function checkEmailExists(email) {
  const url = `http://localhost:3000/users?email=${email}`;
  console.log(url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return true;
  }
}
