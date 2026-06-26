import { useEffect, useState } from "react";

function History() {
  const [history, setHistory] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("interviewHistory")) || [];

    setHistory(savedHistory);
  }, []);

  const deleteInterview = (index) => {
    const updated = history.filter((_, i) => i !== index);

    setHistory(updated);

    localStorage.setItem(
      "interviewHistory",
      JSON.stringify(updated)
    );
  };

  const clearHistory = () => {
    if (
      !window.confirm(
        "Delete all interview history?"
      )
    )
      return;

    localStorage.removeItem("interviewHistory");

    setHistory([]);
  };

  const averageScore =
    history.length > 0
      ? (
          history.reduce((sum, item) => {
            return (
              sum +
              (
                item.feedback.communicationScore +
                item.feedback.technicalScore +
                item.feedback.confidenceScore
              ) /
                3
            );
          }, 0) / history.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-slate-100 p-10">

      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
        📚 Interview History
      </h1>

      {/* Dashboard */}

      <div className="grid md:grid-cols-3 gap-8 mb-10">

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

          <h2 className="text-xl font-bold">
            Total Interviews
          </h2>

          <div className="text-5xl font-black text-indigo-700 mt-4">
            {history.length}
          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

          <h2 className="text-xl font-bold">
            Average Score
          </h2>

          <div className="text-5xl font-black text-green-700 mt-4">
            {averageScore}
          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">

          <h2 className="text-xl font-bold">
            Best Grade
          </h2>

          <div className="text-5xl font-black text-yellow-600 mt-4">

            {history.length > 0
              ? history[0].grade
              : "-"}

          </div>

        </div>

      </div>

      <div className="flex justify-end mb-6">

        <button
          onClick={clearHistory}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
        >
          🗑 Clear History
        </button>

      </div>

      {history.length === 0 ? (

        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

          <h2 className="text-2xl font-bold">
            No Interviews Yet
          </h2>

          <p className="mt-4 text-gray-600">
            Complete an interview to see it here.
          </p>

        </div>

      ) : (

        history.map((item, index) => (

          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg p-8 mb-6"
          >

            <div className="flex justify-between items-center">

              <div>

                <h2 className="text-2xl font-bold">

                  {item.role}

                </h2>

                <p className="text-gray-500 mt-2">

                  {item.interviewType}

                </p>

                <p className="text-gray-500">

                  {item.date}

                </p>

              </div>

              <div className="text-center">

                <div className="text-5xl font-black text-indigo-700">

                  {item.grade}

                </div>

              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-5 mt-8">

              <div className="bg-blue-50 rounded-xl p-5">

                Communication

                <div className="text-3xl font-bold mt-2">

                  {item.feedback.communicationScore}/10

                </div>

              </div>

              <div className="bg-green-50 rounded-xl p-5">

                Technical

                <div className="text-3xl font-bold mt-2">

                  {item.feedback.technicalScore}/10

                </div>

              </div>

              <div className="bg-yellow-50 rounded-xl p-5">

                Confidence

                <div className="text-3xl font-bold mt-2">

                  {item.feedback.confidenceScore}/10

                </div>

              </div>

            </div>

            <div className="flex gap-4 mt-8">
                              <button
                onClick={() => setSelectedInterview(item)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl"
              >
                👁 View Report
              </button>

              <button
                onClick={() => deleteInterview(index)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
              >
                🗑 Delete
              </button>

            </div>

          </div>

        ))

      )}

      {/* View Report Modal */}

      {selectedInterview && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white rounded-3xl shadow-2xl p-8 w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-3xl font-bold text-indigo-700">
                📊 Interview Report
              </h2>

              <button
                onClick={() => setSelectedInterview(null)}
                className="text-red-600 font-bold text-xl"
              >
                ✖
              </button>

            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">

              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <h3 className="font-bold">Communication</h3>
                <div className="text-4xl font-black mt-3">
                  {selectedInterview.feedback.communicationScore}/10
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-5 text-center">
                <h3 className="font-bold">Technical</h3>
                <div className="text-4xl font-black mt-3">
                  {selectedInterview.feedback.technicalScore}/10
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-5 text-center">
                <h3 className="font-bold">Confidence</h3>
                <div className="text-4xl font-black mt-3">
                  {selectedInterview.feedback.confidenceScore}/10
                </div>
              </div>

            </div>

            <div className="mb-6">

              <h3 className="text-xl font-bold mb-3">
                ⭐ Grade
              </h3>

              <p className="text-5xl font-black text-indigo-700">
                {selectedInterview.grade}
              </p>

            </div>

            <div className="mb-6">

              <h3 className="text-xl font-bold mb-3">
                💼 Recommendation
              </h3>

              <p>
                {selectedInterview.feedback.recommendation}
              </p>

            </div>

            <div className="mb-6">

              <h3 className="text-xl font-bold mb-3">
                💪 Strengths
              </h3>

              <ul className="list-disc ml-6">

                {selectedInterview.feedback.strengths.map((item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                ))}

              </ul>

            </div>

            <div className="mb-6">

              <h3 className="text-xl font-bold mb-3">
                📈 Areas for Improvement
              </h3>

              <ul className="list-disc ml-6">

                {selectedInterview.feedback.improvements.map((item, index) => (

                  <li key={index}>
                    {item}
                  </li>

                ))}

              </ul>

            </div>

            <div>

              <h3 className="text-xl font-bold mb-3">
                📝 Overall Feedback
              </h3>

              <p className="leading-8">
                {selectedInterview.feedback.overallFeedback}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default History;
