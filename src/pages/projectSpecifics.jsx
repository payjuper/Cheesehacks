import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red: #E14141;
    --red-light: #FFF0F0;
    --bg: #F4F2EF;
    --card: #FFFFFF;
    --text: #111111;
    --muted: #999990;
    --border: #E8E5E0;
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; }

  @keyframes rise {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rise { animation: rise 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .rise-1 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .rise-2 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.10s both; }
  .rise-3 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
  .rise-4 { animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) 0.20s both; }

  .stack-item:hover { border-color: #ccc !important; transform: translateY(-2px); }
  .role-card-hover:hover { border-color: #d0ccc6 !important; box-shadow: 0 4px 24px rgba(0,0,0,0.07) !important; transform: translateY(-3px); }
  .join-btn-base:hover:not(:disabled):not(.applied) { background: #E14141 !important; color: #fff !important; border-color: #E14141 !important; }
  .nav-btn-el:hover { background: rgba(255,255,255,0.26) !important; transform: scale(1.07); }
  .nav-btn-el:hover .nav-tooltip { opacity: 1 !important; transform: translateX(0) !important; pointer-events: auto !important; }
  .wishlist-base:hover { border-color: #E14141 !important; color: #E14141 !important; }
  .view-btn-el:hover { opacity: 0.88; transform: scale(1.02); }
`;

// ── Icons ──────────────────────────────────────────────
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);
const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill={filled ? "#E14141" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "fill 0.2s, transform 0.2s", transform: filled ? "scale(1.15)" : "scale(1)" }}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const PythonSvg = () => (
  <svg viewBox="0 0 24 24" width={20} height={20}>
    <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.89S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.031v-2.867s-.109-3.405 3.345-3.405h5.766s3.236.052 3.236-3.13V3.124S18.28 0 11.914 0zm-3.2 1.807a1.042 1.042 0 1 1 0 2.084 1.042 1.042 0 0 1 0-2.084z" fill="#3572A5"/>
    <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.131S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.031v2.867s.109 3.405-3.345 3.405H9.455s-3.236-.052-3.236 3.13v5.403S5.72 24 12.086 24zm3.2-1.807a1.042 1.042 0 1 1 0-2.084 1.042 1.042 0 0 1 0 2.084z" fill="#FFD43B"/>
  </svg>
);
const TFSvg = () => (
  <svg viewBox="0 0 24 24" width={20} height={20}>
    <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zm21.43 5.311l-.014-5.31L12.46 0v4.756l6.513 3.77v8.977l-6.513 3.764V24l9.262-5.388V11.167z" fill="#FF6F00"/>
  </svg>
);
const PandasSvg = () => (
  <svg viewBox="0 0 24 24" width={20} height={20}>
    <path d="M9.462 2.677h2.153v5.527H9.462zm0 7.027h2.153v5.527H9.462zm3.088-3.516h2.153v5.527h-2.153zm0 7.026h2.153v5.527h-2.153zm-6.175-3.51h2.153v5.527H6.375zM6.375 16.73h2.153v5.527H6.375z" fill="#150458"/>
  </svg>
);
const FastAPISvg = () => (
  <svg viewBox="0 0 24 24" width={20} height={20}>
    <path d="M12 0C5.375 0 0 5.375 0 12c0 6.624 5.375 12 12 12 6.624 0 12-5.376 12-12 0-6.625-5.376-12-12-12zm-.624 21.527v-7.778H6.724L13.101 2.47v7.778h4.651L11.376 21.53z" fill="#009688"/>
  </svg>
);
const DockerSvg = () => (
  <svg viewBox="0 0 24 24" width={20} height={20}>
    <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z" fill="#2496ED"/>
  </svg>
);

// ── Sidebar ────────────────────────────────────────────
function NavButton({ icon, label }) {
  return (
    <div className="nav-btn-el" style={{
      width: 42, height: 42, borderRadius: 10,
      background: "rgba(255,255,255,0.12)",
      border: "1.5px solid rgba(255,255,255,0.18)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "background 0.2s, transform 0.15s",
      position: "relative",
    }}>
      {icon}
      <span className="nav-tooltip" style={{
        position: "absolute", left: "calc(100% + 14px)",
        background: "#111", color: "#fff",
        fontSize: 11, padding: "5px 10px", borderRadius: 6,
        whiteSpace: "nowrap", opacity: 0, transform: "translateX(-6px)",
        transition: "opacity 0.18s, transform 0.18s", pointerEvents: "none",
      }}>
        {label}
        <span style={{
          position: "absolute", right: "100%", top: "50%",
          transform: "translateY(-50%)",
          borderWidth: 5, borderStyle: "solid",
          borderColor: "transparent #111 transparent transparent",
          display: "block",
        }}/>
      </span>
    </div>
  );
}

function Sidebar() {
  return (
    <aside style={{
      width: 64, background: "#E14141",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "space-between",
      padding: "28px 0",
      position: "fixed", top: 0, left: 0, height: "100vh",
      zIndex: 100,
    }}>
      <div style={{
        width: 34, height: 34,
        border: "2px solid rgba(255,255,255,0.5)", borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#fff",
        userSelect: "none",
      }}>P</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
        <NavButton icon={<HomeIcon />} label="Overview" />
        <NavButton icon={<ProfileIcon />} label="Profile" />
      </nav>
    </aside>
  );
}

// ── Stack item ─────────────────────────────────────────
function StackItem({ icon, name }) {
  return (
    <div className="stack-item" style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 15px", borderRadius: 12,
      border: "1.5px solid #E8E5E0",
      background: "#F4F2EF", fontSize: 13, fontWeight: 500,
      transition: "border-color 0.18s, transform 0.15s", cursor: "default",
    }}>
      <span style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
      {name}
    </div>
  );
}

// ── Role card ──────────────────────────────────────────
const roleColors = {
  fe:     { bg: "#EEF4FF", stroke: "#3B6FE0", dot: "#3B6FE0" },
  ml:     { bg: "#FFF0F0", stroke: "#E14141", dot: "#E14141" },
  ds:     { bg: "#F0FFF4", stroke: "#2E8B57", dot: "#2E8B57" },
  ux:     { bg: "#FFF8EE", stroke: "#E07B20", dot: "#E07B20" },
};

function RoleIcon({ type }) {
  const c = roleColors[type];
  const icons = {
    fe: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={c.stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    ml: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={c.stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    ds: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={c.stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    ux: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={c.stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  };
  return (
    <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icons[type]}
    </div>
  );
}

function SpotDots({ filled, total, color }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: i < filled ? color : "#E8E5E0",
        }}/>
      ))}
    </div>
  );
}

function RoleCard({ type, title, desc, filled, total, openCount, animClass }) {
  const [applied, setApplied] = useState(false);
  const isFull = openCount === 0;
  const c = roleColors[type];

  return (
    <div className={`role-card-hover ${animClass}`} style={{
      background: "#fff",
      border: "1.5px solid #E8E5E0",
      borderRadius: 18,
      padding: "24px 22px 20px",
      display: "flex", flexDirection: "column",
      gap: 14,
      minWidth: 210, flex: 1,
      transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
      opacity: isFull ? 0.6 : 1,
      pointerEvents: isFull ? "none" : "auto",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <RoleIcon type={type} />
        <span style={{
          fontSize: 10, fontWeight: 500, padding: "3px 9px",
          borderRadius: 100, whiteSpace: "nowrap",
          background: isFull ? "#F5F5F5" : "#F0FFF4",
          color: isFull ? "#aaa" : "#2E8B57",
          border: `1px solid ${isFull ? "#e0e0e0" : "#B2DFC0"}`,
        }}>
          {isFull ? "Full" : `${openCount} open`}
        </span>
      </div>

      <div>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>{title}</p>
        <p style={{ fontSize: 12, fontWeight: 300, lineHeight: 1.6, color: "#777" }}>{desc}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#999990" }}>
        <SpotDots filled={filled} total={total} color={c.dot} />
        <span>{filled} of {total} filled</span>
      </div>

      <button
        className={`join-btn-base${applied ? " applied" : ""}`}
        disabled={isFull}
        onClick={() => setApplied(true)}
        style={{
          width: "100%", padding: 10,
          borderRadius: 10, border: "1.5px solid #E8E5E0",
          background: applied ? "#F0FFF4" : "none",
          color: applied ? "#2E8B57" : "#111",
          borderColor: applied ? "#B2DFC0" : "#E8E5E0",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, fontWeight: 500,
          cursor: applied ? "default" : "pointer",
          transition: "all 0.2s",
        }}
      >
        {applied ? "✓ Applied" : "Join Role"}
      </button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────
export default function ProjectPage() {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "#F4F2EF", fontFamily: "'DM Sans', sans-serif", color: "#111" }}>
        <Sidebar />

        {/* Page content */}
        <div style={{ marginLeft: 64, flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

          {/* Hero card */}
          <section style={{ display: "flex", alignItems: "flex-start", width: "100%", maxWidth: 860, padding: "48px 40px 0" }}>
            <div className="rise" style={{
              background: "#fff",
              border: "1px solid #E8E5E0",
              borderRadius: 28, width: "100%",
              padding: "52px 52px 44px",
              boxShadow: "0 8px 48px rgba(0,0,0,0.06)",
            }}>

              {/* Top row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: "AI",           bg: "#FFF0F0", color: "#E14141", border: "#F5C6C6" },
                    { label: "Data Science", bg: "#EEF4FF", color: "#3B6FE0", border: "#C3D5F8" },
                    { label: "ML",           bg: "#F0FFF4", color: "#2E8B57", border: "#B2DFC0" },
                  ].map(t => (
                    <span key={t.label} style={{
                      fontSize: 11, fontWeight: 500, letterSpacing: "0.06em",
                      textTransform: "uppercase", padding: "5px 13px",
                      borderRadius: 100, border: `1.5px solid ${t.border}`,
                      background: t.bg, color: t.color,
                    }}>{t.label}</span>
                  ))}
                </div>

                <button
                  className="wishlist-base"
                  onClick={() => setSaved(s => !s)}
                  style={{
                    background: saved ? "#FFF0F0" : "none",
                    border: `1.5px solid ${saved ? "#E14141" : "#E8E5E0"}`,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                    color: saved ? "#E14141" : "#999990",
                    padding: "8px 14px", borderRadius: 100,
                    transition: "all 0.2s", userSelect: "none", whiteSpace: "nowrap",
                  }}
                >
                  <HeartIcon filled={saved} />
                  {saved ? "Saved" : "Save"}
                </button>
              </div>

              {/* Title & description */}
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 46, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.025em", marginBottom: 16 }}>
                Project Name
              </h1>
              <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.75, color: "#666", marginBottom: 36 }}>
                A short, punchy description of what this project does — the problem it solves, who benefits from it, and what makes it worth your time. Keep it human, keep it real.
              </p>

              <div style={{ height: 1, background: "#E8E5E0", marginBottom: 30 }} />

              {/* Tech stack */}
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999990", marginBottom: 14 }}>
                Tech Stack
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <StackItem icon={<PythonSvg />}  name="Python" />
                <StackItem icon={<TFSvg />}       name="TensorFlow" />
                <StackItem icon={<PandasSvg />}   name="Pandas" />
                <StackItem icon={<FastAPISvg />}  name="FastAPI" />
                <StackItem icon={<DockerSvg />}   name="Docker" />
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 34, paddingTop: 24, borderTop: "1px solid #E8E5E0", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex" }}>
                    {[{ initials: "AK", bg: "#E14141" }, { initials: "BM", bg: "#3B6FE0" }, { initials: "JL", bg: "#2E8B57" }].map((a, i) => (
                      <div key={i} style={{
                        width: 30, height: 30, borderRadius: "50%",
                        border: "2px solid #fff", background: a.bg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 600, color: "#fff",
                        marginLeft: i === 0 ? 0 : -8,
                      }}>{a.initials}</div>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: "#999990", marginLeft: 6 }}>3 members</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "#999990" }}>Updated <strong style={{ fontWeight: 500, color: "#444" }}>Feb 2026</strong></span>
                  <button className="view-btn-el" style={{
                    background: "#E14141", color: "#fff", border: "none",
                    padding: "11px 24px", borderRadius: 100,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                    cursor: "pointer", transition: "opacity 0.2s, transform 0.15s",
                  }}>View Project →</button>
                </div>
              </div>

            </div>
          </section>

          {/* Role cards */}
          <div style={{ width: "100%", maxWidth: 860, padding: "28px 40px 80px", alignSelf: "flex-start" }}>
            <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4, msOverflowStyle: "none", scrollbarWidth: "none" }}>
              <RoleCard animClass="rise-1" type="fe" title="Frontend Developer" desc="Build and maintain the UI. React, Tailwind, and a good eye for clean interfaces."      filled={2} total={3} openCount={1} />
              <RoleCard animClass="rise-2" type="ml" title="ML Engineer"         desc="Design and train models, work with training pipelines, and improve accuracy over time." filled={1} total={3} openCount={2} />
              <RoleCard animClass="rise-3" type="ds" title="Data Scientist"       desc="Clean, explore, and analyze datasets. Help the team turn raw data into useful insights." filled={2} total={3} openCount={1} />
              <RoleCard animClass="rise-4" type="ux" title="UI / UX Designer"     desc="Shape the look and feel of the product. Wireframes, prototypes, design system ownership." filled={3} total={3} openCount={0} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
