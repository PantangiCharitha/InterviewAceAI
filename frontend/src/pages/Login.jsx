import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "../firebase/firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(
        auth,
        googleProvider
      );

      navigate("/");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100">

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-indigo-700">
          Welcome Back 👋
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Login to continue your AI interview journey.
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-xl px-5 py-3"
            required
          />

          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-xl px-5 py-3"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-3 text-sm text-indigo-600"
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>
                    <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t"></div>

          <span className="px-4 text-gray-500">
            OR
          </span>

          <div className="flex-1 border-t"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border-2 border-gray-300 hover:bg-gray-100 py-3 rounded-xl font-semibold transition"
        >
          🔵 Continue with Google
        </button>

        <p className="text-center mt-8 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;