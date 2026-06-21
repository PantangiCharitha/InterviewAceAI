require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  generateQuestion,
  generateQuestionFromPrompt,
} = require("./services/geminiService");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("InterviewAce Backend Running");
});

app.post("/api/start", async (req, res) => {
  try {
    const { role, interviewType } = req.body;

    const question = await generateQuestion(
      role,
      interviewType
    );

    res.json({ question });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate question",
    });
  }
});

const PORT = 5000;
app.post("/api/next-question", async (req, res) => {
  try {
    const {
      role,
      interviewType,
      currentQuestion,
      answer,
    } = req.body;

    const prompt = `
You are an expert interviewer.

Role: ${role}

Interview Type: ${interviewType}

Previous Question:
${currentQuestion}

Candidate Answer:
${answer}

Based on the answer, ask ONE relevant follow-up interview question.

Do not explain.
Do not evaluate.
Ask only the next question.
`;

    const question = await generateQuestionFromPrompt(prompt);

    res.json({ question });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate follow-up question",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});