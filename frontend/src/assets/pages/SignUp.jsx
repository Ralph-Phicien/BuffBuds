import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/api";

const SignUp = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await signup({
        email,
        password,
        username: usernameInput,
      });

      if (res.status === 201) {
        alert("Signup successful! Please check your email to verify your account.");
        navigate("/signin");
      } else {
        setError(res.data?.error || "Signup failed. Try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.error || "Signup failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--bg)] p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-5xl mb-6 font-[bebas] text-center">
          Join <span className="text-[var(--acc)]">Buff</span>
          <span className="text-[var(--hl)]">Buds</span> Today!
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--hl)] bg-gray-100"
        />
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
          Sign Up
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <p className="mt-4 text-center text-white">
          Already have an account?{" "}
          <Link to="/signin" className="text-[var(--hl)] hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
