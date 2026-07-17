// This is now a function that takes user data
export const getMockData = (userName = "Student") => {
  return {
    user: {
      name: userName,
      email: "user@example.com",
      totalStudyHours: 18,
      averageGrade: 72
    },
    
    subjects: [
      {
        id: 1,
        name: "Mathematics",
        grade: 72,
        studyHours: 6,
        method: "practice problems",
        trend: "up",
        emoji: "📐"
      },
      {
        id: 2,
        name: "Physics",
        grade: 65,
        studyHours: 4,
        method: "reading notes",
        trend: "down",
        emoji: "⚛️"
      },
      {
        id: 3,
        name: "English",
        grade: 85,
        studyHours: 3,
        method: "active recall",
        trend: "up",
        emoji: "📚"
      },
      {
        id: 4,
        name: "Computer Science",
        grade: 78,
        studyHours: 5,
        method: "coding practice",
        trend: "stable",
        emoji: "💻"
      }
    ],

    recommendations: [
      {
        id: 1,
        subject: "Physics",
        suggestion: "Switch from reading notes to practice problems",
        impact: "Predicted improvement: +12%",
        priority: "high",
        steps: [
          "Do 30 min of practice problems daily",
          "Focus on weak areas: mechanics",
          "Use YouTube tutorials for visual learning"
        ]
      },
      {
        id: 2,
        subject: "Mathematics",
        suggestion: "Try spaced repetition for formulas",
        impact: "Predicted improvement: +8%",
        priority: "medium",
        steps: [
          "Review formulas every 2 days",
          "Use Anki flashcards for key concepts",
          "Practice past exam questions"
        ]
      },
      {
        id: 3,
        subject: "All Subjects",
        suggestion: "Use Pomodoro technique for focus",
        impact: "Predicted improvement: +5% overall",
        priority: "low",
        steps: [
          "Study 25 min → 5 min break",
          "Take a 15 min break after 4 sessions",
          "Track your focus with a timer"
        ]
      }
    ],

    methodEffectiveness: [
      { method: "practice problems", score: 92, icon: "✍️" },
      { method: "active recall", score: 88, icon: "🧠" },
      { method: "coding practice", score: 85, icon: "💻" },
      { method: "spaced repetition", score: 80, icon: "🔄" },
      { method: "reading notes", score: 45, icon: "📖" },
      { method: "watching videos", score: 60, icon: "🎥" }
    ]
  };
};

// For backward compatibility
export const mockData = getMockData("Student");