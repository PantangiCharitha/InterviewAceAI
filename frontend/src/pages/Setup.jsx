import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InterviewContext } from "../context/InterviewContext";
function Setup() {
  const navigate = useNavigate();

  const {
  role,
  setRole,
  interviewType,
  setInterviewType,
} = useContext(InterviewContext);
  const startInterview = () => {
    if (!role || !interviewType) {
      alert("Please select role and interview type");
      return;
    }

    navigate("/interview");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[500px]">
        <h1 className="text-3xl font-bold mb-6">
          Setup Interview
        </h1>

        <label className="block mb-2 font-semibold">
          Select Role
        </label>

        <select
          className="w-full border p-3 rounded-lg mb-5"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Choose Role</option>
          <option>Java Developer</option>
          <option>Frontend Developer</option>
          <option>Full Stack Developer</option>
          <option>UI/UX Designer</option>
        </select>

        <label className="block mb-2 font-semibold">
          Interview Type
        </label>

        <select
          className="w-full border p-3 rounded-lg mb-6"
          value={interviewType}
          onChange={(e) => setInterviewType(e.target.value)}
        >
          <option value="">Choose Type</option>
          <option>HR</option>
          <option>Technical</option>
          <option>Mixed</option>
        </select>

        <button
          onClick={startInterview}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Start AI Interview
        </button>
      </div>
    </div>
  );
}

export default Setup;