const express = require("express");
const mongoose = require("mongoose");
const Question = require("./models/Question");

const app = express();
const PORT = 3000;

app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
mongoose.connect("mongodb://127.0.0.1:27017/questionDB")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

/* =========================
   Home Route
========================= */
app.get("/", (req, res) => {
    res.send("Question Platform Backend Running 🚀");
});

/* =========================
   Get All Questions (DB)
========================= */
app.get("/questions", async (req, res) => {
    try {
        const questions = await Question.find({}, "question");
        res.json(questions);
    } catch (error) {
        res.json({
            success: false,
            message: "Error fetching questions"
        });
    }
});

/* =========================
   Submit Answer (DB)
========================= */
app.post("/submit", async (req, res) => {
    const { id, userAnswer } = req.body;

    // validation FIRST
    if (!id || !userAnswer) {
        return res.json({
            success: false,
            message: "Please provide id and answer"
        });
    }

    try {
        // find question in DB
        const q = await Question.findById(id);

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

    } catch (error) {
        res.json({
            success: false,
            message: "Error processing request"
        });
    }
});

/* =========================
   Add Sample Question (TEMP)
========================= */
app.get("/add", async (req, res) => {
    try {
        await Question.create({
            question: "What is 2 + 2?",
            answer: "4"
        });

        res.send("Question added");
    } catch (error) {
        res.send("Error adding question");
    }
});

/* =========================
   Start Server
========================= */
app.listen(PORT, () => {
    console.log("Server running on port 3000");
});