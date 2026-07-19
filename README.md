# YEHA – Personalized Study Assistant

## Overview

YEHA is a web-based personalized study assistant designed to help students improve their 
learning experience through personalized recommendations and progress tracking. The application analyzes
a student's learning preferences, study challenges, and goals to recommend effective study methods. 
It also allows students to record study sessions, monitor their progress, and review their learning history.

## Features

### User Authentication
- Register and log in securely
- Persistent user sessions
- Edit personal profile information

### Learning Assessment
- Assess learning styles
- Identify study challenges
- Define learning goals
- Generate personalized study recommendations

### Study Sessions
- Start personalized study sessions
- Set study goals
- Receive study guidance based on assessment results
- Save completed sessions

### Dashboard
- View personalized recommendations
- Access study statistics
- Navigate to different sections of the application

### History
- Record assessments and study sessions
- Search study history
- Filter by activity type and date
- Sort history records

### Profile
- View personal information
- View learning profile
- Track study statistics
- Retake the learning assessment

### User Interface
- Responsive design
- Dark mode support
- Simple and user-friendly interface

## Technologies Used

### Frontend
- React.js
- JavaScript (ES6)
- Tailwind CSS
- React Icons

### Storage
- Browser Local Storage

### State Management
- React Hooks
- Custom event-based data synchronization


## Project Structure

src/
│
├── components/
│   ├── Dashboard.jsx
│   ├── EndSession.jsx
│   ├── History.jsx
│   ├── HistoryItem.jsx
│   ├── HistoryStats.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Navbar.jsx
│   ├── NewRequest.jsx
│   ├── Profile.jsx
│   └── StudySession.jsx
│
├── data/
│   └── mockData.js
│
├── utils/
│   ├── dataSync.js
│   └── historyUtils.js
│
├── App.js
├── index.js
└── index.css



## Installation

Clone the repository:

bash
git clone https://github.com/yourusername/yeha.git


Navigate to the project folder:

bash
cd yeha


Install the required dependencies:

bash
npm install


Start the development server:

bash
npm run dev


The application will be available at:


http://localhost:5173



## How It Works

1. Users create an account or log in.
2. The user completes a learning assessment.
3. YEHA analyzes the user's learning style, study challenges, and goals.
4. Personalized study recommendations are generated.
5. The user starts study sessions using the recommended techniques.
6. Completed study sessions are saved to the user's history.
7. The dashboard and profile display updated statistics and learning progress.


## Data Storage

The application stores data locally in the browser using Local Storage.

Stored information includes:

- User account information
- Learning profile
- Assessment results
- Study session history
- User preferences

## Future Improvements

Possible future enhancements include:

- AI-generated study recommendations
- Cloud database integration
- User authentication with Firebase
- Study reminders and notifications
- Pomodoro timer
- Progress analytics and charts
- Achievement system
- Calendar integration
- Export study reports

## License

This project was developed for educational purposes.
