import React from "react";
import ScoreChart from "./ScoreChart";
function FeedbackDashboard({
  feedback,
  interviewData,
  grade,
  downloadReport,
}) {
  return (
    <div className="mt-10 w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10">

      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
        📊 Interview Assessment Report
      </h1>

      {/* Score Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">💬</div>

          <h2 className="text-xl font-bold">
            Communication
          </h2>

          <p className="text-5xl font-black text-blue-700 mt-5">
            {feedback.communicationScore}/10
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-3xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">💻</div>

          <h2 className="text-xl font-bold">
            Technical
          </h2>

          <p className="text-5xl font-black text-green-700 mt-5">
            {feedback.technicalScore}/10
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-3xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">🚀</div>

          <h2 className="text-xl font-bold">
            Confidence
          </h2>

          <p className="text-5xl font-black text-yellow-700 mt-5">
            {feedback.confidenceScore}/10
          </p>
        </div>

      </div>

      {/* Grade */}

      <div className="bg-indigo-50 rounded-3xl shadow-lg p-10 text-center mb-10">

        <h2 className="text-3xl font-bold">
          ⭐ Overall Grade
        </h2>

        <div className="text-8xl font-black text-indigo-700 mt-5">
          {grade}
        </div>

      </div>

      {/* Recommendation */}

      <div className="rounded-3xl bg-green-50 shadow-lg p-8 mb-10">

        <h2 className="text-2xl font-bold mb-4">
          💼 Hiring Recommendation
        </h2>

        <div
          className={`text-3xl font-bold ${
            feedback.recommendation
              ?.toLowerCase()
              .includes("hire")
                ? "text-green-600"
                : "text-red-600"
          }`}
        >
          {feedback.recommendation}
        </div>

      </div>

      {/* Strengths + Improvements */}

      <div className="grid md:grid-cols-2 gap-8 mb-10">

        <div className="bg-green-50 rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-5">
            💪 Strengths
          </h2>

          <ul className="space-y-3">

            {feedback.strengths.map((item, index) => (
              <li key={index}>
                ✅ {item}
              </li>
            ))}

          </ul>

        </div>

        <div className="bg-red-50 rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-5">
            📈 Areas for Improvement
          </h2>

          <ul className="space-y-3">

            {feedback.improvements.map((item, index) => (
              <li key={index}>
                🔸 {item}
              </li>
            ))}

          </ul>

        </div>

      </div>

      {/* Overall Feedback */}

      <div className="bg-slate-50 rounded-3xl shadow-lg p-8 mb-10">

        <h2 className="text-2xl font-bold mb-4">
          📝 Overall Feedback
        </h2>

        <p className="leading-8 text-gray-700">
          {feedback.overallFeedback}
        </p>

      </div>
      
      <ScoreChart feedback={feedback} />

      {/* Transcript */}

      <div className="bg-gray-50 rounded-3xl shadow-lg p-8 mb-10">

        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          📜 Interview Transcript
        </h2>

        {interviewData.map((item, index) => (

          <div
            key={index}
            className="bg-white rounded-2xl shadow p-6 mb-5"
          >

            <h3 className="font-bold text-blue-700">
              Question {index + 1}
            </h3>

            <p className="mt-3">
              {item.question}
            </p>

            <h3 className="font-bold text-green-700 mt-5">
              Your Answer
            </h3>

            <p className="mt-3">
              {item.answer}
            </p>

          </div>

        ))}

      </div>

      <div className="flex justify-center">

        <button
          onClick={downloadReport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl shadow-lg transition"
        >
          📄 Download Report
        </button>

      </div>

    </div>
  );
}

export default FeedbackDashboard;