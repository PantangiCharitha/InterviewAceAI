import {
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { InterviewContext } from "../context/InterviewContext";
import API from "../services/api";
import { generateInterviewReport } from "../utils/pdfReport";
import FeedbackDashboard from "../components/FeedbackDashboard";
import LoadingOverlay from "../components/LoadingOverlay";

function Interview() {
  const {
  role,
  interviewType,
  company,
  resumeData,
} = useContext(InterviewContext);
const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");
const [messages, setMessages] = useState([]);

const [loading, setLoading] = useState(false);
const [seconds, setSeconds] = useState(0);
const [isListening, setIsListening] = useState(false);

const [feedback, setFeedback] = useState(null);
const [interviewData, setInterviewData] = useState([]);

const [questionCount, setQuestionCount] = useState(1);
const MAX_QUESTIONS = 10;
const [interviewCompleted, setInterviewCompleted] = useState(false);

const progress = (questionCount / MAX_QUESTIONS) * 100;

const recognitionRef = useRef(null);
const transcriptRef = useRef("");
  useEffect(() => {
    fetchQuestion();
  }, []);
  
  useEffect(() => {
  if (interviewCompleted) return;

  const interval = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [interviewCompleted]);
useEffect(() => {
  if (question) {
    speakText(question);
  }
}, [question]);
 const fetchQuestion = async () => {
  try {
    setLoading(true);

    const response = await API.post("/api/start", {
  role,
  interviewType,
  company,
  resumeData,
});

    setQuestion(response.data.question);

    setMessages([
      {
        sender: "ai",
        text: response.data.question,
      },
    ]);

    setLoading(false);

  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};
const speakText = (text) => {
  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
};
const startListening = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported.");
    return;
  }

  // Create only once
  if (!recognitionRef.current) {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let finalTranscript = transcriptRef.current;

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          finalTranscript +=
            event.results[i][0].transcript + " ";
        }
      }

      transcriptRef.current = finalTranscript;
      setAnswer(finalTranscript.trim());
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }

  recognitionRef.current.start();
  setIsListening(true);
};
const stopListening = () => {
  if (recognitionRef.current) {
    recognitionRef.current.stop();
  }
};


 const handleSendAnswer = async () => {
  if (!answer.trim()) {
    alert("Please provide an answer before sending.");
    return;
  }

  try {
    // Save current Q&A
    const updatedInterviewData = [
      ...interviewData,
      {
        question,
        answer,
      },
    ];

    setInterviewData(updatedInterviewData);

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: answer,
      },
    ]);

    // 🚀 Interview finished
    if (questionCount >= MAX_QUESTIONS) {
      setInterviewCompleted(true);

      setLoading(true);

     const feedbackResponse = await API.post("/api/feedback", {
  interviewData: updatedInterviewData,
  role,
});

setFeedback(feedbackResponse.data);

// Save interview to Local Storage
const interviewRecord = {
  role,
  interviewType,
  date: new Date().toLocaleString(),
  grade,
  feedback: feedbackResponse.data,
  interviewData: updatedInterviewData,
};

const existingHistory =
  JSON.parse(localStorage.getItem("interviewHistory")) || [];

existingHistory.unshift(interviewRecord);

localStorage.setItem(
  "interviewHistory",
  JSON.stringify(existingHistory)
);

      setLoading(false);

      setAnswer("");
      transcriptRef.current = "";

      return;
    }

    // Ask next AI question
    const response = await API.post("/api/next-question", {
  role,
  interviewType,
  company,
  resumeData,
  currentQuestion: question,
  answer,
  interviewData,
});

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: response.data.question,
      },
    ]);

    setQuestion(response.data.question);

    setQuestionCount((prev) => prev + 1);

    setAnswer("");
    transcriptRef.current = "";

  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};
