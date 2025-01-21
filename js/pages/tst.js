const generateUserId = function () {
  const timestamp = Date.now().toString().slice(-5);
  const randomNum = Math.floor(Math.random() * 100);
  return `user_${timestamp}_${randomNum}`;
};

// Example usage:
const newUserId = generateUserId();
console.log("Generated User ID:", newUserId);
