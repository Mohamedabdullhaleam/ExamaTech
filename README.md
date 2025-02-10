# 📌 ExamaTech

ExamaTech is a dynamic web-based quiz application designed for an engaging and insightful online exam experience. Built with HTML, Tailwind CSS, and JavaScript, it provides personalized quizzes, real-time tracking, and detailed performance reports.

## 📑 Table of Contents

- [Overview](#overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Features](#-features)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Issues & Feedback](#-issues--feedback)
- [License](#-license)

## 🚀 Overview

- Secure user authentication (sign-up, sign-in, and session management).
- Unique quizzes with randomized question order.
- Live score tracking and quiz progress monitoring.
- Filters for answered, unanswered, and flagged questions.
- Detailed reports with correct/incorrect answers, time taken, and final grade.
- JSON-based backend for lightweight data management.
- Smooth UI with optimized error handling and loading states.
- Future plans: Implementing a real database, multiple quizzes, and a user ranking dashboard.

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

### 3️⃣ Install dependencies:

```sh
npm install
```

### 4️⃣ Install JSON Server (if not installed):

```sh
npm install -g json-server
```

### 5️⃣ Build Tailwind CSS (if modified):

```sh
npm run build:css
```

### 6️⃣ Start JSON Servers:

#### JSON Server Setup

The project uses `json-server` to simulate a backend. Run the following commands to start the servers:

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

### 7️⃣ Run the Project

- Open `signup.html` in a browser.
- OR use a live server extension in VS Code for a better development experience.

## 📜 Features

- **User Authentication** – Sign up, sign in, and session management.
- **Randomized Quizzes** – Different question order for each user.
- **Live Score Tracking** – Progress stored and displayed.
- **Quiz Filters** – Review answered, flagged, and unanswered questions.
- **Detailed Reports** – View quiz performance, time taken, and grades.
- **JSON-Based Backend** – No database needed.
- **Smooth UI & Error Handling** – Includes loading states and error messages.

## 🔥 Roadmap

- **Phase 1**: Current implementation with JSON-based storage.
- **Phase 2**: Migrate to a real database.
- **Phase 3**: Support multiple quizzes and subjects.
- **Phase 4**: Build a user ranking dashboard with performance insights.

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch (`feature-branch`).
3. Commit your changes.
4. Push to your fork.
5. Open a pull request.

## 🐞 Issues & Feedback

Report issues or suggest improvements in the repository.

## 📄 License

Licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
