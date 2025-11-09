import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "../assets/allTodos.png"; // Placeholder image
import AuthContext from "../contexts/AuthContext";
import { User, Mail, AtSign } from "lucide-react";

const ProfileCard = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    userProfile: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://google-auth-todo-list.vercel.app/auth/settings/account",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (response.ok) {
          const data = await response.json();

          console.log("Data", data.user.userProfile);
          setFormData({
            name: data.user.fullName,
            userProfile: data.user.userProfile,
            username: data.user.username,
          });
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center">
      {loading && <div className="text-lg">Loading...</div>}{" "}
      {error && <div className="text-red-500">{error}</div>}{" "}
      {formData?.userProfile ? (
        <img
          src={`${formData.userProfile.trim()}`}
          alt="Profile"
          className="w-20 h-20 rounded-full border-2 border-pink-500 mb-4"
        />
      ) : (
        <User className="w-20 h-20 rounded-full border-2 border-pink-500 mb-4" />
      )}
      <h3 className="text-lg font-semibold mb-4">
        {formData.username || "Jhone Doe"}
      </h3>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/settings")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
