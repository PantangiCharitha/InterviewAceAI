import { useContext, useEffect, useState } from "react";
import { InterviewContext } from "../context/InterviewContext";
import API from "../services/api";

function Interview() {
  const { role, interviewType } =
    useContext(InterviewContext);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
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
]);    } catch (error) {
      console.error(error);
    }
  };
  const handleSendAnswer = async () => {
  try {
    const response = await API.post("/api/next-question", {
      role,
      interviewType,
      currentQuestion: question,
      answer,
    });

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
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">
        Interview Page
      </h1>

      <p className="mt-4">
        Role: {role}
      </p>

      <p>
        Type: {interviewType}
      </p>

      <div className="mt-6 p-4 bg-white shadow rounded-lg">
        <h2 className="font-semibold">
          AI Question
        </h2>

        <div className="w-full max-w-2xl mb-4">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`p-3 rounded-lg mb-2 ${
        msg.sender === "ai"
          ? "bg-blue-100"
          : "bg-green-100"
      }`}
    >
      <strong>
        {msg.sender === "ai" ? "AI" : "You"}:
      </strong>{" "}
      {msg.text}
    </div>
  ))}
</div>
<textarea
  className="w-full max-w-2xl border p-3 rounded-lg"
  rows="5"
  placeholder="Type your answer..."
  value={answer}
  onChange={(e) => setAnswer(e.target.value)}
/>
<button
  onClick={handleSendAnswer}
  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg"
>
  Send Answer
</button>
      </div>
    </div>
  );
}

export default Interview;