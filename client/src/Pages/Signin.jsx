import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); // Get setUser from context

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e) => {
    try {
      e.preventDefault();

      // Add your sign-in logic here
      if (email === "" || password === "") {
        toast.error("Email and Password are required");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        { email, password },
        { withCredentials: true }
      );

      const userData = response.data;
      setUser(userData); // Set the user state in the context
      toast.success("Signed in successfully!");
      navigate("/", { replace: true }); // Navigate to the home page
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md p-8 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
        <p className="text-center mt-4 text-gray-600">
          New here?{" "}
          <a href="/sign-up" className="text-blue-500 hover:underline">
            Create an account
          </a>
        </p>
      </form>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default SignIn;
