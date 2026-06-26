const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

async function runCode(language, code) {
  return new Promise((resolve, reject) => {
    if (language !== "java") {
      return reject(new Error("Only Java is supported currently."));
    }

    const tempDir = path.join(__dirname, "../temp");

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const javaFile = path.join(tempDir, "Main.java");

    fs.writeFileSync(javaFile, code);

    exec(
      `cd "${tempDir}" && javac Main.java && java Main`,
      (error, stdout, stderr) => {
        if (error) {
          return resolve({
            stdout: "",
            stderr: stderr || error.message,
          });
        }

        resolve({
          stdout,
          stderr,
        });
      }
    );
  });
}

module.exports = {
  runCode,
};