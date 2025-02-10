# 📌 ExamaTech

ExamaTech is a dynamic web-based quiz application designed for an engaging and insightful online exam experience. Built with HTML, Tailwind CSS, and JavaScript, it provides personalized quizzes, real-time tracking, and detailed performance reports.

## 🚀 Overview

- Secure user authentication (sign-up, sign-in, and session management).
- Unique quizzes with randomized question order.
- Live score tracking and quiz progress monitoring.
- Filters for answered, unanswered, and flagged questions.
- Detailed reports with correct/incorrect answers, time taken, and final grade.
- JSON-based backend for lightweight data management.
- Smooth UI with optimized error handling and loading states.

## 🛠 Tech Stack

- **HTML5** – Application structure
- **Tailwind CSS** – UI styling
- **JavaScript (ES6+)** – Functionality and interactivity
- **JSON & JSON Server** – Data storage and backend simulation

## 📂 Project Structure

```
ExamaTech/
│
├── assets/               # Static files (images, fonts, icons)
├── css/                  # Tailwind CSS and custom styles
│   ├── styles.css        # Input CSS file for Tailwind
│   ├── output.css        # Compiled Tailwind CSS file
├── js/                   # JavaScript files
│   ├── components/       # Reusable scripts for UI components
│   ├── pages/            # Page-specific scripts
│   ├── utils/            # Helper functions
│   └── main.js           # Main script file
├── json/                 # JSON data storage
│   ├── Users.json        # User data
│   ├── Questions.json    # Quiz questions
│   ├── User-grades.json  # User grades
├── templates/            # Reusable HTML components
├── pages/                # HTML pages
├── docs/                 # Project documentation
├── tests/                # Test files for JS and CSS
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
└── index.html            # Main entry point
```

## 🚀 Installation & Setup

### 1️⃣ Clone the repository:

```sh
git clone https://github.com/your-repo/ExamaTech.git
```

### 2️⃣ Navigate to the project directory:

```sh
cd ExamaTech
```

### 3️⃣ Install dependencies (if using npm):

```sh
npm install
```

### 4️⃣ Build Tailwind CSS (if modified):

```sh
npm run build:css
```

### 5️⃣ Start JSON Servers:

- Users data:
  ```sh
  npm run users
  ```
- Questions data:
  ```sh
  npm run questions
  ```
- Grades data:
  ```sh
  npm run grades
  ```

### 6️⃣ Run the Project

- Open `index.html` in a browser.
- OR use a live server extension in VS Code for a better development experience.

## 📜 Features

- **User Authentication** – Sign up, sign in, and session management.
- **Randomized Quizzes** – Different question order for each user.
- **Live Score Tracking** – Progress stored and displayed.
- **Quiz Filters** – Review answered, flagged, and unanswered questions.
- **Detailed Reports** – View quiz performance, time taken, and grades.
- **JSON-Based Backend** – No database needed.
- **Smooth UI & Error Handling** – Includes loading states and error messages.

## 🐞 Issues & Feedback

Report issues or suggest improvements in the repository.

## 📄 License

Licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
