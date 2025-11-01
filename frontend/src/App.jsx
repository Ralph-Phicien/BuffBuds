import './index.css'
import { Routes, Route, Navigate } from 'react-router-dom' 
import { useEffect, useState } from 'react'
import Feed from './assets/pages/Feed'
import SignIn from './assets/pages/SignIn'
import SignUp from './assets/pages/SignUp'
import ProfilePage from './assets/pages/ProfilePage.jsx'
import Workout from './assets/pages/Workout'
import CreateWorkout from './assets/pages/CreateWorkout.jsx'
import { checkStatus } from "./assets/services/api";
import WorkoutPlanPage from "./assets/pages/WorkoutPlanPage";


function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");


  // Hydrate from localStorage immediately
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const { username, id } = JSON.parse(storedUser);
    setIsAuthed(true);
    setUsername(username || "");
    setUserId(id || "");
  }

    setLoading(false);

    // Background check with backend
    const verify = async () => {
      try {
        const res = await checkStatus();
        if (res.data.authenticated) {
          setIsAuthed(true);
          setUsername(res.data.user?.username || "");
          setUserId(res.data.user?.id || "");
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: res.data.user?.username,
              id: res.data.user?.id,
            })
          );
        } else {
          setIsAuthed(false);
          setUsername("");
          setUserId("");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthed(false);
        setUsername("");
        setUserId("");
        localStorage.removeItem("user");
      }
    };

    verify();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <Routes>
      <Route
        path="/profile/:username"
        element={
          isAuthed ? (
            <ProfilePage userId={userId} setIsAuthed={setIsAuthed} setUsername={setUsername} />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/signin"
        element={
          <SignIn setIsAuthed={setIsAuthed} setUsername={setUsername} />
        }
      />
      <Route
        path="/signup"
        element={
          <SignUp setIsAuthed={setIsAuthed} setUsername={setUsername} />
        }
      />
      <Route
        path="/"
        element={
          isAuthed ? (
            <Feed 
              username={username}
              userId={userId}
              setIsAuthed={setIsAuthed}
              setUsername={setUsername}
            />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/workout"
        element={
          isAuthed ? (
            <Workout
              username={username}
              userId={userId}
              setIsAuthed={setIsAuthed}
              setUsername={setUsername}
            />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/create-workout"
        element={
          isAuthed ? (
            <CreateWorkout />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/select-workout"
        element={
          <WorkoutPlanPage />
        }
      />
    </Routes>
  );
}

export default App;
