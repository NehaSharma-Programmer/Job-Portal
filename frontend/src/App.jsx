import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashBoard";
import RecruiterApplicants from "./pages/RecruiterApplicants";
import CreateJob from "./pages/CreateJob";
import Profile from "./pages/Profile";
import ProtectedRoute from "./ProtectedRoute";

function HomeRedirect() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role === "recruiter") {
    return <Navigate to="/recruiter" replace />;
  }
  return <CandidateDashboard />;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomeRedirect />} />

        {/* Candidate Routes */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute allowedRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        {/* Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterApplicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterApplicants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/create-job"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
