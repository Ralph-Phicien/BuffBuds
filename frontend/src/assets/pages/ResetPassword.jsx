import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token"); // Supabase sends token in URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!accessToken) {
      setError("Invalid or missing reset token.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser(
        { password },
        { accessToken }
      );

      if (error) {
        setError(error.message);
      } else {
        setMessage("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Failed to reset password. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--bg)] p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-5xl mb-6 font-[bebas] text-center">
          Reset <span className="text-[var(--hl)]">Password</span>
        </h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--hl)] bg-gray-100"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--hl)] bg-gray-100"
        />

        <button
          type="submit"
          className="w-full bg-[var(--hl)] text-white py-3 rounded-md hover:bg-blue-600 transition mb-2"
        >
          Update Password
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {message && <p className="text-green-500 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;