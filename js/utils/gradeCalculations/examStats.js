/ * * * * * Calculations functions * * * * * /;
// Function to calculate the grade percentage
export function calculateGradePercentage(userData) {
  const totalQuestions = userData.quizAttempts[0].attempts[0].answers.length;
  const quizAttempts = userData.quizAttempts[0].attempts;
  const lastAttempt = quizAttempts[quizAttempts.length - 1];
  const score = lastAttempt.score;
  const percentage = (score / totalQuestions) * 100;
  return percentage.toFixed(2);
}

function getCurrentUsername() {
  return localStorage.getItem("loggedInUser");
}

/ * * * fetching last tested student data * * * /;
export async function fetchGradesByUsername() {
  const username = getCurrentUsername();
  if (!username) {
    console.error("No logged-in user found.");
    throw new Error(`No User Founded`);
  }
  const url = `http://localhost:3020/grades?username=${username}`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch grades: ${response.status}`);
    const data = await response.json();
    // get last user data
    return data.length > 0 ? data[data.length - 1] : null;
  } catch (error) {
    window.location.replace("notFound.html");
    console.error("Error fetching grades:", error);
    return null;
  }
}
