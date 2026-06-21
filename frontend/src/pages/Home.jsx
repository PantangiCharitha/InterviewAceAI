import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold text-blue-600">
        InterviewAce AI
      </h1>

      <p className="mt-4 text-gray-600 text-lg">
        Practice interviews with AI and improve your skills
      </p>

      <button
        onClick={() => navigate("/setup")}
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Start Interview
      </button>
    </div>
  );
}

export default Home;