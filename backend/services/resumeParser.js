const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");

const {
  generateQuestionFromPrompt,
} = require("./aiService");

async function parseResume(filePath) {
  let resumeText = "";

  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".pdf") {
    const buffer = fs.readFileSync(filePath);

    const data = await pdf(buffer);

    resumeText = data.text;
  }

  else if (extension === ".docx") {
    const result =
      await mammoth.extractRawText({
        path: filePath,
      });

    resumeText = result.value;
  }

  else {
    throw new Error("Unsupported file type.");
  }

  const prompt = `
You are an expert resume parser.

Extract the following information from this resume.

Return ONLY valid JSON.

{
  "name":"",
  "email":"",
  "phone":"",
  "skills":[],
  "projects":[],
  "education":[],
  "experience":[],
  "certifications":[]
}

Resume:

${resumeText}
`;

  const aiResponse =
    await generateQuestionFromPrompt(prompt);

  const cleanResponse = aiResponse
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanResponse);
}

module.exports = {
  parseResume,
};