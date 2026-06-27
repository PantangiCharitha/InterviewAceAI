const {
  generateQuestionFromPrompt,
} = require("./aiService");

async function generateFinalFeedback(data) {

  const {
    interviewFeedback,
    codingResults,
    role,
  } = data;

  const prompt = `
You are a Senior Technical Hiring Manager.

Role:
${role}

Interview Feedback:
${JSON.stringify(interviewFeedback, null, 2)}

Coding Results:
${JSON.stringify(codingResults, null, 2)}

Return ONLY valid JSON.

{
  "overallScore":0,
  "grade":"",
  "recommendation":"",
  "strengths":[],
  "improvements":[],
  "summary":""
}
`;

  const response = await generateQuestionFromPrompt(prompt);

  const clean = response
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const jsonStart = clean.indexOf("{");
  const jsonEnd = clean.lastIndexOf("}");

  return JSON.parse(clean.substring(jsonStart, jsonEnd + 1));
}

module.exports = {
  generateFinalFeedback,
};