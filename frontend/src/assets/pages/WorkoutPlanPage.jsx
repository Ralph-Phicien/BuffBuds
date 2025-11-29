import { useEffect, useState } from "react";
import { getWorkoutPlans } from "../services/api"; 
import { useNavigate } from "react-router-dom";
import Header from '../components/Header'
import { Dumbbell, Play, CheckCircle } from "lucide-react";

const WorkoutPlansPage = ({username, isAdmin, setIsAuthed, setUsername }) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getWorkoutPlans();
        setWorkoutPlans(response.data);
      } catch (err) {
        console.error("Error fetching workout plans:", err);
        setError(err.response?.data?.error || "Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header username={username} isAdmin={isAdmin} setIsAuthed={setIsAuthed} setUsername={setUsername} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading workout plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header username={username} isAdmin={isAdmin} setIsAuthed={setIsAuthed} setUsername={setUsername} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8">
            <p className="text-xl text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!workoutPlans.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header username={username} isAdmin={isAdmin} setIsAuthed={setIsAuthed} setUsername={setUsername} />
        <div className="flex flex-col items-center justify-center h-[80vh] px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
            <Dumbbell className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Workout Plans Yet</h2>
            <p className="text-gray-600 mb-6">Create your first workout plan to get started!</p>
            <button
              onClick={() => navigate('/create-workout')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg"
            >
              Create Your First Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header username={username} isAdmin={isAdmin} setIsAuthed={setIsAuthed} setUsername={setUsername} />
      
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[var(--hl)] to-[var(--bg)] bg-clip-text text-transparent mb-3">
            Your Workout Plans
          </h1>
          <p className="text-gray-600 text-lg">Select a plan to begin your workout session</p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {workoutPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 ${
                selectedPlan?.id === plan.id
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-4 ring-blue-300 scale-105'
                  : 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className={`text-xl font-bold mb-2 ${
                    selectedPlan?.id === plan.id ? 'text-white' : 'text-gray-800'
                  }`}>
                    {plan.plan_name}
                  </h2>
                  <p className={`text-sm line-clamp-2 ${
                    selectedPlan?.id === plan.id ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {plan.description || 'No description provided'}
                  </p>
                </div>
                {selectedPlan?.id === plan.id && (
                  <CheckCircle className="w-7 h-7 text-white flex-shrink-0 ml-2" />
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-opacity-20 border-gray-300">
                <div className={`flex items-center gap-2 text-sm font-semibold ${
                  selectedPlan?.id === plan.id ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  <Dumbbell className="w-5 h-5" />
                  <span>{plan.exercises?.length || 0} exercises</span>
                </div>
                {selectedPlan?.id === plan.id && (
                  <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full text-white font-semibold">
                    Selected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Plan Details */}
        {selectedPlan && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-t-4 border-blue-500">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b-2 border-gray-100">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">{selectedPlan.plan_name}</h2>
                <p className="text-gray-600">{selectedPlan.description || 'Ready to crush this workout!'}</p>
              </div>
              <button
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
                onClick={() => navigate(`/workout-sessions`, {state: {selectedPlan}})}
              >
                <Play className="w-6 h-6" />
                Start Workout
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Exercise List</h3>
              </div>
              
              {selectedPlan.exercises.map((ex, index) => (
                <div 
                  key={index}
                  className="group flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <span className="font-bold text-gray-800 text-lg">{ex.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      <span className="font-bold text-blue-600">{ex.sets}</span>
                      <span className="text-gray-600 ml-1">sets</span>
                    </div>
                    <span className="text-gray-400 font-bold">×</span>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                      <span className="font-bold text-purple-600">{ex.reps}</span>
                      <span className="text-gray-600 ml-1">reps</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>  
  );
};

export default WorkoutPlansPage;