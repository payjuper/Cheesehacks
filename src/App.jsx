import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import ProjectsList from "./pages/ProjectsList";
import ProjectSpecifics from "./pages/ProjectSpecifics";
import Write from "./pages/Write";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ProjectsList />} />
          <Route path="project/:id" element={<ProjectSpecifics />} />
          <Route path="new" element={<Write />} />
          <Route path="profile/:id" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}