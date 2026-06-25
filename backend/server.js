require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  generateQuestion,
  generateQuestionFromPrompt,
} = require("./services/aiService");

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
app.post("/api/feedback", async (req, res) => {
  try {
    const { interviewData, role } = req.body;

    const prompt = `
You are a senior technical interviewer.

Evaluate the interview.

Role:
${role}

Interview Transcript:
${JSON.stringify(interviewData)}

Return ONLY valid JSON.

The JSON must have EXACTLY this structure:

{
  "communicationScore": 8,
  "technicalScore": 9,
  "confidenceScore": 8,
  "strengths": [
    "...",
    "..."
  ],
  "improvements": [
    "...",
    "..."
  ],
  "recommendation": "Hire",
  "overallFeedback": "..."
}

Rules:

- communicationScore must be an integer from 1-10
- technicalScore must be an integer from 1-10
- confidenceScore must be an integer from 1-10
- recommendation must be ONLY one of:
  "Hire"
  "Maybe Hire"
  "No Hire"

Return ONLY JSON.

No markdown.

No explanation.
`;

    const feedback =
      await generateQuestionFromPrompt(prompt);

    const parsedFeedback = JSON.parse(feedback);

res.json(parsedFeedback);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate feedback",
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});