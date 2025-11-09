import React, { useContext, useEffect, useState } from "react";
import { User, Mail, AtSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthContext from "../contexts/AuthContext";

const AccountSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

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
          setFormData({
            name: data.user.fullName,
            email: data.user.email,
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

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    username: Yup.string()
      .matches(/^\S*$/, "No spaces are allowed in username")
      .required("Username is required"),
  });

  // Formik hook
  const formik = useFormik({
    initialValues: formData,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      setSuccessMessage("");
      try {
        const response = await fetch(
          "https://google-auth-todo-list.vercel.app/auth/settings/account",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
              fullName: values.name,
              email: values.email,
              username: values.username,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          setSuccessMessage("User updated successfully!");
          navigate("../");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to update user");
        }
      } catch (error) {
        setError("Error submitting form");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Account Settings
      </h2>
      {loading && <div className="text-center text-indigo-600">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}
      {successMessage && (
        <div className="text-center text-green-600">{successMessage}</div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading} // Disable input during loading
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-600 text-sm">{formik.errors.name}</div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border bg-gray-200 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={true}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <AtSign className="h-4 w-4" />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-600 text-sm">
                  {formik.errors.username}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
