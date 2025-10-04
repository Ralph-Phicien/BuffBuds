import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Feed from "./assets/pages/Feed";
import SignIn from "./assets/pages/SignIn";
import SignUp from "./assets/pages/SignUp";
import { checkStatus } from "./assets/services/api";

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [username, setUsername] = useState("");

  // Hydrate from localStorage immediately
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username } = JSON.parse(storedUser);
      setIsAuthed(true);
      setUsername(username || "");
    }
    setLoading(false);

    // Background check with backend
    const verify = async () => {
      try {
        const res = await checkStatus();
        if (res.data.authenticated) {
          setIsAuthed(true);
          setUsername(res.data.user?.username || "");
          localStorage.setItem(
            "user",
            JSON.stringify({ username: res.data.user?.username })
          );
        } else {
          setIsAuthed(false);
          setUsername("");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthed(false);
        setUsername("");
        localStorage.removeItem("user");
      }
    };

    verify();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <Routes>
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
              setIsAuthed={setIsAuthed}
              setUsername={setUsername}
            />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
