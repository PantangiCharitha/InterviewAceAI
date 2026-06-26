require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
  generateQuestion,
  generateQuestionFromPrompt,
} = require("./services/aiService");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => {
  res.send("InterviewAce Backend Running");
});

app.post("/api/start", async (req, res) => {
  try {
    const {
  role,
  interviewType,
  company,
  resumeData,
} = req.body;

    const prompt = `
You are a senior ${company} interviewer.

Candidate Role:
${role}

Interview Type:
${interviewType}

Candidate Resume:

${JSON.stringify(resumeData, null, 2)}

Instructions:

1. Ask ONE interview question.
2. Use the candidate's resume.
3. Ask about projects when appropriate.
4. Ask about skills listed in the resume.
5. Ask according to ${company}'s interview style.
6. Do not greet.
7. Do not explain.
8. Output ONLY the question.
`;

const question =
  await generateQuestionFromPrompt(prompt);

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
  company,
  resumeData,
  currentQuestion,
  answer,
  interviewData,
} = req.body;
// Normalize the user's answer
const userAnswer = answer.toLowerCase();
console.log("User Answer:", userAnswer);

// Need more time
if (
  userAnswer.includes("minute") ||
  userAnswer.includes("moment") ||
  userAnswer.includes("wait") ||
  userAnswer.includes("think")
) {
  return res.json({
    question:
      "Sure, take your time. When you're ready, simply continue answering the previous question.",
  });
}

// Repeat question
if (
  userAnswer.includes("repeat") ||
  userAnswer.includes("again")
) {
  return res.json({
    question: currentQuestion,
  });
}

// Doesn't know
if (
  userAnswer.includes("don't know") ||
  userAnswer.includes("dont know") ||
  userAnswer.includes("no idea") ||
  userAnswer.includes("not sure")
) {
  return res.json({
    question:
      "That's completely fine. Could you explain how you would approach solving it, even if you're unsure of the exact answer?",
  });
}

// Skip
if (
  userAnswer.includes("skip") ||
  userAnswer.includes("next")
) {
  const prompt = `
You are a senior interviewer at ${company}.

Candidate Role:
${role}

Interview Type:
${interviewType}

Candidate Resume:
${JSON.stringify(resumeData, null, 2)}

Interview Progress:
Question ${interviewData.length + 1}

Previous Question:
${currentQuestion}

Candidate Answer:
${answer}

Instructions:

- Continue the interview naturally.
- Use the resume to ask about:
  • Skills
  • Projects
  • Experience
  • Certifications
- Ask deeper follow-up questions when appropriate.
- Mix role-based questions with resume-based questions.
- Follow ${company}'s interview style.
- Never repeat a previous question.
- Return ONLY the next interview question.
`;

  const question =
    await generateQuestionFromPrompt(prompt);

  return res.json({ question });
}
    const prompt = `
You are a professional interviewer with 10+ years of experience.

Role: ${role}

Interview Type: ${interviewType}

Current Interview Progress:
Question Number: ${interviewData?.length + 1 || 2}

Previous Question:
${currentQuestion}

Candidate Answer:
${answer}

Instructions:

1. Carefully analyze the candidate's answer.
2. If the answer is short, ask for more details.
3. If the answer is good, ask a deeper follow-up.
4. If the answer mentions a project, ask about technologies, challenges, architecture or impact.
5. Never repeat previous questions.
6. Keep the interview conversational.
7. Ask ONLY ONE question.
8. Do not provide feedback.
9. Do not provide explanations.
10. Output ONLY the next interview question.
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
  console.log("🔥 /api/feedback route hit");

  try {
    const { interviewData, role } = req.body;

   const prompt = `
You are a senior interviewer evaluating a completed interview.

Role:
${role}

Interview Transcript:
${JSON.stringify(interviewData)}

Evaluate the candidate professionally.

Scoring Guidelines:

Communication Score (1–10)
- Clarity
- Grammar
- Confidence
- Structure

Technical Score (1–10)
- Technical correctness
- Knowledge depth
- Problem-solving
- Examples

Confidence Score (1–10)
- Fluency
- Completeness
- Professional tone

Do NOT give extremely low scores unless the answers are genuinely poor.

Average candidates should score around 6–8.

Excellent candidates should score 8–10.

Return ONLY valid JSON:

{
  "communicationScore": 8,
  "technicalScore": 8,
  "confidenceScore": 7,
  "strengths":[
    "...",
    "..."
  ],
  "improvements":[
    "...",
    "..."
  ],
  "recommendation":"Hire",
  "overallFeedback":"..."
}
`;

    const feedback =
      await generateQuestionFromPrompt(prompt);
      console.log("========== RAW AI RESPONSE ==========");
console.log(feedback);
console.log("====================================");
      console.log("Raw AI Response:\n", feedback);

 try {
  const cleanFeedback = feedback
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  console.log("Clean Feedback:\n", cleanFeedback);

  const parsedFeedback = JSON.parse(cleanFeedback);

  res.json(parsedFeedback);
} catch (err) {
  console.error("JSON Parse Error:", err);
  console.log("Raw AI Response:\n", feedback);

  res.status(500).json({
    error: "Invalid JSON returned by AI",
  });
}
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