import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const SignIn = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();
    const data = await apiRequest("/auth/login", "POST", { email, password });

    if (data.error) {
      setError(data.error);
    } else {
      console.log("Login successful");
      navigate("/");
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
          <a href="/signup" className="text-[var(--hl)] hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;