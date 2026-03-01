import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { style } from "../components/NewProjectComponents/styles";
import SectionBasics from "../components/NewProjectComponents/SectionBasics";
import SectionDuration from "../components/NewProjectComponents/SectionDuration";
import SectionTags from "../components/NewProjectComponents/SectionTags";
import SectionTechStack from "../components/NewProjectComponents/SectionTechStack";

const STEPS = ["Basics", "Duration", "Tags", "Tech Stack"];

export default function NewProject() {
  const navigate = useNavigate();

  const [title, setTitle]               = useState("");
  const [desc, setDesc]                 = useState("");
  const [startDate, setStartDate]       = useState("");
  const [endDate, setEndDate]           = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTags, setCustomTags]     = useState([]);
  const [selectedTech, setSelectedTech] = useState([]);
  const [previews, setPreviews]         = useState([]);
  const [toast, setToast]               = useState(false);

  const completedSections = [
    title.trim().length > 0 && desc.trim().length > 0,
    startDate.length > 0 && endDate.length > 0,
    selectedTags.length > 0 || customTags.length > 0,
    selectedTech.length > 0,
  ];

  const handleSubmit = async () => {
    if (!title || !desc) {
      alert("Please fill in both title and description!");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in!");
      navigate('/login');
      return;
    }

    const combinedTags = [...selectedTags, ...customTags];
    const categoryTag = combinedTags.length > 0 ? combinedTags[0] : "General";
    const techStacksString = selectedTech.join(", ");

    const { data, error } = await supabase.from("projects").insert([{
      title: title,
      content: desc,
      category_tag: categoryTag,
      tech_stacks: techStacksString,
      images: previews,
      author_id: user.id,
      start_date: startDate,
      end_date: endDate,
    }]).select();

    if (error) {
      console.error("DB save failed:", error);
      alert("Error publishing project: " + error.message);
      return;
    }

    setToast(true);

    setTimeout(() => {
      setToast(false);
      navigate('/');
    }, 1500);
  };

  
return (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
    <style>{style}</style>
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="np-topbar">
          <div className="np-topbar-left">
            <h1>New Project</h1>
            <p>Fill in the details to publish your project for collaborators.</p>
          </div>
          <div className="np-topbar-actions">
            <button className="btn-ghost" onClick={() => navigate('/')}>Discard</button>
            <button className="btn-primary" onClick={handleSubmit}>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
              Publish Project
            </button>
          </div>
        </div>

        <div className="np-steps">
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div className={`step${completedSections[i] ? " done" : ""}`}>
                <div className="step-dot">
                  {completedSections[i]
                    ? <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, stroke: "#fff", fill: "none", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }}><polyline points="20 6 9 17 4 12" /></svg>
                    : i + 1}
                </div>
                <span>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`step-line${completedSections[i] ? " done" : ""}`} />}
            </div>
          ))}
        </div>

        <div className="np-body">
          <div className="np-form-card">
            <SectionBasics
              title={title} setTitle={setTitle}
              desc={desc} setDesc={setDesc}
              previews={previews} setPreviews={setPreviews}
            />
            <SectionDuration
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
            />
            <SectionTags
              selectedTags={selectedTags} setSelectedTags={setSelectedTags}
              customTags={customTags} setCustomTags={setCustomTags}
            />
            <SectionTechStack
              selectedTech={selectedTech} setSelectedTech={setSelectedTech}
            />
          </div>
        </div>
      </div>

      <div className={`toast${toast ? " show" : ""}`}>
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
        Project published successfully!
      </div>
    </div>
  );
}