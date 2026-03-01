import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { TAG_CLASS } from "./styles";

export default function ProjectCard({ project, animDelay }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgOpacity, setImgOpacity] = useState(1);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);

  const images = project.images ?? [];
  const stack = project.stack ?? [];
  const contributors = project.contributors ?? [];
  const tags = project.tags ?? [];

  useEffect(() => {
    images.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [images]);

  const handleMouseEnter = useCallback(() => {
    if (images.length < 2) return;
    timerRef.current = setInterval(() => {
      setImgOpacity(0);
      setTimeout(() => {
        setImgIdx(prev => (prev + 1) % images.length);
        setImgOpacity(1);
      }, 220);
    }, 1000);
  }, [images]);

  const handleMouseLeave = useCallback(() => {
    clearInterval(timerRef.current);
    setImgOpacity(0);
    setTimeout(() => {
      setImgIdx(0);
      setImgOpacity(1);
    }, 220);
  }, []);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(s => !s);
  };

  return (
    <Link
  to={`/project/${project.id}`}
  className="p-card"
  style={{ 
    animationDelay: `${animDelay}s`,
    width: '50vw',
    height: '15vw',
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
          {images[imgIdx] && (
            <img
              src={images[imgIdx]}
              alt={project.title}
              style={{ opacity: imgOpacity }}
            />
          )}
        </div>
        <div className="tags">
          {tags.map(tag => (
            <span key={tag} className={`tag ${TAG_CLASS[tag] || ""}`}>{tag}</span>
          ))}
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
            <button className={`wl-btn${saved ? " saved" : ""}`} onClick={toggleSave}>
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
          {stack.map(s => (
            <div key={s.name} className="stack-item">
              {s.icon && <div className="sicon">{s.icon}</div>}
              {s.name}
            </div>
          ))}
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
            <span className="contrib-label">
              {project.lead ? `Led by ${project.lead}` : "No lead assigned"}
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