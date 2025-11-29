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
  Filler
} from "chart.js";
import { getVolumeHistory } from "../services/api";
import Header from "../components/Header";

// register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = ({ username, isAdmin, setIsAuthed, setUsername }) => {
  const [sessions, setSessions] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [view, setView] = useState("weekly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getVolumeHistory();
        setSessions(res.data);
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
      const date = new Date(s.date);
      const vol = s.volume || 0;

      let key;

      if (range === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().slice(0, 10);
      } 
      
      else if (range === "monthly") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      } 
      
      else if (range === "ytd") {
        if (date.getFullYear() !== now.getFullYear()) continue;
        key = `${date.getMonth() + 1}`;
      } 
      
      else {
        // ALL
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      grouped[key] = (grouped[key] || 0) + vol;
    }

    return Object.fromEntries(Object.entries(grouped).sort());
  };

  // Calculate stats
  const totalSessions = sessions.length;
  const totalVolume = sessions.reduce((sum, s) => sum + (s.volume || 0), 0);
  const avgVolume = totalSessions > 0 ? Math.round(totalVolume / totalSessions) : 0;
  const maxVolume = sessions.length > 0 ? Math.max(...sessions.map(s => s.volume || 0)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header
        username={username}
        isAdmin={isAdmin}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />  
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Workout Analytics
          </h1>
          <p className="text-gray-600">Track your progress and volume over time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
            <p className="text-2xl font-bold text-gray-800">{totalSessions}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Total Volume</p>
            <p className="text-2xl font-bold text-gray-800">{totalVolume.toLocaleString()} lbs</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 mb-1">Avg Volume</p>
            <p className="text-2xl font-bold text-gray-800">{avgVolume.toLocaleString()} lbs</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-1">Max Volume</p>
            <p className="text-2xl font-bold text-gray-800">{maxVolume.toLocaleString()} lbs</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Toggle Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {["weekly", "monthly", "ytd", "all"].map((r) => (
              <button
                key={r}
                onClick={() => setView(r)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  view === r
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Chart Container - Controlled Height */}
          <div className="w-full" style={{ height: '400px' }}>
            {chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      display: true,
                      position: 'top',
                      labels: {
                        font: { size: 14, weight: 'bold' },
                        color: '#374151'
                      }
                    },
                    title: { 
                      display: true, 
                      text: "Workout Volume Over Time", 
                      font: { size: 20, weight: 'bold' },
                      color: '#1f2937',
                      padding: 20
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      padding: 12,
                      titleFont: { size: 14, weight: 'bold' },
                      bodyFont: { size: 13 },
                      callbacks: {
                        label: function(context) {
                          return `Volume: ${context.parsed.y.toLocaleString()} lbs`;
                        }
                      }
                    }
                  },
                  scales: {
                    x: { 
                      grid: { 
                        color: "rgba(0,0,0,0.05)",
                        drawBorder: false
                      },
                      ticks: {
                        font: { size: 12 },
                        color: '#6b7280'
                      }
                    },
                    y: { 
                      beginAtZero: true, 
                      grid: { 
                        color: "rgba(0,0,0,0.05)",
                        drawBorder: false
                      },
                      ticks: {
                        font: { size: 12 },
                        color: '#6b7280',
                        callback: function(value) {
                          return value.toLocaleString() + ' lbs';
                        }
                      }
                    },
                  },
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading chart...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {sessions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center mt-8">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Workout Data Yet</h3>
            <p className="text-gray-600 mb-6">Start logging your workouts to see your progress!</p>
            <button
              onClick={() => window.location.href = '/workout'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
            >
              Start Your First Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
