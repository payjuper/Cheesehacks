import { useState, useEffect } from "react";
import { TECH_ICON, TECH_COLOR } from "../techIcons";
import { ALL_TECH } from "./styles";

const TECH_OPTIONS = [
  // Frontend
  "JavaScript", "TypeScript", "React", "Vue", "Next.js", "Angular", "Svelte", "Tailwind CSS",
  // Backend
  "Node.js", "Express.js", "Java", "Spring", "Python", "Django", "Flask", "FastAPI", "Ruby", "Ruby on Rails", "PHP", "Laravel", "C++", "C#", "Go", "Rust", "Scala",
  // ML / AI
  "TensorFlow", "PyTorch", "Pandas",
  // Database
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "Firebase", "Elasticsearch",
  // DevOps / Cloud
  "AWS", "Docker", "Kubernetes", "Git", "Linux", "Terraform",
  // Mobile
  "Swift", "Kotlin", "Flutter", "React Native",
  // Design / Game
  "Figma", "Unity", "Unreal Engine",
];

export default function SectionRoles({ roles, setRoles, projectTech = [] }) {
  const enabledNames = new Set(ALL_TECH.filter(t => projectTech.includes(t.id)).map(t => t.name));

  useEffect(() => {
    setSelectedTech(prev => prev.filter(t => enabledNames.has(t)));
  }, [projectTech]);
  const [roleName, setRoleName] = useState("");
  const [selectedTech, setSelectedTech] = useState([]);

  const toggleTech = (tech) => {
    setSelectedTech(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const addRole = () => {
    if (!roleName.trim()) return;
    setRoles(prev => [...prev, {
      role_name: roleName.trim(),
      is_closed: false,
      required_skills: selectedTech.join(", ")
    }]);
    setRoleName("");
    setSelectedTech([]);
  };

  const removeRole = (i) => setRoles(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="form-section">
      <div className="section-header">
        <div className="section-num">5</div>
        <div>
          <div className="section-title">Looking For</div>
          <div className="section-sub">Add roles and required skills for this project</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          className="field-input"
          type="text"
          placeholder="e.g. Frontend Developer, ML Engineer..."
          value={roleName}
          onChange={e => setRoleName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && selectedTech.length > 0 && addRole()}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={addRole}
          disabled={selectedTech.length === 0}
          style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'var(--text)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: selectedTech.length === 0 ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', opacity: selectedTech.length === 0 ? 0.4 : 1 }}
        >
          + Add
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
        {TECH_OPTIONS.map(tech => {
          const enabled = enabledNames.has(tech);
          const active = selectedTech.includes(tech);
          return (
            <button
              key={tech}
              type="button"
              onClick={() => enabled && toggleTech(tech)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 500,
                cursor: enabled ? 'pointer' : 'default', transition: 'all 0.18s',
                border: active ? '1.5px solid var(--text)' : '1.5px solid var(--border)',
                background: active ? 'var(--text)' : 'var(--bg)',
                color: active ? '#fff' : enabled ? 'var(--text)' : 'var(--muted)',
                opacity: enabled ? 1 : 0.4,
              }}
            >
              {(() => { const Icon = TECH_ICON[tech]; return Icon ? <Icon size={13} color={active ? "#fff" : (TECH_COLOR[tech] ?? "#999")} /> : null; })()}
              {tech}
            </button>
          );
        })}
      </div>

      {roles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
          {roles.map((role, i) => {
            const skills = role.required_skills ? role.required_skills.split(", ").filter(Boolean) : [];
            const hasError = skills.length === 0 || skills.some(s => !enabledNames.has(s));
            return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', border: `1.5px solid ${hasError ? '#f87171' : 'var(--border)'}`, background: 'var(--bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {hasError && (
                  <span title={skills.length === 0 ? 'No tech stack selected' : 'Some tech stacks are no longer in section 4'} style={{ display: 'flex', alignItems: 'center', color: '#f87171', fontSize: '15px', fontWeight: 700, lineHeight: 1 }}>!</span>
                )}
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{role.role_name}</span>
                  {role.required_skills && (
                    <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '10px' }}>{role.required_skills}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeRole(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px', lineHeight: 1, padding: '0 4px' }}
              >
                ×
              </button>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}