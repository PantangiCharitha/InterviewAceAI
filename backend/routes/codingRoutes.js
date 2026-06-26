const express = require("express");

const router = express.Router();

const {
  generateQuestionFromPrompt,
} = require("../services/aiService");

router.post("/question", async (req, res) => {
  try {
    const {
      role,
      company,
      resumeData,
    } = req.body;

    const prompt = `
You are a senior ${company} coding interviewer.

Candidate Role:
${role}

Candidate Resume:
${JSON.stringify(resumeData, null, 2)}

Generate ONE coding interview question.

The question should match:

- Candidate skills
- Candidate projects
- Candidate experience
- ${company} interview style

Return ONLY valid JSON.

{
"title":"",
"difficulty":"",
"description":"",
"exampleInput":"",
"exampleOutput":"",
"constraints":""
}
`;

    const response =
      await generateQuestionFromPrompt(prompt);

    const cleanResponse = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    res.json(JSON.parse(cleanResponse));

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate coding question",
    });
  }
});

module.exports = router;