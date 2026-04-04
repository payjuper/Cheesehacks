import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { TAG_CLASS } from "./styles";
import { TECH_ICON, TECH_COLOR } from "../techIcons";
import FacultyBadge from "../FacultyBadge";

export default function ProjectCard({ project, animDelay, isSaved = false, onToggleSave }) {
  const [imgIdx, setImgIdx] = useState(0);
  const timerRef = useRef(null);

  const images = project.images ?? [];
  const stack = project.stack ?? [];
  const contributors = project.contributors ?? [];
  const tags = project.tags ?? [];
  const isProfessor = project.isAuthorProfessor ?? false;

  useEffect(() => {
    images.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [images]);

  const handleMouseEnter = useCallback(() => {
    if (images.length < 2) return;
    timerRef.current = setInterval(() => {
      setImgIdx(prev => (prev + 1) % images.length);
    }, 1000);
  }, [images]);

  const handleMouseLeave = useCallback(() => {
    clearInterval(timerRef.current);
    setImgIdx(0);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(project.id);
  };

  return (
    <Link
  to={`/project/${project.id}`}
  className="p-card"
  style={{
    animationDelay: `${animDelay}s`,
    width: '50vw',
    height: '17vw',
    ...(isProfessor ? { borderColor: '#FDE68A', boxShadow: '0 2px 14px rgba(180,83,9,0.08)' } : {}),
  }}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
      <div className="card-left">
        <div className="card-img">
          <div className="card-img-placeholder">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          {images.map((url, i) => (
            <img
              key={url}
              src={url}
              alt={project.title}
              style={{ opacity: i === imgIdx ? 1 : 0 }}
            />
          ))}
        </div>
        <div className="tags">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className={`tag ${TAG_CLASS[tag] || ""}`}>{({ ai:"AI", ml:"ML", data:"Data Science", web:"Web", sec:"Security", iot:"IoT", AI:"AI", ML:"ML", "Data Science":"Data Science", Web:"Web", Security:"Security", IoT:"IoT" })[tag] || tag}</span>
          ))}
          {tags.length > 3 && (
            <span className="tag-overflow">+{tags.length - 2}</span>
          )}
        </div>
      </div>
<div className="card-content">

        {/* Floor 1 — Title & Description */}
        <div className="card-top">
          <p className="card-title">{project.title}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {(project.start_date || project.end_date) && (
              <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 400, whiteSpace: 'nowrap' }}>
                {project.start_date ? new Date(project.start_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?'}
{' → '}
{project.end_date ? new Date(project.end_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?'}
              </span>
            )}
            <button className={`wl-btn${isSaved ? " saved" : ""}`} onClick={toggleSave}>
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
        <p className="card-desc">{project.description}</p>

        <div className="card-divider" />

        {/* Floor 2 — Tech Stack */}
        <div className="stack-row">
          {(() => {
            const BUDGET = 70;
            let used = 0;
            const visible = [];
            let hidden = 0;
            for (const s of stack) {
              const cost = s.name.length;
              if (used + cost > BUDGET && visible.length > 0) { hidden++; }
              else { visible.push(s); used += cost; }
            }
            return (
              <>
                {visible.map(s => {
                  const Icon = TECH_ICON[s.name];
                  const color = TECH_COLOR[s.name] ?? "#999";
                  return (
                    <div key={s.name} className="stack-item">
                      {Icon ? <Icon size={13} color={color} style={{ flexShrink: 0 }} /> : null}
                      {s.name}
                    </div>
                  );
                })}
                {hidden > 0 && <div className="stack-item" style={{ color: "var(--muted)", borderStyle: "dashed" }}>+{hidden}</div>}
              </>
            );
          })()}
        </div>

        {/* Floor 3 — Contributors */}
        <div className="card-footer">
          <div className="contrib-row">
            <div className="avatar-stack">
              {contributors.map((c, i) => (
                <div
                  key={i}
                  className="avatar"
                  style={{
                    background: `${c.color}22`,
                    color: c.color,
                    borderColor: `${c.color}44`,
                  }}
                >
                  {c.initials}
                </div>
              ))}
            </div>
            <span className="contrib-label" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {project.lead ? (
                <>
                  Led by{" "}
                  <Link to={`/profile/${project.lead}`} onClick={e => e.stopPropagation()} style={{ color: "inherit", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 2 }}>{project.lead}</Link>
                  {isProfessor && <FacultyBadge label="Faculty" />}
                </>
              ) : "No lead assigned"}
            </span>
          </div>
          <div className="go-btn">
            <svg viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>

      </div>
   </Link>
  );
}