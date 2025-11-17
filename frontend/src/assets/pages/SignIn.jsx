import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, resetPassword } from "../services/api";

const SignIn = ({ setIsAuthed, setUsername }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await login({ email, password });

      if (res.status === 200) {
        setIsAuthed(true);
        setUsername(res.data.user?.username || "");

        localStorage.setItem(
          "user",
          JSON.stringify({ username: res.data.user?.username })
        );

        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--bg)] p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-5xl mb-6 font-[bebas] text-center">
          Welcome To <span className="text-[var(--acc)]">BUFF</span>
          <span className="text-[var(--hl)]">BUDS</span>.
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--hl)] bg-gray-100"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--hl)] bg-gray-100"
        />

        <button
          type="submit"
          className="w-full bg-[var(--hl)] text-white py-3 rounded-md hover:bg-blue-600 transition"
        >
          Sign In
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <p className="mt-4 text-center text-white">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-[var(--hl)] hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
