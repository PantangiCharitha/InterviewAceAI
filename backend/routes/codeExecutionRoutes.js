const express = require("express");
const router = express.Router();

const {
  runCode,
} = require("../services/codeExecutionService");

router.post("/run", async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        error: "Language and code are required.",
      });
    }

    const result = await runCode(language, code);

    res.json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to execute code.",
    });
  }
});

module.exports = router;