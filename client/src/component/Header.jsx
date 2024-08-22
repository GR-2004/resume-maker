import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
  const navigate = useNavigate(); // Use the useNavigate hook for navigation
  const { setUser } = useAuth(); // Get setUser from context to clear the user state on logout

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/user/logout", {
        withCredentials: true,
      });
      setUser(null); // Clear the user data in context
      toast.success("User logged out successfully");
      navigate("/sign-in", { replace: true }); // Programmatically navigate to sign-in page
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Resume Maker</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
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
    </header>
  );
};

export default Header;
