const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Dummy questions (no database yet)
const questions = [
    {
        id: 1,
        question: "What is 2 + 2?",
        answer: "4"
    },
    {
        id: 2,
        question: "Reverse 'hello'",
        answer: "olleh"
    }
];

// Home route
app.get("/", (req, res) => {
    res.send("Question Platform Backend Running 🚀");
});

// Get all questions
app.get("/questions", (req, res) => {
    const safeQuestions = questions.map(q => ({
        id: q.id,
        question: q.question
    }));

    res.json(safeQuestions);
});

// Submit answer
app.post("/submit", (req, res) => {
    const { id, userAnswer } = req.body;

    const q = questions.find(item => item.id === id);
    if (!id || !userAnswer) {
        return res.json({
            success: false,
            message: "Please provide id and answer"
        });
    }
    if (!q) {
        return res.json({
            success: false,
            message: "Question not found"
        });
    }

    // normalize answers
    const correctAnswer = q.answer.toLowerCase().trim();
    const userAns = userAnswer.toLowerCase().trim();

    if (correctAnswer === userAns) {
        res.json({
            success: true,
            message: "Correct ✅",
            feedback: "Good job!"
        });
    } else {
        res.json({
            success: false,
            message: "Wrong ❌",
            feedback: "Try again or check your logic"
        });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port 3000");
});