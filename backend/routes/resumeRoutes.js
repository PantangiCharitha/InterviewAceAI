const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  parseResume,
} = require("../services/resumeParser");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
    );
  },
});

const upload = multer({
  storage,
});

router.post(
  "/upload",
  upload.single("resume"),
  async (req, res) => {
    try {
      const parsedResume =
        await parseResume(req.file.path);

      res.json({
        success: true,
        resume: parsedResume,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to parse resume.",
      });
    }
  }
);

module.exports = router;