const handleEndInterview = async () => {
  try {
    setLoading(true);

    const response = await API.post("/api/feedback", {
      interviewData,
      role,
    });

    setFeedback(response.data);

    // Save interview to Local Storage
    const interviewRecord = {
      role,
      interviewType,
      date: new Date().toLocaleString(),
      grade,
      feedback: response.data,
      interviewData,
    };

    const existingHistory =
      JSON.parse(localStorage.getItem("interviewHistory")) || [];

    existingHistory.unshift(interviewRecord);

    localStorage.setItem(
      "interviewHistory",
      JSON.stringify(existingHistory)
    );

    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};
const average =
  (
    feedback?.communicationScore +
    feedback?.technicalScore +
    feedback?.confidenceScore
  ) / 3;

const grade =
  average >= 9
    ? "A+"
    : average >= 8
    ? "A"
    : average >= 7
    ? "B+"
    : average >= 6
    ? "B"
    : average >= 5
    ? "C"
    : "D";

const downloadReport = () => {
  if (!feedback) {
    alert("Generate feedback before downloading the report.");
    return;
  }

  generateInterviewReport({
    role,
    interviewType,
    feedback,
    interviewData,
    grade,
  });
};

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col items-center p-8">      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 mb-8">

  <h1 className="text-4xl font-bold text-center text-blue-700">
    🎯 InterviewAce AI
  </h1>

  <p className="text-center text-gray-500 mt-2">
    AI Powered Mock Interview Platform
  </p>

  <div className="flex justify-between mt-8">

    <div>
      <p className="text-lg font-semibold">
        👤 Role
      </p>

      <p className="text-gray-600">
        {role}
      </p>
    </div>

    <div>
      <p className="text-lg font-semibold">
        📋 Interview Type
      </p>

      <p className="text-gray-600">
        {interviewType}
      </p>
    </div>

    <div>
      <p className="text-lg font-semibold">
        ⏱ Time
      </p>

      <p>
        {Math.floor(seconds / 60)}:
        {(seconds % 60)
          .toString()
          .padStart(2, "0")}
      </p>
    </div>

  </div>

  <div className="mt-8">

    <div className="flex justify-between mb-2">
  <p>
    Question {questionCount} / {MAX_QUESTIONS}
  </p>

  <p>
    {Math.round(progress)}%
  </p>
</div>

    <div className="w-full bg-gray-200 rounded-full h-3">

      <div
        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
       style={{ width: `${progress}%` }}
      />

    </div>

  </div>

</div>

      <div className="mt-6 w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="font-semibold">
          AI Question
        </h2>
        {loading && (
  <div className="flex items-center gap-2 mt-3 mb-3">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>

    <p className="text-blue-600">
      AI is preparing your question...
    </p>
  </div>
)}

       <div className="w-full max-w-4xl mx-auto space-y-5 mb-6">

  {messages.map((msg, index) => (

    <div
      key={index}
      className={`flex ${
        msg.sender === "ai"
          ? "justify-start"
          : "justify-end"
      }`}
    >

      <div
        className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-md transition-all duration-300 ${
          msg.sender === "ai"
            ? "bg-gradient-to-r from-blue-50 to-indigo-100"
            : "bg-gradient-to-r from-green-100 to-green-50"
        }`}
      >

        <div className="flex items-center gap-2 mb-2">

          <div className="text-2xl">
            {msg.sender === "ai" ? "🤖" : "👤"}
          </div>

          <p className="font-bold text-gray-700">
            {msg.sender === "ai"
              ? "AI Interviewer"
              : "You"}
          </p>

        </div>

        <p className="text-gray-800 leading-7">
          {msg.text}
        </p>

      </div>

    </div>

  ))}

</div>
<textarea
  className="w-full max-w-4xl border-2 border-gray-200 rounded-2xl p-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
  rows="5"
  placeholder="Type your answer..."
  value={answer}
  onChange={(e) => setAnswer(e.target.value)}
/>
<div className="flex flex-wrap justify-center items-center gap-4 mt-6">

<button
  onClick={startListening}
  disabled={interviewCompleted}
  className={`w-48 px-6 py-3 rounded-xl shadow-lg transition ${
    interviewCompleted
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
>
  {isListening ? (
    <span className="animate-pulse">🔴 Listening...</span>
  ) : (
    "🎤 Start Speaking"
  )}
</button>

<button
  onClick={stopListening}
  disabled={interviewCompleted}
  className={`w-48 px-6 py-3 rounded-xl shadow-lg transition ${
    interviewCompleted
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-gray-600 hover:bg-gray-700 text-white"
  }`}
>
  ⏹ Stop
</button>

<button
  onClick={handleSendAnswer}
  disabled={interviewCompleted}
  className={`w-48 px-6 py-3 rounded-xl shadow-lg transition ${
    interviewCompleted
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-green-600 hover:bg-green-700 text-white"
  }`}
>
  📤 Send
</button>
<button
  onClick={handleEndInterview}
className="w-48 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg transition"  >
  🛑 End Interview
</button>

</div>
      </div>
      {interviewCompleted && (
  <div className="mt-8 p-6 bg-green-100 border border-green-300 rounded-xl text-center">
    <h2 className="text-2xl font-bold text-green-700">
      🎉 Interview Completed!
    </h2>

    <p className="mt-2 text-gray-700">
      Your interview has been completed successfully.
      Review your feedback below.
    </p>
  </div>
)}

{/* Loading Overlay */}
{loading && <LoadingOverlay />}

{feedback && (
  <FeedbackDashboard
    feedback={feedback}
    interviewData={interviewData}
    grade={grade}
    downloadReport={downloadReport}
  />
)}
 </div>
  );

}

export default Interview;