import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { RESEARCH_AREAS } from "./LabsPage";
import FacultyBadge from "../components/FacultyBadge";

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
    --court: #1A1A2E;
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }
  .ld-root { margin-left: var(--sidebar-w); min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Back nav ───────────────────────────────── */
  .ld-back { padding: 24px 48px 0; display: flex; }
  .ld-back-btn {
    display: flex; align-items: center; gap: 7px;
    font-size: 12px; font-weight: 500; color: var(--muted);
    text-decoration: none; transition: color 0.18s;
    background: none; border: none; cursor: pointer; padding: 0;
    font-family: 'DM Sans', sans-serif;
  }
  .ld-back-btn:hover { color: var(--text); }
  .ld-back-btn svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: transform 0.18s; }
  .ld-back-btn:hover svg { transform: translateX(-3px); }

  /* ── Hero ───────────────────────────────────── */
  .ld-hero {
    margin: 20px 48px 0; border-radius: 24px;
    padding: 40px 44px; position: relative; overflow: hidden;
    animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  .ld-hero::before {
    content: ''; position: absolute; top: -60px; right: -80px;
    width: 340px; height: 340px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.08); pointer-events: none;
  }
  .ld-hero::after {
    content: ''; position: absolute; bottom: -80px; right: 100px;
    width: 220px; height: 220px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.05); pointer-events: none;
  }
  .ld-hero-inner { position: relative; z-index: 1; }
  .ld-hero-top { display: flex; align-items: flex-start; gap: 28px; }

  .ld-avatar {
    width: 88px; height: 88px; border-radius: 50%; flex-shrink: 0;
    background: rgba(255,255,255,0.15); border: 2.5px solid rgba(255,255,255,0.35);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 700;
    color: #fff; overflow: hidden;
  }
  .ld-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .ld-hero-info { flex: 1; min-width: 0; }
  .ld-hero-badges { display: flex; gap: 7px; margin-bottom: 10px; flex-wrap: wrap; }
  .ld-recruit-badge {
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; padding: 4px 10px; border-radius: 7px; white-space: nowrap;
  }
  .ld-recruit-badge.undergrad { background: rgba(59,111,224,0.3); color: #88AAFF; border: 1px solid rgba(59,111,224,0.4); }
  .ld-recruit-badge.phd       { background: rgba(123,63,228,0.3); color: #C4A0FF; border: 1px solid rgba(123,63,228,0.4); }
  .ld-not-recruiting {
    font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 7px;
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.1);
  }
  .ld-name { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 700; letter-spacing: -0.02em; color: #fff; line-height: 1.1; }
  .ld-pi-row { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }
  .ld-faculty-chip { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); border-radius: 8px; padding: 4px 10px; }
  .ld-tagline { margin-top: 14px; font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.6); line-height: 1.65; max-width: 580px; }
  .ld-hero-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
  .ld-hero-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    text-decoration: none; transition: all 0.18s; cursor: pointer; border: none;
  }
  .ld-hero-btn svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .ld-hero-btn-primary { background: var(--red); color: #fff; box-shadow: 0 4px 14px rgba(225,65,65,0.35); }
  .ld-hero-btn-primary:hover { background: #d03232; transform: translateY(-1px); }
  .ld-hero-btn-ghost { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.18); }
  .ld-hero-btn-ghost:hover { background: rgba(255,255,255,0.18); color: #fff; }

  /* ── Layout body ────────────────────────────── */
  .ld-body { padding: 28px 48px 80px; display: flex; gap: 24px; align-items: flex-start; }
  .ld-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 20px; }
  .ld-sidebar { width: 270px; min-width: 270px; display: flex; flex-direction: column; gap: 16px; position: sticky; top: 24px; }

  /* ── Generic card ───────────────────────────── */
  .ld-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; padding: 24px 28px;
    animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  .ld-card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
  .ld-card-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ld-card-icon svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .ld-card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: -0.01em; }
  .ld-section-empty { font-size: 13px; color: var(--muted); font-weight: 300; font-style: italic; }

  /* ── Research areas ─────────────────────────── */
  .ld-areas { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
  .ld-area-chip {
    display: flex; align-items: center; gap: 7px;
    padding: 7px 13px; border-radius: 10px; border: 1.5px solid transparent;
    font-size: 12px; font-weight: 500; text-decoration: none; transition: opacity 0.18s;
  }
  .ld-area-chip:hover { opacity: 0.8; }
  .ld-area-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .ld-desc { font-size: 14px; font-weight: 300; line-height: 1.85; color: #444; white-space: pre-wrap; }

  /* ── Publications ───────────────────────────── */
  .ld-pub-list { display: flex; flex-direction: column; gap: 12px; }
  .ld-pub-item { padding: 14px 16px; border-radius: 12px; background: var(--bg); border: 1px solid var(--border); }
  .ld-pub-title { font-size: 13px; font-weight: 600; color: var(--text); line-height: 1.4; }
  .ld-pub-title a { color: var(--red); text-decoration: underline; text-underline-offset: 2px; }
  .ld-pub-meta { font-size: 11px; color: var(--muted); margin-top: 4px; font-weight: 300; }

  /* ── Courses ────────────────────────────────── */
  .ld-course-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .ld-course-chip { font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 10px; background: var(--bg); border: 1.5px solid var(--border); color: var(--text); }

  /* ── Students ───────────────────────────────── */
  .ld-student-list { display: flex; flex-direction: column; gap: 8px; }
  .ld-student-row { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; background: var(--bg); border: 1px solid var(--border); }
  .ld-student-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #E14141, #ff8c8c); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .ld-student-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .ld-student-role { font-size: 11px; color: var(--muted); font-weight: 300; }

  /* ── CTA Recruiting ─────────────────────────── */
  .ld-cta-card {
    background: var(--court); border: none;
    border-radius: 20px; overflow: hidden;
    animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  .ld-cta-header { padding: 20px 24px 16px; position: relative; }
  .ld-cta-header::after {
    content: ''; position: absolute; top: -30px; right: -30px;
    width: 140px; height: 140px; border-radius: 50%;
    background: radial-gradient(circle, rgba(225,65,65,0.2) 0%, transparent 70%);
    pointer-events: none;
  }
  .ld-cta-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--red); margin-bottom: 6px; }
  .ld-cta-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #fff; }
  .ld-cta-status-row { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
  .ld-cta-badge {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 8px; white-space: nowrap;
  }
  .ld-cta-badge.open-undergrad { background: rgba(59,111,224,0.3); color: #88AAFF; border: 1px solid rgba(59,111,224,0.4); }
  .ld-cta-badge.open-phd       { background: rgba(123,63,228,0.3); color: #C4A0FF; border: 1px solid rgba(123,63,228,0.4); }
  .ld-cta-badge.closed         { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.1); }
  .ld-cta-body { padding: 16px 24px 24px; display: flex; flex-direction: column; gap: 14px; }
  .ld-cta-section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 6px; }
  .ld-cta-text { font-size: 12px; font-weight: 300; color: rgba(255,255,255,0.65); line-height: 1.7; }
  .ld-cta-prereq-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .ld-cta-prereq { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 7px; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.14); }
  .ld-apply-btn {
    width: 100%; padding: 13px; border-radius: 12px; border: none;
    background: var(--red); color: #fff; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer; letter-spacing: 0.02em;
    box-shadow: 0 4px 18px rgba(225,65,65,0.4); transition: all 0.18s;
    margin-top: 4px;
  }
  .ld-apply-btn:hover { background: #d03232; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(225,65,65,0.5); }

  /* ── Sidebar info card ──────────────────────── */
  .ld-info-grid { display: flex; flex-direction: column; gap: 14px; }
  .ld-info-item { display: flex; flex-direction: column; gap: 3px; }
  .ld-info-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .ld-info-val { font-size: 13px; font-weight: 500; color: var(--text); display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
  .ld-info-val a { color: var(--red); text-decoration: underline; text-underline-offset: 2px; word-break: break-all; }
  .ld-info-link-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .ld-info-link-row:last-child { border-bottom: none; }
  .ld-info-link-row svg { width: 14px; height: 14px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; flex-shrink: 0; }
  .ld-info-link-row a { font-size: 12px; font-weight: 500; color: var(--text); text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ld-info-link-row a:hover { color: var(--red); }

  /* ── News ───────────────────────────────────── */
  .ld-news-list { display: flex; flex-direction: column; gap: 10px; }
  .ld-news-item { padding: 12px 14px; border-radius: 12px; background: var(--bg); border: 1px solid var(--border); font-size: 13px; font-weight: 300; color: var(--text); line-height: 1.55; }

  /* ── Alumni ─────────────────────────────────── */
  .ld-alumni-list { display: flex; flex-direction: column; gap: 8px; }
  .ld-alumni-row { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; background: var(--bg); border: 1px solid var(--border); }
  .ld-alumni-icon { width: 30px; height: 30px; border-radius: 8px; background: var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ld-alumni-icon svg { width: 14px; height: 14px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; }
  .ld-alumni-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .ld-alumni-dest { font-size: 11px; color: var(--muted); font-weight: 300; margin-top: 1px; }

  /* ── Loading / error ────────────────────────── */
  .ld-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; color: var(--muted); font-size: 14px; }
  .ld-not-found { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 12px; color: var(--muted); font-size: 14px; }
  .ld-not-found svg { width: 36px; height: 36px; stroke: #ccc; fill: none; stroke-width: 1.5; }

  @media (max-width: 1000px) { .ld-sidebar { display: none; } .ld-body { flex-direction: column; } }
  @media (max-width: 680px) {
    .ld-back, .ld-body { padding-left: 16px; padding-right: 16px; }
    .ld-hero { margin-left: 16px; margin-right: 16px; padding: 28px 22px; }
    .ld-hero-top { flex-direction: column; gap: 16px; }
    .ld-name { font-size: 22px; }
  }
`;

function parseLines(text) {
  if (!text) return [];
  return text.split("\n").map(l => l.trim()).filter(Boolean);
}

function getHeaderGradient(areas) {
  const colors = areas.map(area => {
    const obj = RESEARCH_AREAS.find(r => r.label.toLowerCase() === area.toLowerCase());
    return obj?.color ?? "#1A1A2E";
  }).filter(Boolean);
  if (colors.length === 0) return "#1A1A2E";
  if (colors.length === 1) return colors[0];
  const step = 100 / (colors.length - 1);
  return `linear-gradient(135deg, ${colors.map((c, i) => `${c} ${Math.round(i * step)}%`).join(", ")})`;
}

export default function LabDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("labs").select("*").eq("id", id).single()
      .then(async ({ data, error }) => {
        if (!error && data) {
          setLab(data);
          const piName = data.pi_name;
          if (piName) {
            const { data: prof } = await supabase
              .from("professors")
              .select("photo_url")
              .eq("name", piName)
              .maybeSingle();
            if (prof?.photo_url) setPhotoUrl(prof.photo_url);
          }
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="ld-root"><style>{style}</style><div className="ld-loading">Loading lab…</div></div>;
  if (!lab) return (
    <div className="ld-root"><style>{style}</style>
      <div className="ld-not-found">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>Lab not found.</span>
        <Link to="/labs" style={{ color: "var(--red)", fontSize: 13 }}>← Back to Labs</Link>
      </div>
    </div>
  );

  const areas = (lab.research_areas || "").split(",").map(a => a.trim()).filter(Boolean);
  const faculty = (lab.faculty || lab.pi_name || "").split(",").map(n => n.trim()).filter(Boolean);
  const courses = (lab.courses || "").split(",").map(c => c.trim()).filter(Boolean);
  const publications = parseLines(lab.publications);
  const news = parseLines(lab.news);
  const currentStudents = parseLines(lab.current_students);
  const alumni = parseLines(lab.alumni);
  const prerequisites = (lab.prerequisites || "").split(",").map(p => p.trim()).filter(Boolean);
  const isRecruiting = lab.recruiting_undergrad || lab.recruiting_phd;
  const heroGradient = getHeaderGradient(areas);

  return (
    <div className="ld-root">
      <style>{style}</style>

      {/* Back */}
      <div className="ld-back">
        <button className="ld-back-btn" onClick={() => navigate("/labs")}>
          <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to Roster
        </button>
      </div>

      {/* ── 1. Hero / Profile ── */}
      <div className="ld-hero" style={{ background: heroGradient }}>
        <div className="ld-hero-inner">
          <div className="ld-hero-top">
            <div className="ld-avatar">
              {photoUrl
                ? <img src={photoUrl} alt={lab.pi_name} />
                : lab.pi_name?.charAt(0).toUpperCase()}
            </div>
            <div className="ld-hero-info">
              <div className="ld-hero-badges">
                {lab.recruiting_undergrad && <span className="ld-recruit-badge undergrad">Undergrad Open</span>}
                {lab.recruiting_phd && <span className="ld-recruit-badge phd">PhD Open</span>}
                {!isRecruiting && <span className="ld-not-recruiting">Not Recruiting</span>}
              </div>
              <p className="ld-name">{lab.name}</p>
              <div className="ld-pi-row">
                {faculty.map((name, i) => (
                  <span key={i} className="ld-faculty-chip">
                    {name} <FacultyBadge dark />
                  </span>
                ))}
              </div>
              {lab.tagline && <p className="ld-tagline">{lab.tagline}</p>}
              <div className="ld-hero-links">
                {lab.website && (
                  <a href={lab.website} target="_blank" rel="noopener noreferrer" className="ld-hero-btn ld-hero-btn-primary">
                    Lab Website
                    <svg viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                  </a>
                )}
                {lab.pi_email && (
                  <a href={`mailto:${lab.pi_email}`} className="ld-hero-btn ld-hero-btn-ghost">
                    <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
                    Contact
                  </a>
                )}
                {lab.google_scholar && (
                  <a href={lab.google_scholar} target="_blank" rel="noopener noreferrer" className="ld-hero-btn ld-hero-btn-ghost">
                    <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    Scholar
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ld-body">
        <div className="ld-main">

          {/* ── 2. Research & Projects ── */}
          <div className="ld-card" style={{ animationDelay: "0.05s" }}>
            <div className="ld-card-header">
              <div className="ld-card-icon" style={{ background: "#EEF4FF", color: "#3B6FE0" }}>
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
              </div>
              <span className="ld-card-title">Research & Projects</span>
            </div>
            {areas.length > 0 && (
              <div className="ld-areas">
                {areas.map(area => {
                  const areaObj = RESEARCH_AREAS.find(r => r.label.toLowerCase() === area.toLowerCase());
                  const color = areaObj?.color ?? "#6B7280";
                  return (
                    <Link key={area} to={`/labs`} className="ld-area-chip"
                      style={{ background: `${color}18`, borderColor: `${color}40`, color }}>
                      <span className="ld-area-dot" style={{ background: color }} />
                      {area}
                    </Link>
                  );
                })}
              </div>
            )}
            {lab.research_summary
              ? <p className="ld-desc">{lab.research_summary}</p>
              : <p className="ld-section-empty">Research summary coming soon.</p>}
          </div>

          {/* ── 3. Publications & News ── */}
          <div className="ld-card" style={{ animationDelay: "0.08s" }}>
            <div className="ld-card-header">
              <div className="ld-card-icon" style={{ background: "#F0FFF4", color: "#2E8B57" }}>
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <span className="ld-card-title">Publications & News</span>
            </div>
            {publications.length > 0 ? (
              <div className="ld-pub-list" style={{ marginBottom: news.length > 0 ? 20 : 0 }}>
                {publications.map((pub, i) => {
                  const urlMatch = pub.match(/https?:\/\/\S+/);
                  const url = urlMatch?.[0];
                  const text = url ? pub.replace(url, "").trim() : pub;
                  return (
                    <div key={i} className="ld-pub-item">
                      <p className="ld-pub-title">
                        {url ? <a href={url} target="_blank" rel="noopener noreferrer">{text || url}</a> : text}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="ld-section-empty" style={{ marginBottom: news.length > 0 ? 16 : 0 }}>No publications listed yet.</p>
            )}
            {news.length > 0 && (
              <>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>Lab News</p>
                <div className="ld-news-list">
                  {news.map((item, i) => <div key={i} className="ld-news-item">{item}</div>)}
                </div>
              </>
            )}
          </div>

          {/* ── 4. Teaching ── */}
          <div className="ld-card" style={{ animationDelay: "0.11s" }}>
            <div className="ld-card-header">
              <div className="ld-card-icon" style={{ background: "#FFF8EE", color: "#E07B20" }}>
                <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <span className="ld-card-title">Teaching</span>
            </div>
            {courses.length > 0 ? (
              <div className="ld-course-list">
                {courses.map((c, i) => <span key={i} className="ld-course-chip">{c}</span>)}
              </div>
            ) : (
              <p className="ld-section-empty">No courses listed yet.</p>
            )}
          </div>

          {/* ── 5. Students & Alumni ── */}
          <div className="ld-card" style={{ animationDelay: "0.14s" }}>
            <div className="ld-card-header">
              <div className="ld-card-icon" style={{ background: "#F5F0FF", color: "#7B3FE4" }}>
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <span className="ld-card-title">Students & Alumni</span>
            </div>
            {currentStudents.length > 0 && (
              <>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>Current Members</p>
                <div className="ld-student-list" style={{ marginBottom: alumni.length > 0 ? 20 : 0 }}>
                  {currentStudents.map((s, i) => {
                    const [name, ...rest] = s.split("|");
                    return (
                      <div key={i} className="ld-student-row">
                        <div className="ld-student-avatar">{name.trim().charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="ld-student-name">{name.trim()}</p>
                          {rest.length > 0 && <p className="ld-student-role">{rest.join("|").trim()}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {alumni.length > 0 && (
              <>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>Notable Alumni</p>
                <div className="ld-alumni-list">
                  {alumni.map((a, i) => {
                    const [name, ...rest] = a.split("|");
                    return (
                      <div key={i} className="ld-alumni-row">
                        <div className="ld-alumni-icon">
                          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <div>
                          <p className="ld-alumni-name">{name.trim()}</p>
                          {rest.length > 0 && <p className="ld-alumni-dest">First employment: {rest.join("|").trim()}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {currentStudents.length === 0 && alumni.length === 0 && (
              <p className="ld-section-empty">Student info coming soon.</p>
            )}
          </div>

        </div>

        {/* ── Sidebar ── */}
        <div className="ld-sidebar">

          {/* ── 7. Recruiting CTA ── */}
          <div className="ld-cta-card" style={{ animationDelay: "0.05s" }}>
            <div className="ld-cta-header">
              <p className="ld-cta-eyebrow">Recruiting</p>
              <p className="ld-cta-title">{isRecruiting ? "Accepting Applications" : "Not Currently Recruiting"}</p>
              <div className="ld-cta-status-row">
                <span className={`ld-cta-badge ${lab.recruiting_undergrad ? "open-undergrad" : "closed"}`}>
                  Undergrad {lab.recruiting_undergrad ? "Open" : "Closed"}
                </span>
                <span className={`ld-cta-badge ${lab.recruiting_phd ? "open-phd" : "closed"}`}>
                  PhD {lab.recruiting_phd ? "Open" : "Closed"}
                </span>
              </div>
            </div>
            <div className="ld-cta-body">
              {prerequisites.length > 0 && (
                <div>
                  <p className="ld-cta-section-label">Prerequisites</p>
                  <div className="ld-cta-prereq-list">
                    {prerequisites.map((p, i) => <span key={i} className="ld-cta-prereq">{p}</span>)}
                  </div>
                </div>
              )}
              {lab.apply_instructions && (
                <div>
                  <p className="ld-cta-section-label">How to Apply</p>
                  <p className="ld-cta-text">{lab.apply_instructions}</p>
                </div>
              )}
              {!lab.apply_instructions && !prerequisites.length && (
                <p className="ld-cta-text" style={{ opacity: 0.5 }}>Application details coming soon.</p>
              )}
              {isRecruiting && lab.pi_email && (
                <a href={`mailto:${lab.pi_email}`} className="ld-apply-btn" style={{ textAlign: "center", display: "block" }}>
                  Apply Now →
                </a>
              )}
            </div>
          </div>

          {/* ── 6. Contact & Links ── */}
          <div className="ld-card" style={{ animationDelay: "0.08s", padding: "20px 24px" }}>
            <div className="ld-card-header" style={{ marginBottom: 12 }}>
              <div className="ld-card-icon" style={{ background: "#FFF0F0", color: "var(--red)" }}>
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <span className="ld-card-title">Contact & Links</span>
            </div>
            <div>
              {lab.pi_email && (
                <div className="ld-info-link-row">
                  <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
                  <a href={`mailto:${lab.pi_email}`}>{lab.pi_email}</a>
                </div>
              )}
              {lab.office && (
                <div className="ld-info-link-row">
                  <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <a href="#">{lab.office}</a>
                </div>
              )}
              {lab.website && (
                <div className="ld-info-link-row">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
                  <a href={lab.website} target="_blank" rel="noopener noreferrer">{lab.website.replace(/^https?:\/\//, "")}</a>
                </div>
              )}
              {lab.google_scholar && (
                <div className="ld-info-link-row">
                  <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  <a href={lab.google_scholar} target="_blank" rel="noopener noreferrer">Google Scholar</a>
                </div>
              )}
              {!lab.pi_email && !lab.office && !lab.website && !lab.google_scholar && (
                <p className="ld-section-empty">Contact info coming soon.</p>
              )}
            </div>
          </div>

          {/* Lab Info */}
          <div className="ld-card" style={{ animationDelay: "0.11s" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>Lab Info</p>
            <div className="ld-info-grid">
              <div className="ld-info-item">
                <span className="ld-info-label">Department</span>
                <span className="ld-info-val">{lab.department}</span>
              </div>
              <div className="ld-info-item">
                <span className="ld-info-label">Faculty</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 2 }}>
                  {faculty.map((name, i) => (
                    <span key={i} className="ld-info-val">
                      {name} <FacultyBadge label="Faculty" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
