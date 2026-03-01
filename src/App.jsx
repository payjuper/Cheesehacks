import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import ProjectsList from "./pages/ProjectsList";
import ProjectSpecifics from "./pages/ProjectSpecifics";
import Write from "./pages/Write";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ProjectsList />} />
          <Route path="project/:id" element={<ProjectSpecifics />} />
          <Route path="new" element={<Write />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}