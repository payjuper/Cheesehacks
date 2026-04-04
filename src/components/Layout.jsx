// src/Layout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red: #E14141;
    --bg: #F4F2EF;
    --text: #111111;
    --muted: #999990;
    --border: #E8E5E0;
    --sidebar-w: 64px;
  }

  html, body { width: 100%; overflow-x: hidden; }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }
  .app-root { display: flex; min-height: 100vh; }
  .main { margin-left: var(--sidebar-w); flex: 1; min-height: 100vh; display: flex; flex-direction: column; }

  .sidebar {
    width: var(--sidebar-w); background: var(--red);
    display: flex; flex-direction: column; align-items: center;
    justify-content: space-between; padding: 28px 0;
    position: fixed; top: 0; left: 0; height: 100vh; z-index: 100;
  }

  .sidebar-nav { display: flex; flex-direction: column; gap: 10px; align-items: center; }

  .nav-btn {
    width: 42px; height: 42px; border-radius: 10px;
    background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.18);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s, transform 0.15s;
    text-decoration: none; color: #fff; position: relative;
  }
  .nav-btn:hover { background: rgba(255,255,255,0.26); transform: scale(1.07); }
  .nav-btn.active { background: rgba(255,255,255,0.28); border-color: rgba(255,255,255,0.5); }
  .nav-btn svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

  .nav-btn-logout {
    width: 42px; height: 42px; border-radius: 10px;
    background: rgba(0,0,0,0.15); border: 1.5px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s, transform 0.15s;
    color: #fff; position: relative;
  }
  .nav-btn-logout:hover { background: rgba(0,0,0,0.3); transform: scale(1.07); }
  .nav-btn-logout svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

  .tooltip {
    position: absolute; left: calc(100% + 14px);
    background: #111; color: #fff; font-size: 11px;
    padding: 5px 10px; border-radius: 6px; white-space: nowrap;
    opacity: 0; transform: translateX(-6px);
    transition: opacity 0.18s, transform 0.18s; pointer-events: none;
  }
  .nav-btn:hover .tooltip,
  .nav-btn-logout:hover .tooltip { opacity: 1; transform: translateX(0); }
  .tooltip::before {
    content: ''; position: absolute; right: 100%; top: 50%; transform: translateY(-50%);
    border: 5px solid transparent; border-right-color: #111;
  }
`;

function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const navClass = ({ isActive }) => `nav-btn${isActive ? " active" : ""}`;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <img
        src="/src/assets/logo.png"
        alt="logo"
        style={{ width: 70, height: 70, objectFit: "contain", marginTop: -30 }}
      />

      <nav className="sidebar-nav">
        <NavLink to="/" end className={navClass}>
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span className="tooltip">Projects</span>
        </NavLink>

        <NavLink to="/labs" className={navClass}>
          <svg viewBox="0 0 24 24">
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
          </svg>
          <span className="tooltip">Labs</span>
        </NavLink>

        <NavLink to="/jobs" className={navClass}>
          <svg viewBox="0 0 24 24">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
          </svg>
          <span className="tooltip">Jobs</span>
        </NavLink>

        <NavLink to="/profile/me" className={navClass}>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span className="tooltip">Profile</span>
        </NavLink>
      </nav>

      {user ? (
        <button className="nav-btn-logout" onClick={handleLogout}>
          <svg viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="tooltip">Log Out</span>
        </button>
      ) : (
        <button className="nav-btn-logout" onClick={() => navigate("/login")}>
          <svg viewBox="0 0 24 24">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <span className="tooltip">Sign In</span>
        </button>
      )}
    </aside>
  );
}

export default function Layout() {
  return (
    <div className="app-root">
      <style>{style}</style>
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}