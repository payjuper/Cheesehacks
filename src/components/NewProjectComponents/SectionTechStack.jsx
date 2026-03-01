import { useState } from "react";

function TechDot({ color }) {
  return (
    <span style={{
      width: 8, height: 8, borderRadius: "50%",
      background: color, display: "inline-block", flexShrink: 0,
    }} />
  );
}

export default function SectionTechStack({ selectedTech, setSelectedTech, availableTech = [] }) {
  const [techSearch, setTechSearch] = useState("");

  const techOptions = availableTech.map((name) => ({
    id: name,
    name,
    color: "#999990",
  }));

  const filteredTech = techOptions.filter(t =>
    t.name.toLowerCase().includes(techSearch.toLowerCase())
  );

  const toggleTech = (id) =>
    setSelectedTech(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const selectedTechObjs = techOptions.filter(t => selectedTech.includes(t.id));

  return (
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
  );
}
