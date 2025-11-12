import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getWorkoutSessions } from "../services/api";

// register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import Header from "../components/Header";

const Analytics = ({ username, setIsAuthed, setUsername }) => {
  const [sessions, setSessions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [view, setView] = useState("weekly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkoutSessions(); // should return array of sessions
        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      setChartData(getChartData(view, sessions));
    }
  }, [sessions, view]);

  const getChartData = (range, sessions) => {
    const grouped = groupSessionsByRange(sessions, range);
    const labels = Object.keys(grouped);
    const values = Object.values(grouped);

    return {
      labels,
      datasets: [
        {
          label: "Total Volume",
          data: values,
          borderColor: "rgb(75,192,192)",
          backgroundColor: "rgba(75,192,192,0.2)",
          tension: 0.3,
          fill: true,
          pointRadius: 4,
        },
      ],
    };
  };

  const groupSessionsByRange = (sessions, range) => {
    const grouped = {};
    const now = new Date();

    for (const s of sessions) {
      const date = new Date(s.date || s.created_at);
      const vol = s.tot_vol || 0;

      let key;
      if (range === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().slice(0, 10);
      } else if (range === "monthly") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      } else if (range === "ytd") {
        if (date.getFullYear() !== now.getFullYear()) continue;
        key = `${date.getMonth() + 1}`;
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      grouped[key] = (grouped[key] || 0) + vol;
    }

    // sort by date
    return Object.fromEntries(Object.entries(grouped).sort());
  };

  return (
    <div>
        <Header
        username={username}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
        />  
        <div className="flex flex-col items-center px-6 py-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Analytics Dashboard</h1>

        {/* Toggle Buttons */}
        <div className="flex gap-3 mb-8">
            {["weekly", "monthly", "ytd", "all"].map((r) => (
            <button
                key={r}
                onClick={() => setView(r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                view === r
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
            >
                {r.toUpperCase()}
            </button>
            ))}
        </div>

        {/* Chart */}
        <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md">
            {chartData ? (
            <Line
                data={chartData}
                options={{
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: "Workout Volume Over Time", font: { size: 18 } },
                },
                scales: {
                    x: { grid: { color: "rgba(0,0,0,0.05)" } },
                    y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
                },
                }}
            />
            ) : (
            <p className="text-gray-500 text-center">Loading chart...</p>
            )}
        </div>
        </div>
    </div>
  );
};

export default Analytics;
