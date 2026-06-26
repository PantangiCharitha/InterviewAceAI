import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { InterviewContext } from "../context/InterviewContext";

function Setup() {
  const navigate = useNavigate();

  const {
    role,
    setRole,
    interviewType,
    setInterviewType,
    company,
    setCompany,
    resumeFile,
    setResumeFile,
    resumeData,
    setResumeData,
  } = useContext(InterviewContext);

  const [uploading, setUploading] = useState(false);

  const uploadResume = async () => {
    if (!resumeFile) {
      alert("Please choose a resume first.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("resume", resumeFile);

      const response = await API.post(
        "/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResumeData(response.data.resume);

      alert("✅ Resume uploaded successfully!");

      console.log(response.data.resume);

      setUploading(false);
    } catch (error) {
      console.error(error);

      alert("Resume upload failed.");

      setUploading(false);
    }
  };

  const startInterview = () => {
    if (!role || !interviewType || !company) {
      alert("Please complete all fields.");
      return;
    }

    if (!resumeData) {
      alert("Please upload your resume first.");
      return;
    }

    navigate("/interview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex justify-center items-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-[650px]">

        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">
          🚀 Interview Setup
        </h1>

        {/* Role */}

        <label className="font-semibold">
          Select Role
        </label>

        <select
          className="w-full border rounded-xl p-3 mt-2 mb-6"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Choose Role</option>
          <option>Java Developer</option>
          <option>Frontend Developer</option>
          <option>Full Stack Developer</option>
          <option>UI/UX Designer</option>
        </select>

        {/* Interview Type */}

        <label className="font-semibold">
          Interview Type
        </label>

        <select
          className="w-full border rounded-xl p-3 mt-2 mb-6"
          value={interviewType}
          onChange={(e) => setInterviewType(e.target.value)}
        >
          <option value="">Choose Type</option>
          <option>HR</option>
          <option>Technical</option>
          <option>Mixed</option>
        </select>

        {/* Company */}

        <label className="font-semibold">
          Company
        </label>

        <select
          className="w-full border rounded-xl p-3 mt-2 mb-6"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        >
          <option value="">Choose Company</option>

          <option>Microsoft</option>

          <option>Google</option>

          <option>Amazon</option>

          <option>Cognizant</option>

          <option>TCS</option>

          <option>Infosys</option>

          <option>Accenture</option>

          <option>Capgemini</option>

          <option>Deloitte</option>

          <option>Wipro</option>
        </select>
                {/* Resume Upload */}

        <label className="font-semibold">
          Upload Resume (PDF / DOCX)
        </label>

        <input
  type="file"
  accept=".pdf,.doc,.docx"
  className="w-full border rounded-xl p-3 mt-2 mb-4"
  onChange={(e) => {
    const file = e.target.files[0];

    console.log("Selected File:", file);

    setResumeFile(file);
  }}
/>

        {resumeFile && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <p className="text-green-700 font-medium">
              📄 {resumeFile.name}
            </p>
          </div>
        )}

        <button
          onClick={uploadResume}
          disabled={uploading}
          className={`w-full py-3 rounded-xl text-white font-semibold mb-6 transition ${
            uploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {uploading ? "Uploading Resume..." : "☁ Upload Resume"}
        </button>

        {resumeData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">

            <h2 className="text-lg font-bold text-blue-700 mb-3">
              ✅ Resume Parsed Successfully
            </h2>

            <p>
              <strong>Name:</strong> {resumeData.name}
            </p>

            <p className="mt-2">
              <strong>Skills:</strong>{" "}
              {resumeData.skills?.join(", ")}
            </p>

            <p className="mt-2">
              <strong>Projects Found:</strong>{" "}
              {resumeData.projects?.length || 0}
            </p>

          </div>
        )}

        <button
          onClick={startInterview}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-lg font-bold transition"
        >
          🚀 Start AI Interview
        </button>

      </div>

    </div>
  );
}

export default Setup;