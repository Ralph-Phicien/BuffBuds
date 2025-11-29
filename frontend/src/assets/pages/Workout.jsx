import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Workout = ({ username, isAdmin, setIsAuthed, setUsername }) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <Header
        username={username}
        isAdmin={isAdmin}
        setIsAuthed={setIsAuthed}
        setUsername={setUsername}
      />
      <div className="flex items-center flex-col justify-center h-screen gap-10">
        <button
          onClick={() => navigate('/create-workout')}
          className="h-20 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-3 rounded-md transition"
        >
          Create Workout
        </button>
        <button
          onClick={() => navigate('/select-workout')}
          className="h-20 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-3 rounded-md transition"
        >
          View Workouts
        </button>
      </div>
    </div>
  );
};

export default Workout;
