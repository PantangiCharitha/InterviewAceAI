const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function askAI(prompt) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a professional technical interviewer.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

async function generateQuestion(role, interviewType) {
  const prompt = `
You are a professional interviewer.

Role:
${role}

Interview Type:
${interviewType}

Rules:

- Ask ONE interview question.
- Don't greet.
- Don't explain.
- Don't number questions.
- Return only the question.
`;

  return askAI(prompt);
}

async function generateQuestionFromPrompt(prompt) {
  return askAI(prompt);
}

module.exports = {
  generateQuestion,
  generateQuestionFromPrompt,
};