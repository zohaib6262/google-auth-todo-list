import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [backendError, setBackendError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (key, value) => {
    setLoginForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError({ email: "", password: "" });
  };

  const googleSigninHandler = async (authResult) => {
    console.log("Auth code", authResult);
    if (!authResult.code) {
      setBackendError("No authorization code received from Google.");
      return;
    }

    setGoogleLoading(true);
    try {
      const response = await fetch(
        `https://to-do-list-app-backend-app.vercel.app/auth/google?code=${authResult.code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Data////////.....", data);
      if (!response.ok) {
        throw new Error(data.message || "Google Signin failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      navigate("/");
    } catch (error) {
      console.log("Google Signin Error:", error);
      setBackendError(
        error.message || "Something went wrong with Google Signin."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleSignin = useGoogleLogin({
    onSuccess: googleSigninHandler,
    onError: googleSigninHandler,
    flow: "auth-code",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ email: "", password: "" });
    setBackendError("");

    if (!loginForm.email || !loginForm.password) {
      setError({
        email: !loginForm.email ? "Email is required" : "",
        password: !loginForm.password ? "Password is required" : "",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://to-do-list-app-backend-app.vercel.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setBackendError(data.message || "Login failed");
        return;
      }

      setSuccessMessage("Login successful!");
      setToken(data.token);
      navigate("/");
    } catch (error) {
      setBackendError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {successMessage && (
          <div className="mb-4 text-green-600 text-center">
            {successMessage}
          </div>
        )}
        {backendError && (
          <div className="mb-4 text-red-600 text-center">{backendError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={loginForm.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                error.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error.email && (
              <p className="mt-1 text-sm text-red-600">{error.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={loginForm.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  error.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {error.password && (
              <p className="mt-1 text-sm text-red-600">{error.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={googleSignin}
            disabled={googleLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
