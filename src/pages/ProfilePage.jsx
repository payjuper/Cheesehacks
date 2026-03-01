import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

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

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  .pp-root { margin-left: var(--sidebar-w); min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }

  /* ── Header banner ── */
  .pp-banner {
    height: 160px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1f1f1f 100%);
    position: relative; overflow: hidden;
  }
  .pp-banner::before {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 40px,
      rgba(255,255,255,0.02) 40px,
      rgba(255,255,255,0.02) 41px
    );
  }
  .pp-banner-accent {
    position: absolute; bottom: -40px; right: -40px;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(225,65,65,0.18) 0%, transparent 70%);
  }

  /* ── Profile header ── */
  .pp-header { padding: 0 48px; position: relative; }
  .pp-avatar-wrap {
    position: relative; display: inline-block;
    margin-top: -44px; margin-bottom: 16px;
    animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  .pp-avatar {
    width: 88px; height: 88px; border-radius: 50%;
    border: 4px solid var(--bg);
    background: linear-gradient(135deg, #E14141, #ff8c8c);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800;
    color: #fff; overflow: hidden; flex-shrink: 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  }
  .pp-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .pp-identity { animation: rise 0.5s 0.05s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-name { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; }
  .pp-email { font-size: 13px; font-weight: 300; color: var(--muted); margin-top: 4px; }

  .pp-actions {
    display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;
    animation: rise 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both;
  }
  .pp-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 100px; font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.18s;
    text-decoration: none;
  }
  .pp-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .pp-btn-outline { border: 1.5px solid var(--border); background: var(--card); color: var(--muted); }
  .pp-btn-outline:hover { border-color: #bbb; color: var(--text); }
  .pp-btn-red { border: none; background: var(--red); color: #fff; box-shadow: 0 2px 10px rgba(225,65,65,0.28); }
  .pp-btn-red:hover { background: #d03232; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(225,65,65,0.36); }

  .pp-divider { height: 1px; background: var(--border); margin: 24px 48px 0; }

  /* ── Body layout ── */
  .pp-body { display: grid; grid-template-columns: 260px 1fr; gap: 24px; padding: 24px 48px 80px; }

  /* ── Sidebar ── */
  .pp-sidebar { display: flex; flex-direction: column; gap: 16px; }

  .pp-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  .pp-card-header {
    padding: 16px 20px 12px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 8px;
  }
  .pp-card-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; letter-spacing: -0.01em; }
  .pp-card-body { padding: 16px 20px; }

  /* ── Stats ── */
  .pp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pp-stat {
    background: var(--bg); border-radius: 12px; padding: 12px 14px;
    border: 1px solid var(--border);
  }
  .pp-stat-num { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; line-height: 1; }
  .pp-stat-label { font-size: 10px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }

  /* ── Tech stack ── */
  .pp-tech-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .pp-tech-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 11px; border-radius: 9px;
    border: 1.5px solid var(--border); background: var(--bg);
    font-size: 11px; font-weight: 500; transition: border-color 0.18s;
  }
  .pp-tech-chip:hover { border-color: #ccc; }
  .pp-tech-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

  .pp-empty-tech { font-size: 12px; color: var(--muted); font-weight: 300; }

  /* ── Main content ── */
  .pp-main { display: flex; flex-direction: column; gap: 16px; }

  /* ── Project cards ── */
  .pp-proj-list { display: flex; flex-direction: column; gap: 10px; }

  .pp-proj-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 18px 20px;
    display: flex; align-items: center; gap: 16px;
    text-decoration: none; color: inherit;
    transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
    animation: rise 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }
  .pp-proj-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); border-color: #d8d4ce; transform: translateY(-2px); }
  .pp-proj-card:hover .pp-proj-title { color: var(--red); }

  .pp-proj-img {
    width: 56px; height: 56px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, #f0ede9, #e8e4df);
    overflow: hidden; border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }
  .pp-proj-img img { width: 100%; height: 100%; object-fit: cover; }
  .pp-proj-img svg { width: 20px; height: 20px; stroke: #ccc; fill: none; stroke-width: 1.5; }

  .pp-proj-info { flex: 1; min-width: 0; }
  .pp-proj-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: -0.01em; transition: color 0.18s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pp-proj-desc { font-size: 12px; font-weight: 300; color: var(--muted); line-height: 1.5; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .pp-proj-tags { display: flex; gap: 5px; margin-top: 8px; flex-wrap: wrap; }
  .pp-proj-tag { font-size: 10px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; padding: 3px 9px; border-radius: 100px; border: 1.5px solid transparent; }
  .tag-ai   { background: #FFF0F0; color: #E14141; border-color: #F5C6C6; }
  .tag-data { background: #EEF4FF; color: #3B6FE0; border-color: #C3D5F8; }
  .tag-ml   { background: #F0FFF4; color: #2E8B57; border-color: #B2DFC0; }
  .tag-web  { background: #FFF8EE; color: #E07B20; border-color: #F5D9B0; }
  .tag-sec  { background: #F5F0FF; color: #7B3FE4; border-color: #D4B8F8; }
  .tag-iot  { background: #F0F9FF; color: #0284C7; border-color: #BAE6FD; }

  .pp-proj-arrow { color: var(--muted); flex-shrink: 0; }
  .pp-proj-arrow svg { width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: transform 0.18s; }
  .pp-proj-card:hover .pp-proj-arrow svg { transform: translateX(3px); color: var(--red); }

  .pp-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 48px 0; gap: 10px; color: var(--muted); font-size: 13px; font-weight: 300;
    background: var(--card); border: 1px solid var(--border); border-radius: 18px;
  }
  .pp-empty svg { width: 32px; height: 32px; stroke: #ddd; fill: none; stroke-width: 1.5; }

  .pp-loading { display: flex; align-items: center; justify-content: center; padding: 80px 0; color: var(--muted); font-size: 13px; }

  @media (max-width: 860px) {
    .pp-body { grid-template-columns: 1fr; }
    .pp-header, .pp-divider { padding-left: 16px; padding-right: 16px; }
    .pp-body { padding-left: 16px; padding-right: 16px; }
  }
`;

const TAG_CLASS = {
  AI: "tag-ai", ML: "tag-ml", "Data Science": "tag-data",
  Web: "tag-web", Security: "tag-sec", IoT: "tag-iot",
};

const TECH_COLORS = {
  python: "#3572A5", react: "#61DAFB", nodejs: "#539E43",
  fastapi: "#009688", tensorflow: "#FF6F00", pytorch: "#EE4C2C",
  docker: "#2496ED", pandas: "#150458", postgres: "#336791",
  mongodb: "#47A248", typescript: "#3178C6", rust: "#DEA584",
  go: "#00ACD7", vue: "#42B883", nextjs: "#555", graphql: "#E10098",
};

export default function ProfilePage() {
  const [user, setUser]       = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("lead", user.email)
          .order("created_at", { ascending: false });
        setProjects(data ?? []);
      }

      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="pp-loading"><style>{style}</style>Loading...</div>;
  if (!user) return <div className="pp-loading"><style>{style}</style>Not logged in.</div>;

  const initials = user.email.slice(0, 2).toUpperCase();
  const displayName = user.user_metadata?.full_name ?? user.email.split("@")[0];
  const avatarUrl = user.user_metadata?.avatar_url;

  // Collect all unique tech from their projects
  const allTech = [...new Set(
    projects.flatMap(p => (p.stack ?? []).map(s => s.name))
  )];

  return (
    <div className="pp-root">
      <style>{style}</style>

      {/* Banner */}
      <div className="pp-banner">
        <div className="pp-banner-accent" />
      </div>

      {/* Header */}
      <div className="pp-header">
        <div className="pp-avatar-wrap">
          <div className="pp-avatar">
            {avatarUrl ? <img src={avatarUrl} alt={displayName} /> : initials}
          </div>
        </div>

        <div className="pp-identity">
          <div className="pp-name">{displayName}</div>
          <div className="pp-email">{user.email}</div>
        </div>

        <div className="pp-actions">
          <a className="pp-btn pp-btn-outline" href={`mailto:${user.email}`}>
            <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
            Email
          </a>
          <button className="pp-btn pp-btn-red">
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Profile
          </button>
        </div>
      </div>

      <div className="pp-divider" />

      {/* Body */}
      <div className="pp-body">

        {/* Sidebar */}
        <div className="pp-sidebar">

          {/* Stats */}
          <div className="pp-card" style={{ animationDelay: "0.05s" }}>
            <div className="pp-card-header">
              <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span className="pp-card-title">Overview</span>
            </div>
            <div className="pp-card-body">
              <div className="pp-stats">
                <div className="pp-stat">
                  <div className="pp-stat-num">{projects.length}</div>
                  <div className="pp-stat-label">Projects</div>
                </div>
                <div className="pp-stat">
                  <div className="pp-stat-num">{allTech.length}</div>
                  <div className="pp-stat-label">Technologies</div>
                </div>
                <div className="pp-stat">
                  <div className="pp-stat-num">
                    {[...new Set(projects.flatMap(p => p.tags ?? []))].length}
                  </div>
                  <div className="pp-stat-label">Categories</div>
                </div>
                <div className="pp-stat">
                  <div className="pp-stat-num">
                    {projects.reduce((acc, p) => acc + (p.contributors?.length ?? 0), 0)}
                  </div>
                  <div className="pp-stat-label">Collabs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="pp-card" style={{ animationDelay: "0.1s" }}>
            <div className="pp-card-header">
              <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              <span className="pp-card-title">Tech Stack</span>
            </div>
            <div className="pp-card-body">
              {allTech.length > 0 ? (
                <div className="pp-tech-grid">
                  {allTech.map(name => (
                    <div key={name} className="pp-tech-chip">
                      <span
                        className="pp-tech-dot"
                        style={{ background: TECH_COLORS[name.toLowerCase()] ?? "#999" }}
                      />
                      {name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pp-empty-tech">No technologies yet — create a project to get started.</p>
              )}
            </div>
          </div>

        </div>

        {/* Main — Projects */}
        <div className="pp-main">
          <div className="pp-card" style={{ animationDelay: "0.08s" }}>
            <div className="pp-card-header">
              <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <span className="pp-card-title">Projects</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{projects.length} total</span>
            </div>
            <div className="pp-card-body" style={{ padding: "12px 16px" }}>
              {projects.length === 0 ? (
                <div className="pp-empty">
                  <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  <span>No projects yet. Hit the + button to create one.</span>
                </div>
              ) : (
                <div className="pp-proj-list">
                  {projects.map((p, i) => (
                    <a
                      key={p.id}
                      href={`/project/${p.id}`}
                      className="pp-proj-card"
                      style={{ animationDelay: `${0.1 + i * 0.04}s` }}
                    >
                      <div className="pp-proj-img">
                        {(p.images ?? [])[0]
                          ? <img src={p.images[0]} alt={p.title} />
                          : <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        }
                      </div>
                      <div className="pp-proj-info">
                        <div className="pp-proj-title">{p.title}</div>
                        {p.description && <div className="pp-proj-desc">{p.description}</div>}
                        {(p.tags ?? []).length > 0 && (
                          <div className="pp-proj-tags">
                            {p.tags.slice(0, 3).map(tag => (
                              <span key={tag} className={`pp-proj-tag ${TAG_CLASS[tag] ?? ""}`}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="pp-proj-arrow">
                        <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
