import React from "react";
import FormDataPage from "./Pages/FormData";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import ProtectedRoute from "./component/ProtectedRoute";
import { AuthProvider } from "./Context/AuthContext";
import ResumePage from "./Pages/ResumePage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route with optional id */}
          <Route
            path="/:id?"
            element={<ProtectedRoute element={<FormDataPage />} />}
          />
          <Route path="/resume/:id" element={<ResumePage/>} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
