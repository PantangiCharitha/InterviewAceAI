const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

async function generateQuestion(role, interviewType) {
  const prompt = `
You are an expert interviewer.

Role: ${role}

Interview Type: ${interviewType}

Ask exactly ONE interview question.

Do not provide answers.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

// ADD THIS NEW FUNCTION HERE
async function generateQuestionFromPrompt(prompt) {
  const result = await model.generateContent(prompt);

  return result.response.text();
}

// UPDATE EXPORTS
module.exports = {
  generateQuestion,
  generateQuestionFromPrompt,
};