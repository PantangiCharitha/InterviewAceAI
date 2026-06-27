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
You are a Senior Software Engineer at ${company} responsible for conducting coding interviews.

Candidate Details:

Role:
${role}

Resume:
${JSON.stringify(resumeData, null, 2)}

Generate ONE realistic coding interview problem.

Requirements:

1. The question must match the candidate's role.
2. Prefer problems related to the candidate's resume skills.
3. Follow ${company}'s interview style.
4. Difficulty should be Easy, Medium or Hard.
5. The problem must NOT be copied verbatim from LeetCode.
6. Create an original interview-style variation.
7. Include examples and constraints.
8. Also provide the expected output for the sample input.
Generate exactly 3 meaningful test cases.

The first test case should match the example.

Generate a Java starter template.

The starter code should compile successfully.

The test cases should cover normal and edge cases.

IMPORTANT:

Return ONLY ONE valid JSON object.

Do NOT write explanations.

Do NOT write markdown.

Do NOT use json.

Do NOT include Java code.

Do NOT include starter templates.

Do NOT add any text before or after the JSON.

Your response MUST start with {

and MUST end with }.


{
"title":"",
"difficulty":"",
"description":"",
"exampleInput":"",
"exampleOutput":"",
"constraints":"",
"expectedSolutionApproach":"",
"testCases":[
{
"input":"",
"expectedOutput":""
},
{
"input":"",
"expectedOutput":""
},
{
"input":"",
"expectedOutput":""
}
]
}
`;
    const response =
      await generateQuestionFromPrompt(prompt);

    const cleanResponse = response
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

console.log("========== AI RESPONSE ==========");
console.log(cleanResponse);
console.log("================================");

const jsonStart = cleanResponse.indexOf("{");
const jsonEnd = cleanResponse.lastIndexOf("}");

const jsonString = cleanResponse.substring(jsonStart, jsonEnd + 1);

const parsed = JSON.parse(jsonString);

parsed.starterCode = `public class Main {

    public static void main(String[] args) {

    }

}`;

res.json(parsed);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate coding question",
    });
  }
});

module.exports = router;