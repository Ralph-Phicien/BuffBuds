import Header from "../components/Header";

const Workout = ({ username, setIsAuthed, setUsername }) => {
    return (
        <div>
            {/* Header */}
            <Header
                username={username}
                setIsAuthed={setIsAuthed}
                setUsername={setUsername}
            />
            <button>
                Create Workout
            </button>
            <button>
                View Workouts
            </button>
        </div>
    );
}   

export default Workout;