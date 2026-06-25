import {
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { InterviewContext } from "../context/InterviewContext";
import API from "../services/api";

function Interview() {
  const { role, interviewType } = useContext(InterviewContext);

const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");

const [messages, setMessages] = useState([]);

const [loading, setLoading] = useState(false);

const [questionCount, setQuestionCount] = useState(1);

const [seconds, setSeconds] = useState(0);

const [isListening, setIsListening] = useState(false);

const [feedback, setFeedback] = useState(null);

const [interviewData, setInterviewData] = useState([]);
const totalQuestions = 10;

const progress =
  (questionCount / totalQuestions) * 100;
const recognitionRef = useRef(null);
const transcriptRef = useRef("");
  useEffect(() => {
    fetchQuestion();
  }, []);
  useEffect(() => {
  const timer = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(timer);
}, []);
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
    const response = await API.post("/api/next-question", {
      role,
      interviewType,
      currentQuestion: question,
      answer,
    });
    setInterviewData((prev) => [
  ...prev,
  {
    question,
    answer,
  },
]);

    setMessages((prev) => [
  ...prev,
  {
    sender: "user",
    text: answer,
  },
  {
    sender: "ai",
    text: response.data.question,
  },
]);

setQuestion(response.data.question);
setAnswer("");
transcriptRef.current = "";
  } catch (error) {
    console.error(error);
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

    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
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

      <span>
        Question {questionCount} / 10
      </span>

      <span>
        {Math.round(progress)}%
      </span>

    </div>

    <div className="w-full bg-gray-200 rounded-full h-3">

      <div
        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
        style={{
          width: `${progress}%`,
        }}
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
className=" w-48 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition">
 {isListening ? (
  <span className="animate-pulse">
    🔴 Listening...
  </span>
) : (
  "🎤 Start Speaking"
)}
</button>

<button
  onClick={stopListening}
className="w-48 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl shadow-lg transition">
  ⏹ Stop
</button>

<button
  onClick={handleSendAnswer}
className="w-48 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition"  >
📤 Send
</button>
<button
  onClick={handleEndInterview}
className="w-48 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg transition"  >
  🛑 End Interview
</button>

</div>
      </div>
      {feedback && (
  <div className="mt-8 w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8">

    <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
      📊 Interview Report
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      <div className="bg-blue-100 rounded-xl p-6 text-center">
        <h3 className="font-bold">Communication</h3>
        <p className="text-4xl mt-2">
          {feedback.communicationScore}/10
        </p>
      </div>

      <div className="bg-green-100 rounded-xl p-6 text-center">
        <h3 className="font-bold">Technical</h3>
        <p className="text-4xl mt-2">
          {feedback.technicalScore}/10
        </p>
      </div>

      <div className="bg-yellow-100 rounded-xl p-6 text-center">
        <h3 className="font-bold">Confidence</h3>
        <p className="text-4xl mt-2">
          {feedback.confidenceScore}/10
        </p>
      </div>

    </div>

    <div className="mb-6">

      <h3 className="text-xl font-bold text-green-700 mb-2">
        💪 Strengths
      </h3>

      <ul className="list-disc ml-6">

        {feedback.strengths.map((item, index) => (
          <li key={index}>{item}</li>
        ))}

      </ul>

    </div>

    <div className="mb-6">

      <h3 className="text-xl font-bold text-red-700 mb-2">
        📈 Areas for Improvement
      </h3>

      <ul className="list-disc ml-6">

        {feedback.improvements.map((item, index) => (
          <li key={index}>{item}</li>
        ))}

      </ul>

    </div>

    <div className="bg-indigo-50 rounded-xl p-6">

      <h3 className="text-xl font-bold mb-2">
        ⭐ Recommendation
      </h3>

      <p className="text-lg">
        {feedback.recommendation}
      </p>

      <h3 className="text-xl font-bold mt-6 mb-2">
        📝 Overall Feedback
      </h3>

      <p>
        {feedback.overallFeedback}
      </p>

    </div>

  </div>
)}

    </div>
  );
}

export default Interview;