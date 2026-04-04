import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Layout from "./components/Layout";
import ProjectsList from "./pages/ProjectsList";
import ProjectSpecifics from "./pages/ProjectSpecifics";
import NewProject from "./pages/NewProject";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallback from "./pages/AuthCallback";
import LabsPage from "./pages/LabsPage";
import LabDetail from "./pages/LabDetail";
import JobsPage from "./pages/JobsPage";

function RequireAuth({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  if (user === undefined) return null; // still loading
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<Layout />}>
          <Route path="/" element={<ProjectsList />} />
          <Route path="project/:id" element={<ProjectSpecifics />} />
          <Route path="new" element={<NewProject />} />
          <Route path="profile/me" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="profile/:id" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="labs" element={<LabsPage />} />
          <Route path="labs/:id" element={<LabDetail />} />
          <Route path="jobs" element={<JobsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}