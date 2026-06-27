const express = require("express");
const router = express.Router();

const {
  generateFinalFeedback,
} = require("../services/finalFeedbackService");

router.post("/", async (req, res) => {
  try {
    const result = await generateFinalFeedback(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to generate final feedback.",
    });
  }
});

module.exports = router;