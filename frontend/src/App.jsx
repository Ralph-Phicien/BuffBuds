import './index.css'
import { Routes, Route, Navigate } from 'react-router-dom' 
import { useEffect, useState } from 'react'
import Feed from './assets/pages/Feed'
import SignIn from './assets/pages/SignIn'
import SignUp from './assets/pages/SignUp'
import ProfilePage from './assets/pages/ProfilePage.jsx'
import Workout from './assets/pages/Workout'
import CreateWorkout from './assets/pages/CreateWorkout.jsx'
import ResetPassword from './assets/pages/ResetPassword.jsx'
import { checkStatus } from "./assets/services/api";
import WorkoutPlanPage from "./assets/pages/WorkoutPlanPage";
import WorkoutSession from "./assets/pages/WorkourSession.jsx";
import Analytics from './assets/pages/Analytics.jsx'
import AdminPanel from './assets/pages/AdminPanel.jsx'

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username, id, admin } = JSON.parse(storedUser);
      setIsAuthed(true);
      setUsername(username || "");
      setUserId(id || "");
      setIsAdmin(admin || false);
    }

    setLoading(false);

    const verify = async () => {
      try {
        const res = await checkStatus();
        if (res.data.authenticated) {
          setIsAuthed(true);
          setUsername(res.data.user?.username || "");
          setUserId(res.data.user?.id || "");
          setIsAdmin(res.data.user?.admin || false);
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: res.data.user?.username,
              id: res.data.user?.id,
              admin: res.data.user?.admin || false,
            })
          );
        } else {
          setIsAuthed(false);
          setUsername("");
          setUserId("");
          setIsAdmin(false);
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthed(false);
        setUsername("");
        setUserId("");
        setIsAdmin(false);
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
            <ProfilePage userId={userId} isAdmin={isAdmin} setIsAuthed={setIsAuthed} setUsername={setUsername} />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/signin"
        element={
          <SignIn setIsAuthed={setIsAuthed} setUsername={setUsername} setIsAdmin={setIsAdmin} />
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
              isAdmin={isAdmin}
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
              isAdmin={isAdmin}
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
            <CreateWorkout 
              username={username}
              isAdmin={isAdmin}
              setIsAuthed={setIsAuthed}
              setUsername={setUsername}
            />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path="/select-workout"
        element={
          isAuthed ? (
          <WorkoutPlanPage 
            username={username}
            isAdmin={isAdmin}
            setIsAuthed={setIsAuthed}
            setUsername={setUsername}
          />
        ) : (
          <Navigate to="/signin" replace />
        )    
        }
      />
      <Route
        path="/workout-sessions"
        element={
          isAuthed ? (
            <WorkoutSession
              username={username}
              isAdmin={isAdmin}
              setIsAuthed={setIsAuthed}
              setUsername={setUsername}
            />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path='/analytics'
        element={
          isAuthed ? (
            <Analytics 
              username={username}
              isAdmin={isAdmin}
              setIsAuthed={setIsAuthed}
              setUsername={setUsername}
            />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
      <Route
        path='/admin'
        element={
          isAuthed && isAdmin ? (
            <AdminPanel 
              username={username}
              isAdmin={isAdmin}
              setIsAuthed={setIsAuthed}
              setUsername={setUsername}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;