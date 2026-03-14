import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Modal from "../components/Modal";

const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Next.js', 'Node.js',
  'Java', 'Spring', 'Python', 'Django', 'Ruby', 'Ruby on Rails',
  'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'GraphQL',
  'AWS', 'Docker', 'Kubernetes', 'Firebase',
  'Figma', 'UI/UX', 'Unity', 'Unreal Engine'
];
const INTEREST_OPTIONS = ['Web Dev', 'Mobile App', 'AI/ML', 'Game Dev', 'Data Science', 'Fintech', 'EdTech', 'Startup', 'Cyber Security', 'Blockchain'];

const style = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --green: #00FF88;
    --green-dim: rgba(0, 255, 136, 0.12);
    --green-border: rgba(0, 255, 136, 0.3);
    --bg: #0A0A0A;
    --bg-2: #111111;
    --bg-3: #161616;
    --card: #111111;
    --text: #E8E8E8;
    --muted: #555555;
    --muted-2: #888888;
    --border: #222222;
    --border-2: #2A2A2A;
    --red: #FF4444;
    --yellow: #FFB800;
    --blue: #4499FF;
    --sidebar-w: 64px;
    --mono: 'JetBrains Mono', monospace;
    --sans: 'IBM Plex Sans', sans-serif;
  }

  body { background: var(--bg); font-family: var(--sans); color: var(--text); }

  .pp-root {
    margin-left: var(--sidebar-w);
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    padding: 24px;
  }

  .pp-container {
    border: 1px solid rgba(255,255,255,0.1);
    overflow: hidden;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  /* ─── TOPBAR ─── */
  .pp-topbar {
    height: 36px;
    background: var(--bg-2);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
  }
  .pp-topbar-dot {
    width: 8px; height: 8px;
    background: var(--green);
    display: inline-block;
    animation: blink 2s ease-in-out infinite;
    flex-shrink: 0;
  }
  .pp-topbar-path { color: var(--muted-2); }
  .pp-topbar-path span { color: var(--green); }
  .pp-topbar-sep { color: var(--border-2); margin: 0 4px; }
  .pp-topbar-right { margin-left: auto; display: flex; gap: 16px; align-items: center; }
  .pp-topbar-stat { color: var(--muted); }
  .pp-topbar-stat b { color: var(--text); font-weight: 500; }

  /* ─── HEADER ─── */
  .pp-header {
    border-bottom: 1px solid var(--border);
    animation: fadeIn 0.4s ease both;
  }
  .pp-header-top {
    display: flex;
    align-items: flex-start;
    gap: 0;
  }

  /* Neofetch-style image panel */
  .pp-avatar {
    width: 200px;
    height: 200px;
    flex-shrink: 0;
    background: var(--bg-3);
    border-right: 1px solid var(--border-2);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    image-rendering: pixelated;
  }
  .pp-avatar img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }
  /* fallback initials */
  .pp-avatar-initials {
    font-family: var(--mono);
    font-size: 48px;
    font-weight: 700;
    color: var(--green);
    opacity: 0.4;
    user-select: none;
  }

  /* Neofetch info panel */
  .pp-identity {
    flex: 1;
    padding: 16px 24px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .pp-neo-top { display: flex; align-items: flex-end; gap: 24px; }
  .pp-neo-info { display: flex; flex-direction: column; gap: 1px; flex-shrink: 0; }
  .pp-neo-title {
    font-family: var(--mono);
    font-size: 15px;
    font-weight: 700;
    color: var(--green);
    margin-bottom: 2px;
    letter-spacing: 0.02em;
  }
  .pp-neo-title span { color: var(--muted-2); }
  .pp-neo-sep {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--border-2);
    letter-spacing: 0.06em;
    margin-bottom: 4px;
  }
  .pp-neo-row {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--text);
    line-height: 1.5;
    display: flex;
    gap: 0;
  }
  .pp-neo-key {
    color: var(--green);
    font-weight: 600;
    min-width: 80px;
  }
  .pp-neo-val { color: var(--muted-2); }
  .pp-neo-val a { color: var(--muted-2); text-decoration: none; transition: color 0.15s; }
  .pp-neo-val a:hover { color: var(--green); }

  /* Colorbar */
  .pp-colorbar {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .pp-colorbar-row {
    display: flex;
    flex-direction: row;
    gap: 0;
  }
  .pp-colorbar-swatch {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
  .pp-label {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 6px;
  }
  .pp-name {
    font-family: var(--mono);
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .pp-name::after {
    content: '_';
    color: var(--green);
    animation: blink 1.2s ease-in-out infinite;
  }
  .pp-email {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--muted-2);
    margin-top: 6px;
  }
  .pp-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .pp-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
    border: 1px solid var(--border-2);
    background: var(--bg-3);
    color: var(--muted-2);
    letter-spacing: 0.04em;
  }
  .pp-btn svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: square; stroke-linejoin: miter; }
  .pp-btn:hover { border-color: var(--muted); color: var(--text); background: var(--bg-2); }
  .pp-btn-green {
    border-color: var(--green-border);
    background: var(--green-dim);
    color: var(--green);
  }
  .pp-btn-green:hover { background: rgba(0,255,136,0.2); border-color: var(--green); }

  /* ─── NAV TABS ─── */
  .pp-tabs {
    display: flex;
    gap: 0;
    margin-top: 0;
    border-top: 1px solid var(--border);
    padding-left: 200px;
  }
  .pp-tab {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    padding: 8px 20px;
    border: 1px solid transparent;
    border-bottom: none;
    cursor: default;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .pp-tab.active {
    color: var(--text);
    background: var(--bg);
    border-color: var(--border);
    border-bottom-color: var(--bg);
    position: relative;
    bottom: -1px;
  }
  .pp-tab-dot {
    display: inline-block;
    width: 5px; height: 5px;
    background: var(--green);
    margin-right: 6px;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }

  /* ─── BODY ─── */
  .pp-body {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: calc(100vh - 160px);
  }

  /* ─── SIDEBAR ─── */
  .pp-sidebar {
    border-right: 1px solid var(--border);
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .pp-sidebar-section {
    border-bottom: 1px solid var(--border);
    padding: 16px 20px;
    animation: fadeIn 0.4s ease both;
  }
  .pp-sidebar-label {
    font-family: var(--mono);
    font-size: 9px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pp-sidebar-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .pp-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-bottom: 0;
  }
  .pp-stat {
    background: var(--bg-2);
    padding: 14px 12px;
  }
  .pp-stat-num {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 700;
    color: var(--green);
    line-height: 1;
  }
  .pp-stat-label {
    font-family: var(--mono);
    font-size: 9px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 4px;
  }

  .pp-tech-list { display: flex; flex-direction: column; gap: 4px; }
  .pp-tech-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted-2);
    border-bottom: 1px solid transparent;
    transition: color 0.15s;
  }
  .pp-tech-row:hover { color: var(--text); }
  .pp-tech-indicator {
    width: 3px;
    height: 14px;
    flex-shrink: 0;
  }

  .pp-interest-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .pp-interest-chip {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted-2);
    border: 1px solid var(--border-2);
    padding: 3px 8px;
    background: var(--bg-3);
    transition: all 0.15s;
  }
  .pp-interest-chip:hover { color: var(--green); border-color: var(--green-border); background: var(--green-dim); }

  .pp-link-list { display: flex; flex-direction: column; gap: 6px; }
  .pp-link-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted-2);
    text-decoration: none;
    padding: 4px 0;
    transition: color 0.15s;
  }
  .pp-link-row:hover { color: var(--green); }
  .pp-link-row svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 1.5; flex-shrink: 0; }
  .pp-link-empty { font-family: var(--mono); font-size: 10px; color: var(--muted); font-style: italic; }

  /* ─── MAIN ─── */
  .pp-main {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .pp-section {
    border-bottom: 1px solid var(--border);
    animation: fadeIn 0.4s ease both;
  }
  .pp-section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-2);
    position: sticky;
    top: 36px;
    z-index: 10;
  }
  .pp-section-title {
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted-2);
  }
  .pp-section-count {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    background: var(--bg-3);
    border: 1px solid var(--border-2);
    padding: 1px 7px;
    margin-left: auto;
  }
  .pp-section-icon {
    width: 14px; height: 14px;
    stroke: var(--muted);
    fill: none;
    stroke-width: 1.5;
    stroke-linecap: square;
  }

  /* ─── PROJECT ROW ─── */
  .pp-proj-list { display: flex; flex-direction: column; }
  .pp-proj-row {
    display: grid;
    grid-template-columns: 48px 1fr auto;
    align-items: center;
    gap: 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
    color: inherit;
    transition: background 0.12s;
    min-height: 72px;
  }
  .pp-proj-row:hover { background: var(--bg-2); }
  .pp-proj-row:hover .pp-proj-name { color: var(--green); }

  .pp-proj-index {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    border-right: 1px solid var(--border);
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    background: var(--bg-3);
    align-self: stretch;
  }
  .pp-proj-body { padding: 14px 20px; }
  .pp-proj-name {
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    transition: color 0.15s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pp-proj-desc {
    font-family: var(--sans);
    font-size: 12px;
    color: var(--muted);
    margin-top: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 300;
  }
  .pp-proj-meta {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    align-items: center;
  }
  .pp-proj-tag {
    font-family: var(--mono);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 2px 7px;
    border: 1px solid;
  }
  .tag-ai   { color: #FF4444; border-color: rgba(255,68,68,0.3); background: rgba(255,68,68,0.07); }
  .tag-data { color: #4499FF; border-color: rgba(68,153,255,0.3); background: rgba(68,153,255,0.07); }
  .tag-ml   { color: #00FF88; border-color: rgba(0,255,136,0.3); background: rgba(0,255,136,0.07); }
  .tag-web  { color: #FFB800; border-color: rgba(255,184,0,0.3); background: rgba(255,184,0,0.07); }
  .tag-sec  { color: #BB66FF; border-color: rgba(187,102,255,0.3); background: rgba(187,102,255,0.07); }
  .tag-iot  { color: #00CCFF; border-color: rgba(0,204,255,0.3); background: rgba(0,204,255,0.07); }
  .tag-default { color: var(--muted-2); border-color: var(--border-2); background: var(--bg-3); }

  .pp-status-badge {
    font-family: var(--mono);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 2px 7px;
    border: 1px solid rgba(255,184,0,0.3);
    color: var(--yellow);
    background: rgba(255,184,0,0.07);
  }
  .pp-status-badge.accepted { color: var(--green); border-color: var(--green-border); background: var(--green-dim); }
  .pp-status-badge.rejected { color: var(--red); border-color: rgba(255,68,68,0.3); background: rgba(255,68,68,0.07); }

  .pp-proj-arrow {
    padding: 0 20px;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 16px;
    align-self: center;
  }

  /* ─── EMPTY ─── */
  .pp-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 0;
    gap: 8px;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 12px;
  }
  .pp-empty::before {
    content: '// no data found';
    color: var(--muted);
    font-size: 11px;
    letter-spacing: 0.05em;
  }

  .pp-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 12px;
    gap: 8px;
  }
  .pp-loading::before { content: '$'; color: var(--green); }

  /* ─── MODAL ─── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.85);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
  }
  .modal-box {
    background: var(--bg-2);
    border: 1px solid var(--border-2);
    width: 100%;
    max-width: 540px;
    max-height: 88vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 0 1px var(--border), 0 32px 64px rgba(0,0,0,0.8);
    animation: fadeIn 0.2s ease both;
  }
  .modal-titlebar {
    height: 32px;
    background: var(--bg-3);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 6px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
  }
  .modal-titlebar-dot { width: 8px; height: 8px; background: var(--border-2); border: 1px solid var(--border-2); }
  .modal-titlebar-dot.close { background: var(--red); border-color: var(--red); cursor: pointer; }
  .modal-titlebar-name { margin-left: 8px; color: var(--muted-2); }
  .modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }
  .modal-body::-webkit-scrollbar { width: 4px; }
  .modal-body::-webkit-scrollbar-track { background: var(--bg-3); }
  .modal-body::-webkit-scrollbar-thumb { background: var(--border-2); }

  .form-group { margin-bottom: 24px; }
  .form-label {
    display: block;
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 10px;
    color: var(--muted-2);
  }
  .form-label::before { content: '> '; color: var(--green); }
  .form-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--border-2);
    background: var(--bg-3);
    font-family: var(--mono);
    font-size: 12px;
    color: var(--text);
    transition: border-color 0.15s;
    outline: none;
  }
  .form-input::placeholder { color: var(--muted); }
  .form-input:focus { border-color: var(--green-border); box-shadow: 0 0 0 2px var(--green-dim); }

  .tag-container { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag-btn {
    padding: 5px 12px;
    border: 1px solid var(--border-2);
    background: var(--bg-3);
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 500;
    cursor: pointer;
    color: var(--muted);
    letter-spacing: 0.04em;
    transition: all 0.12s;
  }
  .tag-btn:hover { border-color: var(--muted); color: var(--text); }
  .tag-btn.active-skill {
    background: rgba(255,255,255,0.06);
    color: var(--text);
    border-color: var(--muted-2);
  }
  .tag-btn.active-interest {
    background: var(--green-dim);
    color: var(--green);
    border-color: var(--green-border);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }
  .btn-cancel {
    padding: 9px 20px;
    border: 1px solid var(--border-2);
    background: transparent;
    cursor: pointer;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.06em;
    transition: all 0.15s;
  }
  .btn-cancel:hover { color: var(--text); border-color: var(--muted); }
  .btn-save {
    padding: 9px 20px;
    border: 1px solid var(--green-border);
    background: var(--green-dim);
    cursor: pointer;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 700;
    color: var(--green);
    letter-spacing: 0.06em;
    transition: all 0.15s;
  }
  .btn-save:hover { background: rgba(0,255,136,0.2); border-color: var(--green); }
  .btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const TECH_COLORS = {
  python: "#3572A5", react: "#61DAFB", nodejs: "#539E43",
  fastapi: "#009688", tensorflow: "#FF6F00", pytorch: "#EE4C2C",
  docker: "#2496ED", pandas: "#150458", postgres: "#336791",
  mongodb: "#47A248", typescript: "#3178C6", rust: "#DEA584",
  go: "#00ACD7", vue: "#42B883", nextjs: "#888", graphql: "#E10098",
  javascript: "#F7DF1E", java: "#ED8B00", spring: "#6DB33F",
  aws: "#FF9900", kubernetes: "#326CE5", firebase: "#FFCA28",
};

function normalizeList(raw) {
  if (Array.isArray(raw) && raw.length > 0) return raw;
  if (typeof raw === "string") {
    const parsed = raw.split(",").map((v) => v.trim()).filter(Boolean);
    return parsed.length > 0 ? parsed : [];
  }
  return [];
}

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  const cls = s === "accepted" ? "accepted" : s === "rejected" ? "rejected" : "";
  return <span className={`pp-status-badge ${cls}`}>{status ?? "pending"}</span>;
}

export default function ProfilePage() {
  const { id } = useParams();
  const routeKey = id ?? "me";

  const [profile, setProfile] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [editName, setEditName] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editMajor, setEditMajor] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editGithub, setEditGithub] = useState("");

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const authUserId = authData?.user?.id;
      let profileRow = null;

      if (routeKey === "me" && authUserId) {
        const { data } = await supabase.from("profiles").select("*").eq("id", authUserId).maybeSingle();
        profileRow = data;
      } else {
        const { data } = await supabase.from("profiles").select("*").ilike("school_email", `${routeKey}@%`).maybeSingle();
        profileRow = data;
      }

      if (profileRow && active) {
        setProfile(profileRow);
        setIsMyProfile(authUserId === profileRow.id);
        setSelectedSkills(normalizeList(profileRow.technical_skills));
        setSelectedTags(normalizeList(profileRow.interest_tags));
        setEditName(profileRow.full_name || "");
        setEditYear(profileRow.year || "");
        setEditMajor(profileRow.major || "");
        setEditLinkedin(profileRow.linkedin_url || "");
        setEditGithub(profileRow.github_url || "");

        const { data: postsData } = await supabase
          .from("projects").select("*").eq("author_id", profileRow.id)
          .order("created_at", { ascending: false });
        setProjects(postsData || []);

        const { data: appsData } = await supabase
          .from("applications")
          .select(`id, created_at, status, message, project_roles ( role_name, projects ( id, title, content, category_tag, images ) )`)
          .eq("applicant_id", profileRow.id)
          .order("created_at", { ascending: false });

        const formattedApps = (appsData || []).map(app => {
          const roleData = Array.isArray(app.project_roles) ? app.project_roles[0] : app.project_roles;
          const projectData = Array.isArray(roleData?.projects) ? roleData.projects[0] : roleData?.projects;
          return { appId: app.id, status: app.status, role_name: roleData?.role_name, ...projectData };
        });
        setApplications(formattedApps);
      }
      if (active) setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [routeKey]);

  const toggleArrayItem = (item, array, setArray) => {
    if (array.includes(item)) setArray(array.filter(i => i !== item));
    else setArray([...array, item]);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (!profile?.id) { showToast("Profile not found", "error"); setSaving(false); return; }
    try {
      const payload = {
        full_name: editName,
        year: editYear,
        major: editMajor,
        linkedin_url: editLinkedin,
        github_url: editGithub,
        technical_skills: selectedSkills,
        interest_tags: selectedTags,
      };
      const { data, error: updateError } = await supabase
        .from("profiles").update(payload).eq("id", profile.id).select();
      if (updateError) {
        showToast(`Error: ${updateError.message}`, "error");
      } else if (!data || data.length === 0) {
        showToast("Permission denied — check RLS policy", "error");
      } else {
        setProfile(prev => ({ ...prev, ...payload }));
        setIsEditOpen(false);
        showToast("Profile updated successfully");
      }
    } catch (err) {
      showToast("Unknown error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="pp-loading"><style>{style}</style>loading profile...</div>;
  if (!profile) return <div className="pp-loading"><style>{style}</style>user not found.</div>;

  const initials = profile.school_email.slice(0, 2).toUpperCase();
  const displayName = profile.school_email.split("@")[0];
  const avatarUrl = profile.avatar_url;
  const displaySkills = normalizeList(profile.technical_skills);
  const displayTags = normalizeList(profile.interest_tags);

  return (
    <div className="pp-root">
      <style>{style}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 999999,
          background: toast.type === "error" ? "rgba(255,68,68,0.1)" : "rgba(0,255,136,0.1)",
          border: `1px solid ${toast.type === "error" ? "rgba(255,68,68,0.4)" : "rgba(0,255,136,0.4)"}`,
          color: toast.type === "error" ? "#FF4444" : "#00FF88",
          padding: "10px 20px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          letterSpacing: "0.04em",
          animation: "fadeIn 0.2s ease both",
        }}>
          {toast.type === "error" ? "✗ " : "✓ "}{toast.msg}
        </div>
      )}

      <div className="pp-container">

      {/* Header — neofetch style */}
      <div className="pp-header">
        <div className="pp-header-top">
          {/* Left: pixel art / avatar image */}
          <div className="pp-avatar">
            {avatarUrl
              ? <img src={avatarUrl} alt={displayName} />
              : <span className="pp-avatar-initials">{initials}</span>
            }
          </div>

          {/* Right: neofetch info */}
          <div className="pp-identity">
            <div className="pp-neo-top">
              <div className="pp-neo-info">
                <div className="pp-neo-title">
                  <span>{displayName.toLowerCase()}@</span>cheesehacks
                </div>
                <div className="pp-neo-sep">{"─".repeat(32)}</div>

                <div className="pp-neo-row">
                  <span className="pp-neo-key">name</span>
                  <span className="pp-neo-val">{profile.full_name || displayName}</span>
                </div>
                <div className="pp-neo-row">
                  <span className="pp-neo-key">year</span>
                  <span className="pp-neo-val">{profile.year || "—"}</span>
                </div>
                <div className="pp-neo-row">
                  <span className="pp-neo-key">major</span>
                  <span className="pp-neo-val">{profile.major || "—"}</span>
                </div>
                <div className="pp-neo-row">
                  <span className="pp-neo-key">github</span>
                  <span className="pp-neo-val">
                    {profile.github_url
                      ? <a href={profile.github_url} target="_blank" rel="noreferrer">
                          {profile.github_url.replace("https://github.com/", "github.com/")}
                        </a>
                      : "—"}
                  </span>
                </div>
                <div className="pp-neo-row">
                  <span className="pp-neo-key">email</span>
                  <span className="pp-neo-val">{profile.school_email}</span>
                </div>
              </div>

              {/* Colorbar — right side */}
              <div className="pp-colorbar">
                <div className="pp-colorbar-row">
                  {["#3d3d3d","#7a3535","#a84444","#c05050","#d46060","#e08080","#c8a0a0","#e8e8e8"].map((c, i) => (
                    <div key={i} className="pp-colorbar-swatch" style={{ background: c }} />
                  ))}
                </div>
                <div className="pp-colorbar-row">
                  {["#555555","#9b4444","#bf5555","#d46868","#e07878","#eeaaaa","#ddbaba","#ffffff"].map((c, i) => (
                    <div key={i} className="pp-colorbar-swatch" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pp-actions" style={{ marginTop: 16 }}>
              <a className="pp-btn" href={`mailto:${profile.school_email}`}>
                <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="0"/><polyline points="2,4 12,13 22,4"/></svg>
                mail
              </a>
              {profile.github_url && (
                <a className="pp-btn" href={profile.github_url} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  github
                </a>
              )}
              {profile.linkedin_url && (
                <a className="pp-btn" href={profile.linkedin_url} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  linkedin
                </a>
              )}
              {isMyProfile && (
                <button className="pp-btn pp-btn-green" onClick={() => setIsEditOpen(true)}>
                  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  edit profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pp-tabs">
          <div className="pp-tab active"><span className="pp-tab-dot" />overview</div>
        </div>
      </div>

      {/* Body */}
      <div className="pp-body">
        {/* Sidebar */}
        <div className="pp-sidebar">
          <div className="pp-sidebar-section" style={{ animationDelay: "0.05s" }}>
            <div className="pp-sidebar-label">stats</div>
            <div className="pp-stats-grid">
              <div className="pp-stat">
                <div className="pp-stat-num">{projects.length}</div>
                <div className="pp-stat-label">posted</div>
              </div>
              <div className="pp-stat">
                <div className="pp-stat-num">{applications.length}</div>
                <div className="pp-stat-label">applied</div>
              </div>
              <div className="pp-stat">
                <div className="pp-stat-num">{displaySkills.length}</div>
                <div className="pp-stat-label">skills</div>
              </div>
              <div className="pp-stat">
                <div className="pp-stat-num">{displayTags.length}</div>
                <div className="pp-stat-label">interests</div>
              </div>
            </div>
          </div>

          <div className="pp-sidebar-section" style={{ animationDelay: "0.08s" }}>
            <div className="pp-sidebar-label">tech stack</div>
            {displaySkills.length > 0 ? (
              <div className="pp-tech-list">
                {displaySkills.map(name => (
                  <div key={name} className="pp-tech-row">
                    <span className="pp-tech-indicator" style={{ background: TECH_COLORS[name.toLowerCase()] ?? "#00FF88" }} />
                    {name}
                  </div>
                ))}
              </div>
            ) : (
              <span className="pp-link-empty">none selected</span>
            )}
          </div>

          <div className="pp-sidebar-section" style={{ animationDelay: "0.11s" }}>
            <div className="pp-sidebar-label">interests</div>
            {displayTags.length > 0 ? (
              <div className="pp-interest-list">
                {displayTags.map(tag => (
                  <span key={tag} className="pp-interest-chip">{tag}</span>
                ))}
              </div>
            ) : (
              <span className="pp-link-empty">none selected</span>
            )}
          </div>
        </div>

        {/* Main */}
        <div className="pp-main">
          {/* Posted Projects */}
          <div className="pp-section" style={{ animationDelay: "0.06s" }}>
            <div className="pp-section-header">
              <svg className="pp-section-icon" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="0"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <span className="pp-section-title">posted projects</span>
              <span className="pp-section-count">{projects.length}</span>
            </div>
            {projects.length === 0 ? (
              <div className="pp-empty" />
            ) : (
              <div className="pp-proj-list">
                {projects.map((p, i) => (
                  <a key={p.id} href={`/post/${p.id}`} className="pp-proj-row" style={{ animationDelay: `${0.08 + i * 0.03}s` }}>
                    <div className="pp-proj-index">{String(i + 1).padStart(2, "0")}</div>
                    <div className="pp-proj-body">
                      <div className="pp-proj-name">{p.title}</div>
                      <div className="pp-proj-desc">{p.content}</div>
                      {p.category_tag && (
                        <div className="pp-proj-meta">
                          <span className="pp-proj-tag tag-default">{p.category_tag}</span>
                        </div>
                      )}
                    </div>
                    <div className="pp-proj-arrow">›</div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Applied Positions */}
          <div className="pp-section" style={{ animationDelay: "0.1s" }}>
            <div className="pp-section-header">
              <svg className="pp-section-icon" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span className="pp-section-title">applied positions</span>
              <span className="pp-section-count">{applications.length}</span>
            </div>
            {applications.length === 0 ? (
              <div className="pp-empty" />
            ) : (
              <div className="pp-proj-list">
                {applications.map((app, i) => (
                  <a key={app.appId} href={`/post/${app.id}`} className="pp-proj-row" style={{ animationDelay: `${0.1 + i * 0.03}s` }}>
                    <div className="pp-proj-index">{String(i + 1).padStart(2, "0")}</div>
                    <div className="pp-proj-body">
                      <div className="pp-proj-name">{app.title ?? "Untitled Project"}</div>
                      <div className="pp-proj-desc">role: {app.role_name}</div>
                      <div className="pp-proj-meta">
                        <StatusBadge status={app.status} />
                      </div>
                    </div>
                    <div className="pp-proj-arrow">›</div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>{/* end pp-container */}

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
        <div className="modal-titlebar">
          <div className="modal-titlebar-dot close" onClick={() => setIsEditOpen(false)} />
          <div className="modal-titlebar-dot" />
          <div className="modal-titlebar-dot" />
          <span className="modal-titlebar-name">profile.edit — {displayName}</span>
        </div>
        <form onSubmit={handleEditSave}>
          <div className="modal-body">
            <div className="form-group">
              <span className="form-label">Full Name</span>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                placeholder="Your name" className="form-input" />
            </div>
            <div className="form-group">
              <span className="form-label">Year</span>
              <input type="text" value={editYear} onChange={e => setEditYear(e.target.value)}
                placeholder="e.g. Sophomore, Junior, 2026..." className="form-input" />
            </div>
            <div className="form-group">
              <span className="form-label">Major</span>
              <input type="text" value={editMajor} onChange={e => setEditMajor(e.target.value)}
                placeholder="e.g. Computer Science" className="form-input" />
            </div>
            <div className="form-group">
              <span className="form-label">Technical Skills</span>
              <div className="tag-container">
                {SKILL_OPTIONS.map(skill => (
                  <button key={skill} type="button"
                    onClick={() => toggleArrayItem(skill, selectedSkills, setSelectedSkills)}
                    className={`tag-btn ${selectedSkills.includes(skill) ? "active-skill" : ""}`}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <span className="form-label">Interest Tags</span>
              <div className="tag-container">
                {INTEREST_OPTIONS.map(tag => (
                  <button key={tag} type="button"
                    onClick={() => toggleArrayItem(tag, selectedTags, setSelectedTags)}
                    className={`tag-btn ${selectedTags.includes(tag) ? "active-interest" : ""}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <span className="form-label">LinkedIn URL</span>
              <input type="url" value={editLinkedin} onChange={e => setEditLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..." className="form-input" />
            </div>
            <div className="form-group">
              <span className="form-label">GitHub URL</span>
              <input type="url" value={editGithub} onChange={e => setEditGithub(e.target.value)}
                placeholder="https://github.com/..." className="form-input" />
            </div>
            <div className="modal-footer">
              <button type="button" onClick={() => setIsEditOpen(false)} className="btn-cancel">cancel</button>
              <button type="submit" disabled={saving} className="btn-save">
                {saving ? "saving..." : "save changes"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}