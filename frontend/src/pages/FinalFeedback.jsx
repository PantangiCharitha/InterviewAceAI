
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { generateInterviewReport } from "../utils/pdfReport";
import PageWrapper from "../components/PageWrapper";

function FinalFeedback() {

  const { state } = useLocation();

  if (!state) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl font-bold">
          No feedback available.
        </h1>
      </div>
    );
  }

  const {
    interviewFeedback,
    codingResults = [],
    finalFeedback,
  } = state;

  const codingScore =
    codingResults.length > 0
      ? (
          codingResults.reduce(
            (sum, item) =>
              sum + (item.evaluation?.overallScore || 0),
            0
          ) / codingResults.length
        ).toFixed(1)
      : "0";

  const saveInterviewHistory = () => {

    const alreadySaved =
      sessionStorage.getItem("savedInterview");

    if (alreadySaved) return;

    const history =
      JSON.parse(
        localStorage.getItem("interviewHistory")
      ) || [];

    history.unshift({

      role: state.role,

      interviewType: state.interviewType,

      date: new Date().toLocaleString(),

      interviewFeedback,

      codingResults,

      finalFeedback,

      interviewData: state.interviewData,

    });

    localStorage.setItem(
      "interviewHistory",
      JSON.stringify(history)
    );

    sessionStorage.setItem(
      "savedInterview",
      "true"
    );

  };

  useEffect(() => {

    saveInterviewHistory();

  }, []);

  const downloadReport = () => {

    generateInterviewReport({

      role: state.role,

      interviewType: state.interviewType,

      interviewFeedback,

      interviewData: state.interviewData,

      codingResults,

      finalFeedback,

    });

  };
  return (
<PageWrapper>
    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold text-center text-indigo-700">
          🎉 InterviewAce AI Report
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">

          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <h2 className="font-bold">Communication</h2>
            <p className="text-4xl mt-3">
              {interviewFeedback.communicationScore}/10
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow">
            <h2 className="font-bold">Technical</h2>
            <p className="text-4xl mt-3">
              {interviewFeedback.technicalScore}/10
            </p>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl shadow">
            <h2 className="font-bold">Confidence</h2>
            <p className="text-4xl mt-3">
              {interviewFeedback.confidenceScore}/10
            </p>
          </div>

          <div className="bg-red-50 p-6 rounded-xl shadow">
            <h2 className="font-bold">Coding</h2>
            <p className="text-4xl mt-3">
              {codingScore}/10
            </p>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl shadow md:col-span-2">
            <h2 className="font-bold">Overall</h2>
            <p className="text-4xl mt-3">
              {finalFeedback.overallScore}/10
            </p>
          </div>

        </div>

        <div className="mt-10">

          <h2 className="text-2xl font-bold">
            Grade
          </h2>

          <p className="text-6xl text-green-600 mt-3 font-bold">
            {finalFeedback.grade}
          </p>

        </div>

        <div className="mt-10">

          <h2 className="text-2xl font-bold">
            Recommendation
          </h2>

          <p className="mt-3 text-xl">
            {finalFeedback.recommendation}
          </p>

        </div>

        <div className="mt-10">

          <h2 className="text-2xl font-bold">
            Strengths
          </h2>

          <ul className="list-disc ml-6 mt-4 space-y-2">
            {(finalFeedback.strengths || []).map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>

        </div>

        <div className="mt-10">

          <h2 className="text-2xl font-bold">
            Areas for Improvement
          </h2>

          <ul className="list-disc ml-6 mt-4 space-y-2">
            {(finalFeedback.improvements || []).map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>

        </div>

        <div className="mt-10">

          <h2 className="text-2xl font-bold">
            AI Summary
          </h2>

          <p className="mt-4 leading-8 text-gray-700">
            {finalFeedback.summary}
          </p>

        </div>

        <div className="mt-12 flex justify-center">

          <button
            onClick={downloadReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg transition"
          >
            📄 Download Report
          </button>

        </div>

      </div>

    </div>
</PageWrapper>
);
}

export default FinalFeedback;