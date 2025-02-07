export function displayUserNameWithEffect(messageElement, message) {
  let index = 0;
  const intervalId = setInterval(() => {
    messageElement.textContent = message.substring(0, index + 1);
    index++;
    if (index >= message.length) {
      clearInterval(intervalId);
      const blinkInterval = setInterval(() => {
        messageElement.textContent = message + (index % 2 === 0 ? "|" : ""); // Blink cursor effect
        index++;
        if (index >= message.length + 6) {
          clearInterval(blinkInterval);
          messageElement.textContent = message; // Stop blinking and show complete message
        }
      }, 500);
    }
  }, 150);
}
