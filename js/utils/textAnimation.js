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

/ * * * * * * * * * * * * * * Icon Animation * * * * * * * * * * * * * * /;
export function animateIcons() {
  const gradeCard = document.querySelector(".grade");
  const timeCard = document.querySelector(".time");
  const dateCard = document.querySelector(".date");

  const medalIcon = gradeCard.querySelector(".fa-medal");
  const sandIcon = timeCard.querySelector(".fa-hourglass-half");
  const calendarIcon = dateCard.querySelector(".fa-calendar-days");

  // Add hover event listeners
  gradeCard.addEventListener("mouseenter", () => {
    addTemporaryClass(medalIcon, "fa-flip", 1000);
  });

  timeCard.addEventListener("mouseenter", () => {
    addTemporaryClass(sandIcon, "fa-flip", 1000);
  });

  dateCard.addEventListener("mouseenter", () => {
    addTemporaryClass(calendarIcon, "fa-bounce", 500);
  });
}

function addTemporaryClass(element, className, duration) {
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, duration);
}
