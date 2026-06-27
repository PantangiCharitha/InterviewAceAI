import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import API from "../services/api";
import { InterviewContext } from "../context/InterviewContext";
import PageWrapper from "../components/PageWrapper";

function CodingRound() {
  const navigate = useNavigate();
  const location = useLocation();

const {
  interviewFeedback,
  interviewData,
} = location.state || {};
  const {
  role,
  company,
  resumeData,
} = useContext(InterviewContext);

const [language, setLanguage] = useState("java");

const [code, setCode] = useState("");

const [question, setQuestion] = useState(null);

const [loading, setLoading] = useState(true);

const [output, setOutput] = useState("");

const [timeLeft, setTimeLeft] = useState(30 * 60);
const [evaluation, setEvaluation] = useState(null);
const MAX_CODING_QUESTIONS = 3;

const [codingQuestionNumber, setCodingQuestionNumber] = useState(1);

const [codingResults, setCodingResults] = useState([]);
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

if (response.data.starterCode) {
  setCode(response.data.starterCode);
}

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
const handleSubmitCode = async () => {
  try {
    setLoading(true);

    const response = await API.post("/api/code/submit", {
      language,
      code,
      question,
    });

    console.log(response.data);

    setEvaluation(response.data);
    setCodingResults((prev) => [
  ...prev,
  {
    question,
    code,
    evaluation: response.data,
  },
]);

    setLoading(false);

  } catch (error) {
    console.error(error);

    setLoading(false);

    alert("Failed to evaluate code.");
  }
};
const handleNextQuestion = async () => {

  // Don't go beyond the maximum number of questions
  if (codingQuestionNumber >= MAX_CODING_QUESTIONS) {
    return;
  }

  setLoading(true);
  setEvaluation(null);
  setOutput("");

  try {
    const response = await API.post("/api/coding/question", {
      role,
      company,
      resumeData,
    });

    setQuestion(response.data);

    setCode(response.data.starterCode);

    setCodingQuestionNumber((prev) => prev + 1);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const handleFinishCoding = async () => {

  try {

    const response = await API.post(
      "/api/final-feedback",
      {
        interviewFeedback,
        codingResults,
        role,
      }
    );

    navigate("/final-feedback", {
  state: {
    interviewFeedback,
    interviewData,
    codingResults,
    finalFeedback: response.data,
    role,
  },
});

  } catch (error) {
  console.error("FINAL FEEDBACK ERROR:", error);

  if (error.response) {
    console.log(error.response.data);
  }

  alert("Failed to generate final feedback.");
}

};


  return (
<PageWrapper>
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
                Question {codingQuestionNumber} of {MAX_CODING_QUESTIONS}
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
{loading ? (
  <div className="text-center py-10">
    <p className="text-xl font-semibold text-blue-600">
      🤖 AI is generating your coding question...
    </p>
  </div>
) : (
  <>
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-3xl font-bold">
        {question?.title}
      </h2>

      <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
        {question?.difficulty}
      </span>
    </div>

    <p className="text-gray-700 leading-8">
      {question?.description}
    </p>

    <div className="mt-6 bg-indigo-50 rounded-xl p-5">

      <p className="font-bold">Example Input</p>

      <pre className="mt-2">
{question?.exampleInput}
      </pre>

      <p className="font-bold mt-5">
        Example Output
      </p>

      <pre className="mt-2">
{question?.exampleOutput}
      </pre>

      <p className="font-bold mt-5">
        Constraints
      </p>

      <pre className="mt-2 whitespace-pre-wrap">
{question?.constraints}
      </pre>

    </div>
  </>
)}
{question?.testCases?.length > 0 && (
  <div className="mt-6 bg-green-50 rounded-xl p-5">

    <h3 className="text-xl font-bold mb-4">
      🧪 Sample Test Cases
    </h3>

    {question.testCases.map((test, index) => (
      <div
        key={index}
        className="mb-4 border-b pb-4 last:border-none"
      >
        <p>
          <strong>Input:</strong>
        </p>

        <pre>{test.input}</pre>

        <p className="mt-2">
          <strong>Expected Output:</strong>
        </p>

        <pre>{test.expectedOutput}</pre>

      </div>
    ))}

  </div>
)}


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
  onClick={handleSubmitCode}
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl"
>
  📤 Submit Code
</button>
{codingQuestionNumber < MAX_CODING_QUESTIONS ? (
  <button
    onClick={handleNextQuestion}
    disabled={!evaluation}
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl disabled:bg-gray-400"
  >
    ➡ Next Question
  </button>
) : (
  <button
    onClick={handleFinishCoding}
    disabled={!evaluation}
    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl disabled:bg-gray-400"
  >
    🏁 End Interview
  </button>
)}


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

{evaluation && (
  <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">

    <h2 className="text-3xl font-bold text-indigo-700 mb-6">
      🤖 AI Code Evaluation
    </h2>

    <div className="grid grid-cols-2 gap-6">

      <div className="bg-blue-50 rounded-xl p-5">
        <h3 className="font-bold">Correctness</h3>
        <p className="text-3xl mt-2">
          {evaluation.correctness}/10
        </p>
      </div>

      <div className="bg-green-50 rounded-xl p-5">
        <h3 className="font-bold">Overall Score</h3>
        <p className="text-3xl mt-2">
          {evaluation.overallScore}/10
        </p>
      </div>

      <div className="bg-yellow-50 rounded-xl p-5">
        <h3 className="font-bold">Time Complexity</h3>
        <p className="mt-2">
          {evaluation.timeComplexity}
        </p>
      </div>

      <div className="bg-purple-50 rounded-xl p-5">
        <h3 className="font-bold">Space Complexity</h3>
        <p className="mt-2">
          {evaluation.spaceComplexity}
        </p>
      </div>

    </div>

    <div className="mt-8">
      <h3 className="text-xl font-bold mb-3">
        Hire Recommendation
      </h3>

      <p className="text-lg">
        {evaluation.hireRecommendation}
      </p>
    </div>

    <div className="mt-8">
      <h3 className="text-xl font-bold mb-3">
        AI Feedback
      </h3>

      <p>{evaluation.feedback}</p>
    </div>

  </div>
)}

      </div>
    </div>
</PageWrapper>
);
}

export default CodingRound;