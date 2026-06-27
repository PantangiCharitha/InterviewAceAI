import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

function History() {

  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const savedHistory =
      JSON.parse(localStorage.getItem("interviewHistory")) || [];

    setHistory(savedHistory);

  }, []);

  const deleteInterview = (index) => {

    const updatedHistory = history.filter(
      (_, i) => i !== index
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      "interviewHistory",
      JSON.stringify(updatedHistory)
    );

  };

  const clearHistory = () => {

    if (!window.confirm("Clear entire interview history?"))
      return;

    localStorage.removeItem("interviewHistory");

    setHistory([]);

  };
    return (
<PageWrapper>
    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-bold text-indigo-700">
              📚 Interview History
            </h1>

            <p className="text-gray-500 mt-2">
              View all your previous interview reports.
            </p>

          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
            >
              🗑 Clear History
            </button>
          )}

        </div>

        {history.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

            <h2 className="text-3xl font-bold text-gray-700">
              No Interview History
            </h2>

            <p className="text-gray-500 mt-4">
              Complete an interview to see it here.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-8">

            {history.map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl p-8"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h2 className="text-2xl font-bold text-indigo-700">
                      {item.role}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {item.interviewType}
                    </p>

                    <p className="text-sm text-gray-400 mt-3">
                      📅 {item.date}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm text-gray-500">
                      Grade
                    </p>

                    <p className="text-3xl font-bold text-green-600">
                      {item.finalFeedback?.grade}
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">

                  <div className="bg-blue-50 rounded-xl p-4">

                    <p className="font-semibold">
                      Overall Score
                    </p>

                    <p className="text-3xl mt-2">
                      {item.finalFeedback?.overallScore}/10
                    </p>

                  </div>

                  <div className="bg-green-50 rounded-xl p-4">

                    <p className="font-semibold">
                      Recommendation
                    </p>

                    <p className="mt-2">
                      {item.finalFeedback?.recommendation}
                    </p>

                  </div>

                </div>

                <div className="flex gap-4 mt-8">

                  <button
                    onClick={() =>
                      navigate("/final-feedback", {
                        state: item,
                      })
                    }
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
                  >
                    👁 View
                  </button>

                  <button
                    onClick={() => deleteInterview(index)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
</PageWrapper>
);

}

export default History;