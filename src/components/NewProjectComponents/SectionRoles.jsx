import { useState } from "react";

const TECH_OPTIONS = [
  "Python", "React", "Node.js", "FastAPI", "TensorFlow", "PyTorch",
  "Docker", "Pandas", "Postgres", "MongoDB", "TypeScript", "Rust",
  "Go", "Vue", "Next.js", "GraphQL"
];

export default function SectionRoles({ roles, setRoles }) {
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
          onKeyDown={e => e.key === 'Enter' && addRole()}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={addRole}
          style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'var(--text)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          + Add
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {TECH_OPTIONS.map(tech => (
          <button
            key={tech}
            type="button"
            onClick={() => toggleTech(tech)}
            style={{
              padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.18s',
              border: selectedTech.includes(tech) ? '1.5px solid var(--text)' : '1.5px solid var(--border)',
              background: selectedTech.includes(tech) ? 'var(--text)' : 'var(--bg)',
              color: selectedTech.includes(tech) ? '#fff' : 'var(--muted)',
            }}
          >
            {tech}
          </button>
        ))}
      </div>

      {roles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {roles.map((role, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--bg)' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{role.role_name}</span>
                {role.required_skills && (
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '10px' }}>{role.required_skills}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeRole(i)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '18px', lineHeight: 1, padding: '0 4px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}