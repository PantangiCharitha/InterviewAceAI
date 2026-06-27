const { runCode } = require("./codeExecutionService");
const {
  generateQuestionFromPrompt,
} = require("./aiService");

async function evaluateCode(data) {

  const {
    language,
    code,
    question,
  } = data;

  // Execute the candidate's code
  const execution = await runCode(language, code);

  const prompt = `
You are a Senior Software Engineer.

Evaluate this coding solution.

Problem Title:
${question.title}

Problem Description:
${question.description}

Expected Solution:
${question.expectedSolutionApproach}

Candidate Code:

${code}

Program Output:

${execution.stdout}

Compilation Errors:

${execution.stderr}

Return ONLY valid JSON.

{
"correctness":0,
"codeQuality":0,
"timeComplexity":"",
"spaceComplexity":"",
"overallScore":0,
"hireRecommendation":"",
"strengths":[
"",
""
],
"improvements":[
"",
""
],
"feedback":""
}
`;

  const response =
    await generateQuestionFromPrompt(prompt);

  const cleanResponse = response
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const feedback = JSON.parse(cleanResponse);

  feedback.consoleOutput = execution.stdout;
  feedback.consoleError = execution.stderr;

  return feedback;
}

module.exports = {
  evaluateCode,
};