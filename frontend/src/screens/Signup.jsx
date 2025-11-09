import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import AuthContext from "../contexts/AuthContext";
const Signup = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  const [backendError, setBackendError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const signUpFormHandleChange = (key, value) => {
    setSignUpForm({
      ...signUpForm,
      [key]: value,
    });
    setError({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
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
        `https://google-auth-todo-list.vercel.app/auth/google?code=${authResult.code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google Signin failed");
      }
      console.log("Data..........", data);

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
  const submitHandle = async (e) => {
    e.preventDefault();

    let newError = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!signUpForm.fullName.trim()) {
      newError.fullName = "Full name is required";
    }

    if (!signUpForm.email.trim()) {
      newError.email = "Email is required";
    }

    if (!signUpForm.password.trim()) {
      newError.password = "Password is required";
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      newError.confirmPassword = "Passwords do not match";
    }

    if (
      newError.fullName ||
      newError.email ||
      newError.password ||
      newError.confirmPassword
    ) {
      setError(newError);
      return;
    }

    setSuccessMessage("");
    setError({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://google-auth-todo-list.vercel.app/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signUpForm),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        if (data.message) {
          setBackendError(data.message);
        }
        return;
      }

      if (response.ok) {
        setSuccessMessage("Signup successful! You can now log in.");
        setSignUpForm({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      setError({
        fullName: "Something went wrong. Please try again later.",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {successMessage && (
          <div className="mb-4 text-green-600 text-center">
            {successMessage}
          </div>
        )}
        {backendError && (
          <div className="mb-4 text-red-600 text-center">{backendError}</div>
        )}

        <form onSubmit={submitHandle} className="space-y-6">
          {/* Full Name Field */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={signUpForm.fullName}
              onChange={(e) =>
                signUpFormHandleChange("fullName", e.target.value)
              }
              className={`mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                error.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error.fullName && (
              <p className="mt-1 text-sm text-red-600">{error.fullName}</p>
            )}
          </div>

          {/* Email Field */}
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
              value={signUpForm.email}
              onChange={(e) => signUpFormHandleChange("email", e.target.value)}
              className={`mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                error.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {error.email && (
              <p className="mt-1 text-sm text-red-600">{error.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword.password ? "text" : "password"}
                id="password"
                value={signUpForm.password}
                onChange={(e) =>
                  signUpFormHandleChange("password", e.target.value)
                }
                className={`mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  error.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    password: !showPassword.password,
                  })
                }
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword.password ? (
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

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                id="confirmPassword"
                value={signUpForm.confirmPassword}
                onChange={(e) =>
                  signUpFormHandleChange("confirmPassword", e.target.value)
                }
                className={`mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  error.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    confirm: !showPassword.confirm,
                  })
                }
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {error.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {error.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={googleSignin}
            disabled={googleLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4 disabled:opacity-50"
          >
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
