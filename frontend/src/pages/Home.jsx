import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex flex-col justify-center items-center px-6">

      <h1 className="text-6xl font-extrabold text-indigo-700">
        🎯 InterviewAce AI
      </h1>

      <p className="mt-5 text-xl text-gray-600 text-center max-w-2xl">
        Practice AI-powered mock interviews, receive detailed feedback,
        download professional reports, and track your interview history.
      </p>

      <div className="flex flex-col md:flex-row gap-6 mt-12">

        <button
          onClick={() => navigate("/setup")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-4 rounded-2xl shadow-lg transition"
        >
          🚀 Start Interview
        </button>

        <button
          onClick={() => navigate("/history")}
          className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-2xl shadow-lg transition"
        >
          📚 Interview History
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-6xl w-full">

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

          <div className="text-5xl mb-4">🤖</div>

          <h2 className="text-xl font-bold mb-3">
            AI Interviewer
          </h2>

          <p className="text-gray-600">
            Experience realistic HR and technical interviews powered by AI.
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

          <div className="text-5xl mb-4">📊</div>

          <h2 className="text-xl font-bold mb-3">
            Smart Feedback
          </h2>

          <p className="text-gray-600">
            Receive communication, technical, and confidence scores with detailed suggestions.
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

          <div className="text-5xl mb-4">📄</div>

          <h2 className="text-xl font-bold mb-3">
            Professional Reports
          </h2>

          <p className="text-gray-600">
            Download beautifully formatted PDF reports and review previous interviews anytime.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Home;