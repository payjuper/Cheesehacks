// src/Layout.jsx
import { Outlet, NavLink } from "react-router-dom";

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

  html, body {
    width: 100%;
    overflow-x: hidden;
  }

  body {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    min-height: 100vh;
  }

  .app-root {
    display: flex;
    min-height: 100vh;
  }

  .main {
    margin-left: var(--sidebar-w);
    flex: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Sidebar */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--red);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 28px 0;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 100;
  }

  .sidebar-logo {
    width: 34px;
    height: 34px;
    border: 2px solid rgba(255,255,255,0.5);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    color: #fff;
    user-select: none;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .nav-btn {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: rgba(255,255,255,0.12);
    border: 1.5px solid rgba(255,255,255,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    text-decoration: none;
    color: #fff;
    position: relative;
  }

  .nav-btn:hover {
    background: rgba(255,255,255,0.26);
    transform: scale(1.07);
  }

  .nav-btn.active {
    background: rgba(255,255,255,0.28);
    border-color: rgba(255,255,255,0.5);
  }

  .nav-btn svg {
    width: 18px;
    height: 18px;
    stroke: #fff;
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .tooltip {
    position: absolute;
    left: calc(100% + 14px);
    background: #111;
    color: #fff;
    font-size: 11px;
    padding: 5px 10px;
    border-radius: 6px;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.18s, transform 0.18s;
    pointer-events: none;
  }

  .nav-btn:hover .tooltip {
    opacity: 1;
    transform: translateX(0);
  }

  .tooltip::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: #111;
  }
`;

function Sidebar() {
  const navClass = ({ isActive }) =>
    `nav-btn${isActive ? " active" : ""}`;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">P</div>

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

        <NavLink to="/new" className={navClass}>
          <svg viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="tooltip">New Project</span>
        </NavLink>
      </nav>

      <div style={{ height: 42 }} />
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