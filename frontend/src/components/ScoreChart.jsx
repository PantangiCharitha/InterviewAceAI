import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

function ScoreChart({ feedback }) {
  const data = [
    {
      name: "Communication",
      score: feedback.communicationScore,
    },
    {
      name: "Technical",
      score: feedback.technicalScore,
    },
    {
      name: "Confidence",
      score: feedback.confidenceScore,
    },
  ];

  const colors = [
    "#2563EB",
    "#16A34A",
    "#F59E0B",
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">

      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        📊 Performance Analysis
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis domain={[0, 10]} />

          <Tooltip />

          <Bar dataKey="score" radius={[10, 10, 0, 0]}>

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={colors[index]}
              />
            ))}

          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default ScoreChart;