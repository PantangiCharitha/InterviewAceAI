import { useEffect, useState, useContext } from "react";
import CodeEditor from "../components/CodeEditor";
import API from "../services/api";
import { InterviewContext } from "../context/InterviewContext";

function CodingRound() {
  const {
  role,
  company,
  resumeData,
} = useContext(InterviewContext);

const [language, setLanguage] = useState("java");

const [code, setCode] = useState(`public class Main {

    public static void main(String[] args) {

    }

}`);

const [question, setQuestion] = useState(null);

const [loading, setLoading] = useState(true);

const [output, setOutput] = useState("");

const [timeLeft, setTimeLeft] = useState(30 * 60);
useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);
const minutes = Math.floor(timeLeft / 60);

const seconds = timeLeft % 60;
useEffect(() => {
  async function fetchCodingQuestion() {
    try {
      const response = await API.post(
        "/api/coding/question",
        {
          role,
          company,
          resumeData,
        }
      );

      setQuestion(response.data);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  fetchCodingQuestion();

}, []);
const handleRunCode = async () => {
  try {
    setOutput("Running...");

    const response = await API.post("/api/code/run", {
      language,
      code,
    });

    const result = response.data;

    if (result.stderr) {
      setOutput(result.stderr);
    } else if (result.output) {
      setOutput(result.output);
    } else if (result.stdout) {
      setOutput(result.stdout);
    } else {
      setOutput("Program executed successfully. No output.");
    }

  } catch (error) {
    console.error(error);
    setOutput("Error while running code.");
  }
};


  return (
    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-4xl font-bold text-indigo-700">
                💻 Coding Assessment
              </h1>

              <p className="text-gray-500 mt-2">
                Question 1 of 3
              </p>

            </div>

            <div className="text-right">

              <p className="text-sm text-gray-500">
                Time Remaining
              </p>

              <h2 className="text-3xl font-bold text-red-600">
  {String(minutes).padStart(2, "0")}:
  {String(seconds).padStart(2, "0")}
</h2>

            </div>

          </div>

        </div>

        {/* Question */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Reverse a String
          </h2>

          <p className="text-gray-700 leading-8">
            Write a function that takes a string as input and
            returns the reversed string.
          </p>

          <div className="mt-6 bg-indigo-50 rounded-xl p-5">

            <p>
              Example:
            </p>

            <pre className="mt-3">
Input: hello

Output: olleh
            </pre>

          </div>

        </div>

        {/* Monaco */}

        <CodeEditor
          language={language}
          setLanguage={setLanguage}
          code={code}
          setCode={setCode}
        />

        {/* Buttons */}

        <div className="flex justify-end gap-5 mt-8">

          <button
  onClick={handleRunCode}
  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
>
  ▶ Run Code
</button>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl"
          >
            📤 Submit Code
          </button>


        </div>
        {output && (
  <div className="mt-8 bg-black rounded-2xl p-5">
    <h2 className="text-lg font-bold text-green-400 mb-3">
      Console Output
    </h2>

    <pre className="text-green-300 whitespace-pre-wrap">
      {output}
    </pre>
  </div>
)}


      </div>

    </div>
  );
}

export default CodingRound;