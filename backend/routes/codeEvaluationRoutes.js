const express = require("express");
const router = express.Router();

const {
  evaluateCode,
} = require("../services/codeEvaluationService");

router.post("/submit", async (req, res) => {
  try {
    const result = await evaluateCode(req.body);

    res.json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to evaluate code.",
    });
  }
});

module.exports = router;