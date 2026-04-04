import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
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
  .labs-root { margin-left: var(--sidebar-w); min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  /* ── Banner ─────────────────────────────────── */
  .labs-banner {
    background: var(--court); padding: 36px 48px 32px;
    position: relative; overflow: hidden;
  }
  .labs-banner::before {
    content: ''; position: absolute; top: -40px; right: -60px;
    width: 280px; height: 280px; border-radius: 50%;
    border: 2px solid rgba(225,65,65,0.18); pointer-events: none;
  }
  .labs-banner::after {
    content: ''; position: absolute; bottom: -60px; right: 80px;
    width: 180px; height: 180px; border-radius: 50%;
    border: 1.5px solid rgba(225,65,65,0.10); pointer-events: none;
  }
  .labs-banner-inner { position: relative; z-index: 1; }
  .labs-banner-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--red); margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .labs-banner-eyebrow::before { content: ''; width: 24px; height: 2px; background: var(--red); display: inline-block; }
  .labs-banner h1 { font-family: 'Syne', sans-serif; font-size: 38px; font-weight: 700; letter-spacing: -0.03em; color: #fff; line-height: 1; }
  .labs-banner h1 span { color: var(--red); }
  .labs-banner-sub { margin-top: 8px; font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.45); max-width: 420px; line-height: 1.6; }
  .labs-banner-stats { display: flex; gap: 32px; margin-top: 24px; }
  .banner-stat { display: flex; flex-direction: column; gap: 3px; }
  .banner-stat-num { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #fff; }
  .banner-stat-label { font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.4); }

  /* ── Controls row ───────────────────────────── */
  .labs-controls {
    padding: 20px 48px 0;
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .recruit-toggle-group { display: flex; background: var(--card); border: 1.5px solid var(--border); border-radius: 12px; overflow: hidden; }
  .recruit-toggle {
    padding: 8px 16px; font-size: 12px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase;
    background: none; border: none; cursor: pointer;
    color: var(--muted); transition: all 0.18s; white-space: nowrap;
  }
  .recruit-toggle + .recruit-toggle { border-left: 1.5px solid var(--border); }
  .recruit-toggle.active         { background: var(--court); color: #fff; }
  .recruit-toggle.active.undergrad { background: #3B6FE0; color: #fff; }
  .recruit-toggle.active.phd       { background: #7B3FE4; color: #fff; }

  .search-wrap { position: relative; display: flex; align-items: center; }
  .search-wrap svg { position: absolute; left: 12px; width: 14px; height: 14px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
  .labs-search { padding: 8px 14px 8px 34px; border: 1.5px solid var(--border); border-radius: 10px; background: var(--card); font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); outline: none; width: 240px; transition: border-color 0.18s; }
  .labs-search:focus { border-color: #bbb; }
  .labs-search::placeholder { color: var(--muted); }
  .result-count { font-size: 12px; color: var(--muted); margin-left: auto; }
  .result-count span { color: var(--text); font-weight: 600; }

  /* ── Research area filter pills ─────────────── */
  .area-filter-row {
    padding: 12px 48px 0;
    display: flex; gap: 7px;
    flex-wrap: wrap;
  }

  .area-pill {
    flex-shrink: 0;
    font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
    padding: 6px 13px; border-radius: 100px;
    border: 1.5px solid var(--border);
    background: var(--card); color: var(--muted);
    cursor: pointer; transition: all 0.18s; user-select: none;
    white-space: nowrap;
  }
  .area-pill:hover { border-color: #bbb; color: var(--text); }
  .area-pill.active { color: #fff; border-color: transparent; }

  /* ── Grid ───────────────────────────────────── */
  .labs-grid {
    padding: 20px 48px 80px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }
  @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Roster card ────────────────────────────── */
  .lab-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
    animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; flex-direction: column;
    text-decoration: none; color: inherit; cursor: pointer;
  }
  .lab-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.10); transform: translateY(-3px); border-color: #d8d4ce; }
  .lab-card:hover .lab-name { color: var(--red); }

  .lab-card-header {
    background: var(--court); padding: 18px 20px 14px;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
    position: relative; overflow: hidden;
  }
  .lab-card-header::before {
    content: ''; position: absolute; inset: 0;
    background: repeating-linear-gradient(-55deg, transparent, transparent 12px, rgba(255,255,255,0.02) 12px, rgba(255,255,255,0.02) 13px);
    pointer-events: none;
  }
  .lab-jersey {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.15); border: 2.5px solid rgba(255,255,255,0.35);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700;
    color: #fff; flex-shrink: 0; position: relative; z-index: 1;
    text-transform: uppercase; overflow: hidden;
  }
  .lab-jersey img { width: 100%; height: 100%; object-fit: cover; }
  .lab-recruit-badges { display: flex; flex-direction: column; gap: 5px; align-items: flex-end; position: relative; z-index: 1; }
  .recruit-badge {
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; padding: 3px 8px; border-radius: 6px; white-space: nowrap;
  }
  .recruit-badge.undergrad { background: rgba(59,111,224,0.25); color: #88AAFF; border: 1px solid rgba(59,111,224,0.3); }
  .recruit-badge.phd       { background: rgba(123,63,228,0.25); color: #C4A0FF; border: 1px solid rgba(123,63,228,0.3); }
  .no-recruit-badge {
    font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 6px;
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.1);
  }

  .lab-card-body { padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .lab-name {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: -0.01em; line-height: 1.25; color: var(--text);
    transition: color 0.18s;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .prof-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: -0.01em; color: var(--text); transition: color 0.18s; line-height: 1.2; }
  .prof-title { font-size: 11px; font-weight: 400; color: var(--muted); margin-top: 3px; }
  .lab-dept { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; color: var(--muted); }
  .lab-dept svg { width: 12px; height: 12px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; flex-shrink: 0; }
  .lab-desc { font-size: 12px; font-weight: 300; line-height: 1.65; color: #777; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

  .lab-areas { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px; }
  .area-tag {
    font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
    text-transform: uppercase; padding: 4px 9px; border-radius: 7px;
    border: 1.5px solid transparent;
  }
  .area-tag.active-area { color: #fff !important; border-color: transparent !important; }

  .lab-card-footer { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .lab-go-btn { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500; color: var(--muted); }
  .lab-go-btn svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: transform 0.18s; }
  .lab-card:hover .lab-go-btn { color: var(--red); }
  .lab-card:hover .lab-go-btn svg { transform: translateX(3px); }

  /* ── Empty / Loading ────────────────────────── */
  .labs-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; gap: 12px; color: var(--muted); font-size: 14px; font-weight: 300; }
  .labs-empty svg { width: 36px; height: 36px; stroke: #ccc; fill: none; stroke-width: 1.5; stroke-linecap: round; }
  .labs-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; color: var(--muted); font-size: 14px; }

  @media (max-width: 680px) {
    .labs-banner, .labs-controls, .area-filter-row { padding-left: 16px; padding-right: 16px; }
    .labs-grid { padding: 16px 16px 80px; grid-template-columns: 1fr; }
    .labs-banner h1 { font-size: 28px; }
  }
`;

export const RESEARCH_AREAS = [
  { label: "Computer Architecture",                     color: "#F59E0B" },
  { label: "Computer Vision",                           color: "#0284C7" },
  { label: "Data Science",                              color: "#3B6FE0" },
  { label: "Database Systems",                          color: "#E07B20" },
  { label: "Graphics / Visual Computing",               color: "#7B3FE4" },
  { label: "Human-Computer Interaction",                color: "#D946EF" },
  { label: "Machine Learning",                          color: "#2E8B57" },
  { label: "Networks",                                  color: "#0891B2" },
  { label: "Optimization",                              color: "#B45309" },
  { label: "Programming Languages and Software Engineering", color: "#4F46E5" },
  { label: "Quantum Computing",                         color: "#BE185D" },
  { label: "Robotics",                                  color: "#E14141" },
  { label: "Security and Privacy",                      color: "#DC2626" },
  { label: "Systems",                                   color: "#374151" },
  { label: "Theory",                                    color: "#047857" },
];

// Build a deduplicated professor list from all labs
function buildProfessors(labs) {
  const map = {};
  labs.forEach(lab => {
    const areas = (lab.research_areas || "").split(",").map(a => a.trim()).filter(Boolean);
    (lab.faculty || lab.pi_name || "").split(",").map(n => n.trim()).filter(Boolean).forEach(name => {
      if (!map[name]) map[name] = { areas: new Set(), labIds: [] };
      areas.forEach(a => map[name].areas.add(a));
      map[name].labIds.push(lab.id);
    });
  });
  return Object.entries(map)
    .map(([name, { areas, labIds }]) => ({ name, areas: [...areas], primaryLabId: labIds[0] }))
    .sort((a, b) => a.name.split(" ").pop().localeCompare(b.name.split(" ").pop()));
}

export default function LabsPage() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeArea, setActiveArea] = useState(null);
  const [search, setSearch] = useState("");
  const [photoMap, setPhotoMap] = useState({});

  useEffect(() => {
    Promise.all([
      supabase.from("labs").select("*"),
      supabase.from("professors").select("name, photo_url"),
    ]).then(([labsRes, profsRes]) => {
      if (!labsRes.error) setLabs(labsRes.data || []);
      if (!profsRes.error) {
        const map = {};
        (profsRes.data || []).forEach(p => { map[p.name] = p.photo_url; });
        setPhotoMap(map);
      }
      setLoading(false);
    });
  }, []);

  const allProfessors = buildProfessors(labs).map(p => ({ ...p, photo_url: photoMap[p.name] || null }));

  const filtered = allProfessors.filter(prof => {
    if (activeArea && !prof.areas.some(a => a.toLowerCase() === activeArea.toLowerCase())) return false;
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      prof.name.toLowerCase().includes(q) ||
      prof.areas.some(a => a.toLowerCase().includes(q))
    );
  });

  if (loading) return (
    <div className="labs-root">
      <style>{style}</style>
      <div className="labs-loading">Loading roster…</div>
    </div>
  );

  return (
    <div className="labs-root">
      <style>{style}</style>

      {/* Banner */}
      <div className="labs-banner">
        <div className="labs-banner-inner">
          <div className="labs-banner-eyebrow">CS Research</div>
          <h1>Faculty <span>Roster</span></h1>
          <p className="labs-banner-sub">Browse CS faculty by research area. Find your research home.</p>
          <div className="labs-banner-stats">
            <div className="banner-stat">
              <span className="banner-stat-num">{allProfessors.length}</span>
              <span className="banner-stat-label">Professors</span>
            </div>
            <div className="banner-stat">
              <span className="banner-stat-num">{labs.length}</span>
              <span className="banner-stat-label">Research Groups</span>
            </div>
            <div className="banner-stat">
              <span className="banner-stat-num">{RESEARCH_AREAS.length}</span>
              <span className="banner-stat-label">Areas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="labs-controls">
        <div className="search-wrap">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="labs-search"
            type="text"
            placeholder="Search professor or area…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <p className="result-count"><span>{filtered.length}</span> professors</p>
      </div>

      {/* Research area pills */}
      <div className="area-filter-row">
        <button
          className={`area-pill${!activeArea ? " active" : ""}`}
          style={!activeArea ? { background: "#1A1A2E", borderColor: "#1A1A2E" } : {}}
          onClick={() => setActiveArea(null)}
        >
          All Areas
        </button>
        {RESEARCH_AREAS.map(area => {
          const isActive = activeArea === area.label;
          return (
            <button
              key={area.label}
              className={`area-pill${isActive ? " active" : ""}`}
              style={isActive ? { background: area.color, borderColor: area.color } : {}}
              onClick={() => setActiveArea(isActive ? null : area.label)}
            >
              {area.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="labs-grid">
        {filtered.length === 0 ? (
          <div className="labs-empty" style={{ gridColumn: "1 / -1" }}>
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span>No professors match your filter.</span>
          </div>
        ) : (
          filtered.map((prof, i) => (
            <ProfessorCard key={prof.name} prof={prof} animDelay={0.03 + i * 0.03} activeArea={activeArea} />
          ))
        )}
      </div>
    </div>
  );
}

function getAreaColors(areas) {
  return areas.map(area => {
    const areaObj = RESEARCH_AREAS.find(r => r.label.toLowerCase() === area.toLowerCase());
    return areaObj?.color ?? "#888";
  });
}

function getHeaderStyle(areas) {
  const colors = getAreaColors(areas);
  if (colors.length === 0) return { background: "#1A1A2E" };
  if (colors.length === 1) return { background: colors[0] };
  const step = 100 / (colors.length - 1);
  const stops = colors.map((c, i) => `${c} ${Math.round(i * step)}%`).join(", ");
  return { background: `linear-gradient(135deg, ${stops})` };
}

function ProfessorCard({ prof, animDelay, activeArea }) {
  const initial = prof.name.charAt(0).toUpperCase();
  const headerStyle = getHeaderStyle(prof.areas);

  return (
    <Link to={`/labs/${prof.primaryLabId}`} className="lab-card" style={{ animationDelay: `${animDelay}s` }}>
      <div className="lab-card-header" style={headerStyle}>
        <div className="lab-jersey">
          {prof.photo_url
            ? <img src={prof.photo_url} alt={prof.name} />
            : initial}
        </div>
        <div className="lab-recruit-badges">
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", whiteSpace: "nowrap" }}>
            Professor
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 400, marginTop: 2 }}>Computer Sciences</span>
        </div>
      </div>

      <div className="lab-card-body">
        <div>
          <p className="prof-name">{prof.name}</p>
          <p className="prof-title">UW–Madison</p>
        </div>

        {prof.areas.length > 0 && (
          <div className="lab-areas">
            {prof.areas.map(area => {
              const areaObj = RESEARCH_AREAS.find(r => r.label.toLowerCase() === area.toLowerCase());
              const color = areaObj?.color ?? "#888";
              const isActive = activeArea && area.toLowerCase() === activeArea.toLowerCase();
              return (
                <span
                  key={area}
                  className={`area-tag${isActive ? " active-area" : ""}`}
                  style={isActive
                    ? { background: color, color: "#fff", borderColor: color }
                    : { background: `${color}18`, color: color, borderColor: `${color}45` }
                  }
                >
                  {area}
                </span>
              );
            })}
          </div>
        )}

        <div className="lab-card-footer">
          <div className="lab-go-btn">
            View Lab
            <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
