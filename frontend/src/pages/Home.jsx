import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

function Home() {

  const navigate = useNavigate();
  const { user } = useAuth();

const handleLogout = async () => {
  await signOut(auth);
  navigate("/login");
};

  const history =
    JSON.parse(localStorage.getItem("interviewHistory")) || [];

  const totalInterviews = history.length;

  const averageScore =
    history.length > 0
      ? (
          history.reduce(
            (sum, item) =>
              sum + (item.finalFeedback?.overallScore || 0),
            0
          ) / history.length
        ).toFixed(1)
      : "0";

  const codingAverage =
    history.length > 0
      ? (
          history.reduce((sum, item) => {

            const coding =
              item.codingResults || [];

            if (coding.length === 0) return sum;

            const avg =
              coding.reduce(
                (s, c) =>
                  s +
                  (c.evaluation?.overallScore || 0),
                0
              ) / coding.length;

            return sum + avg;

          }, 0) / history.length
        ).toFixed(1)
      : "0";

  const highestGrade =
    history.length > 0
      ? history
          .map((item) => item.finalFeedback?.grade)
          .sort()[0]
      : "-";

  const hireCount =
    history.filter((item) =>
      item.finalFeedback?.recommendation
        ?.toLowerCase()
        .includes("hire")
    ).length;

  const hireRate =
    totalInterviews > 0
      ? Math.round(
          (hireCount / totalInterviews) * 100
        )
      : 0;

  const recentInterviews =
    history.slice(0, 3);

  return (

<motion.div

initial={{ opacity: 0 }}

animate={{ opacity: 1 }}

transition={{ duration: 0.6 }}

className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 overflow-x-hidden"

>

{/* Floating Background */}

<div className="absolute inset-0 overflow-hidden -z-10">

<motion.div

animate={{

y: [0, -40, 0],

x: [0, 30, 0],

}}

transition={{

repeat: Infinity,

duration: 12,

}}

className="absolute w-96 h-96 rounded-full bg-indigo-200 blur-3xl opacity-30 top-20 left-20"

/>

<motion.div

animate={{

y: [0, 40, 0],

x: [0, -40, 0],

}}

transition={{

repeat: Infinity,

duration: 14,

}}

className="absolute w-[500px] h-[500px] rounded-full bg-blue-200 blur-3xl opacity-30 bottom-0 right-0"

/>

</div>

<div className="max-w-7xl mx-auto px-6 py-12">
  <div className="flex justify-end mb-8">

  <button
    onClick={handleLogout}
    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
  >
    🚪 Logout
  </button>

</div>


<motion.div

initial={{ y: -40, opacity: 0 }}

animate={{ y: 0, opacity: 1 }}

transition={{ duration: 0.6 }}

className="text-center"

>

<h1 className="text-7xl font-extrabold bg-gradient-to-r from-indigo-700 via-blue-600 to-purple-600 bg-clip-text text-transparent">

🎯 InterviewAce AI

</h1>
<p className="mt-4 text-2xl text-gray-700">

  👋 Welcome,

  <span className="font-bold text-indigo-700">

    {user?.displayName || user?.email}

  </span>

</p>

<p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-9">

Practice AI-powered interviews, solve coding challenges,

receive detailed feedback and generate professional reports

to crack your dream job.

</p>

<div className="flex flex-wrap justify-center gap-6 mt-12">

<motion.button

whileHover={{ scale: 1.05 }}

whileTap={{ scale: 0.95 }}

onClick={() => navigate("/setup")}

className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl shadow-xl"

>

🚀 Start Interview

</motion.button>

<motion.button

whileHover={{ scale: 1.05 }}

whileTap={{ scale: 0.95 }}

onClick={() => navigate("/history")}

className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl shadow-xl"

>

📚 Interview History

</motion.button>

</div>

</motion.div>


{/* Dashboard Stats */}

<div className="grid md:grid-cols-5 gap-6 mt-20">
        {[
        {
          title: "Total Interviews",
          value: totalInterviews,
          color: "text-indigo-700",
          icon: "📚",
        },
        {
          title: "Average Score",
          value: averageScore,
          color: "text-green-600",
          icon: "⭐",
        },
        {
          title: "Coding Avg",
          value: codingAverage,
          color: "text-red-600",
          icon: "💻",
        },
        {
          title: "Highest Grade",
          value: highestGrade,
          color: "text-yellow-500",
          icon: "🏆",
        },
        {
          title: "Hire Rate",
          value: `${hireRate}%`,
          color: "text-blue-600",
          icon: "🎯",
        },
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.5,
          }}
          whileHover={{
            y: -10,
            scale: 1.03,
          }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 text-center border border-white"
        >
          <div className="text-5xl">
            {stat.icon}
          </div>

          <h3 className="mt-4 text-gray-500 font-semibold">
            {stat.title}
          </h3>

          <p className={`text-5xl mt-4 font-bold ${stat.color}`}>
            {stat.value}
          </p>
        </motion.div>
      ))}

    </div>

    {/* Recent Interviews */}

    <div className="mt-20">

      <h2 className="text-4xl font-bold text-indigo-700 mb-10">
        🕒 Recent Interviews
      </h2>

      {recentInterviews.length === 0 ? (

        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">

          <p className="text-xl text-gray-500">
            No interviews completed yet.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-3 gap-8">

          {recentInterviews.map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
              }}
              whileHover={{
                y: -8,
              }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >

              <h2 className="text-2xl font-bold text-indigo-700">
                {item.role}
              </h2>

              <p className="text-gray-500 mt-2">
                {item.interviewType}
              </p>

              <div className="mt-6 space-y-3">

                <p>
                  ⭐ Score :
                  <span className="font-bold ml-2">
                    {item.finalFeedback?.overallScore}/10
                  </span>
                </p>

                <p>
                  🏆 Grade :
                  <span className="font-bold ml-2">
                    {item.finalFeedback?.grade}
                  </span>
                </p>

                <p className="text-sm text-gray-400">
                  📅 {item.date}
                </p>

              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  navigate("/final-feedback", {
                    state: item,
                  })
                }
                className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
              >
                👁 View Report
              </motion.button>

            </motion.div>

          ))}

        </div>

      )}

    </div>

    {/* Features */}

    <div className="grid md:grid-cols-3 gap-8 mt-24">

      {[
        {
          icon: "🤖",
          title: "AI Interviewer",
          text: "Experience realistic HR and Technical interviews powered by AI.",
        },
        {
          icon: "📊",
          title: "Smart Feedback",
          text: "Receive communication, coding and technical evaluation instantly.",
        },
        {
          icon: "📄",
          title: "Professional Reports",
          text: "Download polished PDF reports and review your interview history anytime.",
        },
      ].map((feature, index) => (

        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.2,
          }}
          whileHover={{
            y: -10,
            scale: 1.03,
          }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 text-center border border-white"
        >

          <div className="text-6xl">
            {feature.icon}
          </div>

          <h2 className="text-2xl font-bold mt-6">
            {feature.title}
          </h2>

          <p className="mt-5 text-gray-600 leading-8">
            {feature.text}
          </p>

        </motion.div>

      ))}

    </div>

  </div>

</motion.div>

  );

}

export default Home;