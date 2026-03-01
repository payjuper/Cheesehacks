import { useState, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red: #E14141;
    --red-light: #FFF0F0;
    --bg: #F4F2EF;
    --card: #FFFFFF;
    --text: #111111;
    --muted: #999990;
    --border: #E8E5E0;
    --sidebar-w: 64px;
  }

  /* ── Topbar ── */
  .np-topbar { padding: 36px 48px 0; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .np-topbar-left h1 { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
  .np-topbar-left p { margin-top: 6px; font-size: 14px; font-weight: 300; color: var(--muted); }
  .np-topbar-actions { display: flex; gap: 10px; align-items: center; }

  .btn-ghost {
    padding: 9px 20px; border-radius: 100px;
    border: 1.5px solid var(--border); background: var(--card);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--muted); cursor: pointer; transition: all 0.18s;
  }
  .btn-ghost:hover { border-color: #ccc; color: var(--text); }

  .btn-primary {
    padding: 9px 22px; border-radius: 100px; border: none; background: var(--red);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: #fff; cursor: pointer; transition: all 0.18s;
    display: flex; align-items: center; gap: 7px;
    box-shadow: 0 2px 12px rgba(225,65,65,0.28);
  }
  .btn-primary:hover { background: #d03232; box-shadow: 0 4px 18px rgba(225,65,65,0.38); transform: translateY(-1px); }
  .btn-primary svg { width: 14px; height: 14px; stroke: #fff; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }

  /* ── Steps ── */
  .np-steps { padding: 28px 48px 0; display: flex; align-items: center; }
  .step { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; color: var(--muted); }
  .step.done { color: var(--red); }
  .step-dot {
    width: 24px; height: 24px; border-radius: 50%;
    border: 1.5px solid var(--border); background: var(--card);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: var(--muted);
    transition: all 0.2s; flex-shrink: 0;
  }
  .step.done .step-dot { border-color: var(--red); background: var(--red); color: #fff; }
  .step-line { flex: 1; height: 1px; background: var(--border); margin: 0 10px; min-width: 24px; }
  .step-line.done { background: var(--red); opacity: 0.4; }

  /* ── Body ── */
  .np-body { padding: 28px 48px 80px; }

  /* ── Form card ── */
  .np-form-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 2px 14px rgba(0,0,0,0.04);
    animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pop  { from { opacity: 0; transform: scale(0.8); }       to { opacity: 1; transform: scale(1); } }

  .form-section { padding: 28px 32px; border-bottom: 1px solid var(--border); }
  .form-section:last-child { border-bottom: none; }

  .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .section-num {
    width: 26px; height: 26px; border-radius: 8px;
    background: var(--bg); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--muted); flex-shrink: 0;
  }
  .section-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }
  .section-sub { font-size: 12px; font-weight: 300; color: var(--muted); margin-top: 2px; }

  /* ── Fields ── */
  .field { margin-bottom: 18px; }
  .field:last-child { margin-bottom: 0; }
  .field-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }

  .field-input {
    width: 100%; padding: 10px 14px;
    border: 1.5px solid var(--border); border-radius: 12px;
    background: var(--bg); font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--text); outline: none;
    transition: border-color 0.18s, background 0.18s;
  }
  .field-input:focus { border-color: var(--red); background: #fff; }
  .field-input::placeholder { color: #bbb; }

  .field-textarea {
    width: 100%; padding: 12px 14px;
    border: 1.5px solid var(--border); border-radius: 12px;
    background: var(--bg); font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--text); outline: none;
    resize: vertical; min-height: 110px; line-height: 1.65;
    transition: border-color 0.18s, background 0.18s;
  }
  .field-textarea:focus { border-color: var(--red); background: #fff; }
  .field-textarea::placeholder { color: #bbb; }

  .char-count { font-size: 11px; color: var(--muted); text-align: right; margin-top: 5px; }
  .char-count.warn { color: var(--red); }

  /* ── Upload ── */
  .upload-zone {
    border: 2px dashed var(--border); border-radius: 14px;
    background: var(--bg); padding: 24px 20px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; cursor: pointer; transition: all 0.18s; text-align: center;
  }
  .upload-zone:hover { border-color: #ccc; background: #f0eee9; }
  .upload-zone.dragging { border-color: var(--red); background: var(--red-light); }
  .upload-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: var(--card); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }
  .upload-icon svg { width: 17px; height: 17px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .upload-label { font-size: 13px; font-weight: 500; color: var(--text); }
  .upload-sub { font-size: 11px; color: var(--muted); }
  .upload-previews { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
  .upload-preview { width: 68px; height: 68px; border-radius: 10px; overflow: hidden; position: relative; border: 1.5px solid var(--border); }
  .upload-preview img { width: 100%; height: 100%; object-fit: cover; }
  .preview-remove {
    position: absolute; top: 4px; right: 4px;
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(0,0,0,0.55); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; color: #fff;
    font-size: 10px; line-height: 1;
  }
  .preview-remove:hover { background: var(--red); }

  /* ── Tags ── */
  .tags-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag-toggle {
    font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 100px;
    border: 1.5px solid var(--border); background: var(--bg);
    color: var(--muted); cursor: pointer; transition: all 0.18s; user-select: none;
  }
  .tag-toggle:hover { border-color: #ccc; color: var(--text); }
  .tag-toggle.sel-ai   { background: #FFF0F0; color: #E14141; border-color: #F5C6C6; }
  .tag-toggle.sel-data { background: #EEF4FF; color: #3B6FE0; border-color: #C3D5F8; }
  .tag-toggle.sel-ml   { background: #F0FFF4; color: #2E8B57; border-color: #B2DFC0; }
  .tag-toggle.sel-web  { background: #FFF8EE; color: #E07B20; border-color: #F5D9B0; }
  .tag-toggle.sel-sec  { background: #F5F0FF; color: #7B3FE4; border-color: #D4B8F8; }
  .tag-toggle.sel-iot  { background: #F0F9FF; color: #0284C7; border-color: #BAE6FD; }
  .tag-toggle.sel-custom { background: #111; color: #fff; border-color: #111; }

  .tag-custom-row { display: flex; gap: 8px; margin-top: 12px; }
  .tag-custom-input {
    flex: 1; padding: 8px 12px;
    border: 1.5px solid var(--border); border-radius: 100px;
    background: var(--bg); font-family: 'DM Sans', sans-serif;
    font-size: 12px; color: var(--text); outline: none; transition: border-color 0.18s;
  }
  .tag-custom-input:focus { border-color: var(--red); }
  .tag-custom-input::placeholder { color: #bbb; }
  .tag-add-btn {
    padding: 8px 16px; border-radius: 100px;
    border: 1.5px solid var(--border); background: var(--card);
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
    color: var(--muted); cursor: pointer; transition: all 0.18s;
    display: flex; align-items: center; gap: 5px;
  }
  .tag-add-btn:hover { border-color: var(--text); color: var(--text); }
  .tag-add-btn svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2.2; stroke-linecap: round; }

  /* ── Tech stack ── */
  .stack-search-wrap { position: relative; margin-bottom: 14px; }
  .stack-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; pointer-events: none; }
  .stack-search {
    width: 100%; padding: 9px 14px 9px 34px;
    border: 1.5px solid var(--border); border-radius: 12px;
    background: var(--bg); font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--text); outline: none; transition: border-color 0.18s;
  }
  .stack-search:focus { border-color: var(--red); background: #fff; }
  .stack-search::placeholder { color: #bbb; }

  .tech-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .tech-chip {
    display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--bg);
    font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.18s; user-select: none;
  }
  .tech-chip:hover { border-color: #ccc; }
  .tech-chip.selected { border-color: var(--text); background: var(--text); color: #fff; }
  .tech-icon { width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; }

  .selected-stack { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
  .selected-stack-empty { font-size: 12px; color: #bbb; padding-top: 14px; border-top: 1px solid var(--border); margin-top: 14px; }
  .sel-chip {
    display: flex; align-items: center; gap: 6px; padding: 5px 10px 5px 12px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--card);
    font-size: 11px; font-weight: 500;
    animation: pop 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .sel-chip-remove {
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--bg); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); font-size: 11px; line-height: 1;
    transition: background 0.15s, color 0.15s;
  }
  .sel-chip-remove:hover { background: #fee; color: var(--red); }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 36px; left: 50%; transform: translateX(-50%) translateY(80px);
    background: #111; color: #fff; font-size: 13px; font-weight: 500;
    padding: 12px 22px; border-radius: 100px;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s;
    opacity: 0; pointer-events: none; z-index: 999; white-space: nowrap;
  }
  .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; pointer-events: auto; }
  .toast svg { width: 15px; height: 15px; stroke: #4ade80; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

  @media (max-width: 680px) {
    .np-topbar, .np-steps, .np-body { padding-left: 16px; padding-right: 16px; }
  }
`;

const PRESET_TAGS = [
  { id: "ai",   label: "AI",           cls: "sel-ai"   },
  { id: "ml",   label: "ML",           cls: "sel-ml"   },
  { id: "data", label: "Data Science", cls: "sel-data" },
  { id: "web",  label: "Web",          cls: "sel-web"  },
  { id: "sec",  label: "Security",     cls: "sel-sec"  },
  { id: "iot",  label: "IoT",          cls: "sel-iot"  },
];

const ALL_TECH = [
  { id: "python",     name: "Python",     color: "#3572A5" },
  { id: "react",      name: "React",      color: "#61DAFB" },
  { id: "nodejs",     name: "Node.js",    color: "#539E43" },
  { id: "fastapi",    name: "FastAPI",    color: "#009688" },
  { id: "tensorflow", name: "TensorFlow", color: "#FF6F00" },
  { id: "pytorch",    name: "PyTorch",    color: "#EE4C2C" },
  { id: "docker",     name: "Docker",     color: "#2496ED" },
  { id: "pandas",     name: "Pandas",     color: "#150458" },
  { id: "postgres",   name: "Postgres",   color: "#336791" },
  { id: "mongodb",    name: "MongoDB",    color: "#47A248" },
  { id: "typescript", name: "TypeScript", color: "#3178C6" },
  { id: "rust",       name: "Rust",       color: "#DEA584" },
  { id: "go",         name: "Go",         color: "#00ACD7" },
  { id: "vue",        name: "Vue",        color: "#42B883" },
  { id: "nextjs",     name: "Next.js",    color: "#000000" },
  { id: "graphql",    name: "GraphQL",    color: "#E10098" },
];

function TechDot({ color }) {
  return (
    <span style={{
      width: 8, height: 8, borderRadius: "50%",
      background: color, display: "inline-block", flexShrink: 0,
    }} />
  );
}

export default function NewProject() {
  const [title, setTitle]                   = useState("");
  const [desc, setDesc]                     = useState("");
  const [selectedTags, setSelectedTags]     = useState([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [customTags, setCustomTags]         = useState([]);
  const [techSearch, setTechSearch]         = useState("");
  const [selectedTech, setSelectedTech]     = useState([]);
  const [previews, setPreviews]             = useState([]);
  const [dragging, setDragging]             = useState(false);
  const [toast, setToast]                   = useState(false);
  const fileRef = useRef();

  const MAX_DESC = 280;

  const toggleTag = (id) =>
    setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const addCustomTag = () => {
    const v = customTagInput.trim();
    if (!v || customTags.includes(v)) return;
    setCustomTags(prev => [...prev, v]);
    setCustomTagInput("");
  };
  const removeCustomTag = (t) => setCustomTags(prev => prev.filter(x => x !== t));

  const filteredTech = ALL_TECH.filter(t =>
    t.name.toLowerCase().includes(techSearch.toLowerCase())
  );
  const toggleTech = (id) =>
    setSelectedTech(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const handleFiles = (files) => {
    const urls = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .slice(0, 4 - previews.length)
      .map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...urls].slice(0, 4));
  };
  const removePreview = (i) => setPreviews(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  const selectedTechObjs = ALL_TECH.filter(t => selectedTech.includes(t.id));

  const steps = ["Basics", "Tags", "Tech Stack"];
  const completedSections = [
    title.trim().length > 0 && desc.trim().length > 0,
    selectedTags.length > 0 || customTags.length > 0,
    selectedTech.length > 0,
  ];

  return (
    <div>
      <style>{style}</style>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div className="np-topbar">
          <div className="np-topbar-left">
            <h1>New Project</h1>
            <p>Fill in the details to publish your project for collaborators.</p>
          </div>
          <div className="np-topbar-actions">
            <button className="btn-ghost">Discard</button>
            <button className="btn-primary" onClick={handleSubmit}>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Publish Project
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="np-steps">
          {steps.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div className={`step${completedSections[i] ? " done" : ""}`}>
                <div className="step-dot">
                  {completedSections[i]
                    ? <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, stroke: "#fff", fill: "none", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }}><polyline points="20 6 9 17 4 12" /></svg>
                    : i + 1}
                </div>
                <span>{label}</span>
              </div>
              {i < steps.length - 1 && <div className={`step-line${completedSections[i] ? " done" : ""}`} />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="np-body">
          <div className="np-form-card">

            {/* ── Section 1: Basics ── */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-num">1</div>
                <div>
                  <div className="section-title">Project Basics</div>
                  <div className="section-sub">Give your project a name, description and cover images</div>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Project Name</label>
                <input
                  className="field-input"
                  type="text"
                  placeholder="e.g. Adaptive Learning Engine"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={80}
                />
              </div>

              <div className="field">
                <label className="field-label">Description</label>
                <textarea
                  className="field-textarea"
                  placeholder="Describe what your project does, what problem it solves, and who it's for…"
                  value={desc}
                  onChange={e => setDesc(e.target.value.slice(0, MAX_DESC))}
                />
                <div className={`char-count${desc.length > MAX_DESC * 0.9 ? " warn" : ""}`}>
                  {desc.length} / {MAX_DESC}
                </div>
              </div>

              <div className="field">
                <label className="field-label">Project Images</label>
                {previews.length < 4 && (
                  <div
                    className={`upload-zone${dragging ? " dragging" : ""}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                  >
                    <div className="upload-icon">
                      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <div className="upload-label">
                      {dragging ? "Drop images here" : "Click to upload or drag & drop"}
                    </div>
                    <div className="upload-sub">PNG, JPG, WEBP — up to {4 - previews.length} image{4 - previews.length !== 1 ? "s" : ""}</div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={e => handleFiles(e.target.files)}
                    />
                  </div>
                )}
                {previews.length > 0 && (
                  <div className="upload-previews">
                    {previews.map((src, i) => (
                      <div key={i} className="upload-preview">
                        <img src={src} alt="" />
                        <button className="preview-remove" onClick={() => removePreview(i)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Section 2: Tags ── */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-num">2</div>
                <div>
                  <div className="section-title">Tags</div>
                  <div className="section-sub">Select categories or create custom tags</div>
                </div>
              </div>
              <div className="tags-grid">
                {PRESET_TAGS.map(t => (
                  <button
                    key={t.id}
                    className={`tag-toggle${selectedTags.includes(t.id) ? " " + t.cls : ""}`}
                    onClick={() => toggleTag(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
                {customTags.map(t => (
                  <button
                    key={t}
                    className="tag-toggle sel-custom"
                    onClick={() => removeCustomTag(t)}
                    title="Click to remove"
                  >
                    {t} ×
                  </button>
                ))}
              </div>
              <div className="tag-custom-row">
                <input
                  className="tag-custom-input"
                  type="text"
                  placeholder="Add custom tag…"
                  value={customTagInput}
                  onChange={e => setCustomTagInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addCustomTag()}
                  maxLength={24}
                />
                <button className="tag-add-btn" onClick={addCustomTag}>
                  <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add
                </button>
              </div>
            </div>

            {/* ── Section 3: Tech Stack ── */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-num">3</div>
                <div>
                  <div className="section-title">Tech Stack</div>
                  <div className="section-sub">Select the technologies used in this project</div>
                </div>
              </div>
              <div className="stack-search-wrap">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  className="stack-search"
                  type="text"
                  placeholder="Search technologies…"
                  value={techSearch}
                  onChange={e => setTechSearch(e.target.value)}
                />
              </div>
              <div className="tech-grid">
                {filteredTech.map(t => (
                  <button
                    key={t.id}
                    className={`tech-chip${selectedTech.includes(t.id) ? " selected" : ""}`}
                    onClick={() => toggleTech(t.id)}
                  >
                    <div className="tech-icon">
                      <TechDot color={selectedTech.includes(t.id) ? "#fff" : t.color} />
                    </div>
                    {t.name}
                  </button>
                ))}
                {filteredTech.length === 0 && (
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>No technologies match "{techSearch}"</span>
                )}
              </div>
              {selectedTechObjs.length > 0 ? (
                <div className="selected-stack">
                  {selectedTechObjs.map(t => (
                    <div key={t.id} className="sel-chip">
                      <TechDot color={t.color} />
                      {t.name}
                      <button className="sel-chip-remove" onClick={() => toggleTech(t.id)}>×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="selected-stack-empty">No technologies selected yet.</div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast${toast ? " show" : ""}`}>
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        Project published successfully!
      </div>
    </div>
  );
}
