import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

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

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }

  .pl-root { display: flex; min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  /* Sidebar */
  .sidebar {
    width: var(--sidebar-w); background: var(--red);
    display: flex; flex-direction: column; align-items: center; justify-content: space-between;
    padding: 28px 0; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100;
  }
  .sidebar-logo {
    width: 34px; height: 34px; border: 2px solid rgba(255,255,255,0.5); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 14px; color: #fff; user-select: none;
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
  .nav-btn:hover .tooltip { opacity: 1; transform: translateX(0); pointer-events: auto; }
  .tooltip {
    position: absolute; left: calc(100% + 14px);
    background: #111; color: #fff; font-size: 11px; padding: 5px 10px; border-radius: 6px;
    white-space: nowrap; opacity: 0; transform: translateX(-6px);
    transition: opacity 0.18s, transform 0.18s; pointer-events: none;
  }
  .tooltip::before {
    content: ''; position: absolute; right: 100%; top: 50%; transform: translateY(-50%);
    border: 5px solid transparent; border-right-color: #111;
  }

  /* Main */
  .main { margin-left: var(--sidebar-w); flex: 1; min-height: 100vh; display: flex; flex-direction: column; }

  /* Topbar */
  .topbar { padding: 36px 48px 0; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .topbar-left h1 { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
  .topbar-left p { margin-top: 6px; font-size: 14px; font-weight: 300; color: var(--muted); }
  .search-wrap { position: relative; display: flex; align-items: center; }
  .search-wrap svg { position: absolute; left: 12px; width: 15px; height: 15px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
  .search-input { padding: 8px 14px 8px 34px; border: 1.5px solid var(--border); border-radius: 100px; background: var(--card); font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); outline: none; width: 210px; transition: border-color 0.18s; }
  .search-input:focus { border-color: #bbb; }
  .search-input::placeholder { color: var(--muted); }

  /* Filter */
  .filter-row { padding: 18px 48px 0; display: flex; gap: 8px; flex-wrap: wrap; }
  .filter-pill { font-size: 12px; font-weight: 500; padding: 7px 16px; border-radius: 100px; border: 1.5px solid var(--border); background: var(--card); color: var(--muted); cursor: pointer; transition: all 0.18s; user-select: none; }
  .filter-pill:hover { border-color: #ccc; color: var(--text); }
  .filter-pill.active { background: var(--text); color: #fff; border-color: var(--text); }

  .result-count { font-size: 12px; color: var(--muted); padding: 16px 48px 0; }
  .result-count span { color: var(--text); font-weight: 500; }

  /* Cards */
  .cards-col { padding: 16px 48px 80px; display: flex; flex-direction: column; gap: 14px; }

  @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

  .p-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 20px;
    box-shadow: 0 2px 14px rgba(0,0,0,0.04); text-decoration: none; color: inherit;
    display: flex; flex-direction: row; align-items: stretch; overflow: hidden;
    transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
    animation: rise 0.45s cubic-bezier(0.22,1,0.36,1) both; cursor: pointer;
  }
  .p-card:hover { box-shadow: 0 6px 32px rgba(0,0,0,0.09); border-color: #d8d4ce; transform: translateY(-2px); }
  .p-card:hover .card-title { color: var(--red); }
  .p-card:hover .go-btn { color: var(--red); }
  .p-card:hover .go-btn svg { transform: translateX(3px); }

  /* Card left */
  .card-left { width: 160px; min-width: 160px; display: flex; flex-direction: column; gap: 10px; padding: 10px; flex-shrink: 0; border-right: 1px solid var(--border); }
  .card-img { width: 100%; height: 120px; position: relative; overflow: hidden; background: linear-gradient(135deg, #f0ede9, #e8e4df); border-radius: 14px; flex-shrink: 0; }
  .card-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.25s ease; }
  .card-img-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .card-img-placeholder svg { width: 26px; height: 26px; stroke: #ccc; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
  .card-left .tags { display: flex; gap: 5px; flex-wrap: wrap; padding: 2px 0; }

  /* Tags */
  .tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag { font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 10px; border-radius: 100px; border: 1.5px solid transparent; }
  .tag-ai   { background: #FFF0F0; color: var(--red);  border-color: #F5C6C6; }
  .tag-data { background: #EEF4FF; color: #3B6FE0;    border-color: #C3D5F8; }
  .tag-ml   { background: #F0FFF4; color: #2E8B57;    border-color: #B2DFC0; }
  .tag-web  { background: #FFF8EE; color: #E07B20;    border-color: #F5D9B0; }
  .tag-sec  { background: #F5F0FF; color: #7B3FE4;    border-color: #D4B8F8; }
  .tag-iot  { background: #F0F9FF; color: #0284C7;    border-color: #BAE6FD; }

  /* Card content */
  .card-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; padding: 20px 26px 20px; }
  .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .card-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.015em; line-height: 1.15; transition: color 0.18s; }
  .card-body { display: flex; flex-direction: column; gap: 8px; }
  .card-desc { font-size: 12px; font-weight: 300; line-height: 1.65; color: #777; }
  .card-divider { height: 1px; background: var(--border); }

  /* Save button */
  .wl-btn {
    background: none; border: 1.5px solid var(--border); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); padding: 7px; border-radius: 100px;
    width: 32px; height: 32px; flex-shrink: 0;
    transition: all 0.2s; user-select: none;
  }
  .wl-btn:hover { border-color: var(--red); color: var(--red); }
  .wl-btn.saved { background: var(--red-light); border-color: var(--red); color: var(--red); }
  .wl-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; transition: fill 0.2s; }
  .wl-btn.saved svg { fill: var(--red); }

  /* Stack */
  .stack-row { display: flex; gap: 7px; flex-wrap: wrap; align-items: center; }
  .stack-item { display: flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 9px; border: 1.5px solid var(--border); background: var(--bg); font-size: 11px; font-weight: 500; transition: border-color 0.18s; }
  .stack-item:hover { border-color: #ccc; }
  .sicon { width: 15px; height: 15px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .sicon svg { width: 15px; height: 15px; }

  /* Footer */
  .card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; gap: 10px; }
  .contrib-row { display: flex; align-items: center; gap: 8px; }
  .avatar-stack { display: flex; }
  .avatar {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; letter-spacing: 0.02em;
    border: 1.5px solid; margin-left: -6px; flex-shrink: 0;
  }
  .avatar:first-child { margin-left: 0; }
  .contrib-label { font-size: 11px; font-weight: 400; color: var(--muted); white-space: nowrap; }
  .go-btn { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; color: var(--muted); transition: color 0.18s; flex-shrink: 0; }
  .go-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: transform 0.18s; }

  /* FAB */
  .fab {
    position: fixed; bottom: 36px; right: 40px;
    width: 54px; height: 54px; border-radius: 50%;
    background: var(--red); border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; box-shadow: 0 4px 20px rgba(225,65,65,0.38);
    transition: transform 0.2s, box-shadow 0.2s; z-index: 200;
  }
  .fab:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(225,65,65,0.48); }
  .fab svg { width: 20px; height: 20px; stroke: #fff; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
  .fab-tooltip {
    position: absolute; right: calc(100% + 12px); top: 50%; transform: translateY(-50%);
    background: #111; color: #fff; font-size: 12px; font-family: 'DM Sans', sans-serif;
    padding: 5px 11px; border-radius: 8px; white-space: nowrap;
    opacity: 0; pointer-events: none; transition: opacity 0.18s;
  }
  .fab:hover .fab-tooltip { opacity: 1; }

  /* Empty */
  .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 0; gap: 12px; color: var(--muted); font-size: 14px; font-weight: 300; }
  .empty svg { width: 36px; height: 36px; stroke: #ccc; fill: none; stroke-width: 1.5; stroke-linecap: round; }

  @media (max-width: 680px) {
    .topbar, .cards-col, .filter-row, .result-count { padding-left: 16px; padding-right: 16px; }
    .card-left { width: 110px; min-width: 110px; }
  }
`;

const PROJECTS = [
  {
    id: 1,
    title: "Adaptive Learning Engine",
    desc: "A personalized tutoring system that adapts to individual learning speeds using reinforcement learning and live feedback loops.",
    tags: ["AI", "ML"],
    images: [
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
      "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&q=80",
    ],
    stack: [
      { name: "Python", icon: <PythonIcon /> },
      { name: "TensorFlow", icon: <TensorFlowIcon /> },
      { name: "FastAPI", icon: <FastAPIIcon /> },
    ],
    contributors: [
      { initials: "AR", color: "#E14141" },
      { initials: "SK", color: "#3B6FE0" },
      { initials: "MT", color: "#2E8B57" },
    ],
    lead: "Alex R.",
  },
  {
    id: 2,
    title: "Campus Health Tracker",
    desc: "Aggregates anonymized wellness data from students to detect early burnout signals across departments and recommend interventions.",
    tags: ["Data Science", "ML"],
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&q=80",
    ],
    stack: [
      { name: "Python", icon: <PythonIcon /> },
      { name: "Pandas", icon: <PandasIcon /> },
      { name: "Docker", icon: <DockerIcon /> },
    ],
    contributors: [
      { initials: "JL", color: "#E07B20" },
      { initials: "CP", color: "#7B3FE4" },
    ],
    lead: "Jordan L.",
  },
  {
    id: 3,
    title: "Peer Review Platform",
    desc: "An anonymous code and essay review system with AI-assisted feedback, structured rubrics, and revision tracking built for classrooms.",
    tags: ["Web", "AI"],
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&q=80",
    ],
    stack: [
      { name: "React", icon: <span style={{fontSize:12,fontWeight:800,color:"#61DAFB"}}>⚛</span> },
      { name: "Node.js", icon: <span style={{fontSize:10,fontWeight:700,color:"#539E43"}}>N</span> },
      { name: "FastAPI", icon: <FastAPIIcon /> },
    ],
    contributors: [
      { initials: "TM", color: "#E14141" },
      { initials: "RS", color: "#0284C7" },
      { initials: "CW", color: "#E07B20" },
    ],
    lead: "Taylor M.",
  },
  {
    id: 4,
    title: "SecureLab CTF Toolkit",
    desc: "A collection of sandboxed challenges and tools for students learning ethical hacking, cryptography, and network security fundamentals.",
    tags: ["Security"],
    images: [
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&q=80",
    ],
    stack: [
      { name: "Python", icon: <PythonIcon /> },
      { name: "Docker", icon: <DockerIcon /> },
    ],
    contributors: [
      { initials: "DH", color: "#7B3FE4" },
      { initials: "MA", color: "#2E8B57" },
    ],
    lead: "Drew H.",
  },
  {
    id: 5,
    title: "Smart Campus Energy Monitor",
    desc: "Raspberry Pi sensors across campus buildings feed live energy data into a dashboard for sustainability tracking and reporting.",
    tags: ["IoT", "Data Science"],
    images: [
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80",
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&q=80",
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80",
    ],
    stack: [
      { name: "Python", icon: <PythonIcon /> },
      { name: "Pandas", icon: <PandasIcon /> },
    ],
    contributors: [
      { initials: "JB", color: "#0284C7" },
      { initials: "QR", color: "#E14141" },
      { initials: "AN", color: "#3B6FE0" },
    ],
    lead: "Jamie B.",
  },
  {
    id: 6,
    title: "StudyBuddy Matchmaker",
    desc: "Matches students with compatible study partners based on schedule, learning style, and course overlap using a smart recommendation model.",
    tags: ["AI", "Web"],
    images: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80",
    ],
    stack: [
      { name: "React", icon: <span style={{fontSize:12,fontWeight:800,color:"#61DAFB"}}>⚛</span> },
      { name: "Python", icon: <PythonIcon /> },
      { name: "FastAPI", icon: <FastAPIIcon /> },
    ],
    contributors: [
      { initials: "RC", color: "#E07B20" },
      { initials: "SD", color: "#7B3FE4" },
    ],
    lead: "Riley C.",
  },
];

const TAG_FILTERS = ["All", "AI", "ML", "Data Science", "Web", "Security", "IoT"];

const TAG_CLASS = {
  AI: "tag-ai", ML: "tag-ml", "Data Science": "tag-data",
  Web: "tag-web", Security: "tag-sec", IoT: "tag-iot",
};

// ── SVG Icons ──────────────────────────────────────────────
function PythonIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.89S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.031v-2.867s-.109-3.405 3.345-3.405h5.766s3.236.052 3.236-3.13V3.124S18.28 0 11.914 0zm-3.2 1.807a1.042 1.042 0 1 1 0 2.084 1.042 1.042 0 0 1 0-2.084z" fill="#3572A5"/>
      <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.131S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.031v2.867s.109 3.405-3.345 3.405H9.455s-3.236-.052-3.236 3.13v5.403S5.72 24 12.086 24zm3.2-1.807a1.042 1.042 0 1 1 0-2.084 1.042 1.042 0 0 1 0 2.084z" fill="#FFD43B"/>
    </svg>
  );
}

function TensorFlowIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zm21.43 5.311l-.014-5.31L12.46 0v4.756l6.513 3.77v8.977l-6.513 3.764V24l9.262-5.388V11.167z" fill="#FF6F00"/>
    </svg>
  );
}

function FastAPIIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 0C5.375 0 0 5.375 0 12c0 6.624 5.375 12 12 12 6.624 0 12-5.376 12-12 0-6.625-5.376-12-12-12zm-.624 21.527v-7.778H6.724L13.101 2.47v7.778h4.651L11.376 21.53z" fill="#009688"/>
    </svg>
  );
}

function PandasIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M9.462 2.677h2.153v5.527H9.462zm0 7.027h2.153v5.527H9.462zm3.088-3.516h2.153v5.527h-2.153zm0 7.026h2.153v5.527h-2.153zm-6.175-3.51h2.153v5.527H6.375zM6.375 16.73h2.153v5.527H6.375z" fill="#150458"/>
    </svg>
  );
}

function DockerIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z" fill="#2496ED"/>
    </svg>
  );
}

// ── ProjectCard ────────────────────────────────────────────
function ProjectCard({ project, animDelay }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgOpacity, setImgOpacity] = useState(1);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);

  // Preload images
  useEffect(() => {
    project.images.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, [project.images]);

  const handleMouseEnter = useCallback(() => {
    if (project.images.length < 2) return;
    timerRef.current = setInterval(() => {
      setImgOpacity(0);
      setTimeout(() => {
        setImgIdx(prev => (prev + 1) % project.images.length);
        setImgOpacity(1);
      }, 220);
    }, 1000);
  }, [project.images]);

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
      href="project-page.html"
      style={{ animationDelay: `${animDelay}s` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left panel */}
      <div className="card-left">
        <div className="card-img">
          <div className="card-img-placeholder">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <img
            src={project.images[imgIdx]}
            alt={project.title}
            style={{ opacity: imgOpacity }}
          />
        </div>
        <div className="tags">
          {project.tags.map(tag => (
            <span key={tag} className={`tag ${TAG_CLASS[tag] || ""}`}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Right content */}
      <div className="card-content">
        <div className="card-top">
          <p className="card-title">{project.title}</p>
          <button className={`wl-btn${saved ? " saved" : ""}`} onClick={toggleSave}>
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </button>
        </div>

        <div className="card-body">
          <div className="stack-row">
            {project.stack.map(s => (
              <div key={s.name} className="stack-item">
                <div className="sicon">{s.icon}</div>
                {s.name}
              </div>
            ))}
          </div>
          <p className="card-desc">{project.desc}</p>
        </div>

        <div className="card-divider" />

        <div className="card-footer">
          <div className="contrib-row">
            <div className="avatar-stack">
              {project.contributors.map((c, i) => (
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
            <span className="contrib-label">Led by {project.lead}</span>
          </div>
          <div className="go-btn">
            <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main App ───────────────────────────────────────────────
export default function ProjectsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = PROJECTS.filter(p => {
    const tagMatch = activeFilter === "All" || p.tags.includes(activeFilter);
    const q = search.toLowerCase().trim();
    const textMatch = !q || p.title.toLowerCase().includes(q) || p.tags.join(" ").toLowerCase().includes(q);
    return tagMatch && textMatch;
  });

  return (
    <div className="pl-root">
      <style>{style}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">P</div>
        <nav className="sidebar-nav">
          <a href="projects-list.html" className="nav-btn active">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            <span className="tooltip">Projects</span>
          </a>
          <a href="project-page.html" className="nav-btn">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="8.5"/><line x1="12" y1="11" x2="12" y2="16"/></svg>
            <span className="tooltip">About</span>
          </a>
        </nav>
      </aside>

      {/* Main */}
      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <h1>Projects</h1>
            <p>Browse open student projects and find your place.</p>
          </div>
          <div className="search-wrap">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search projects…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-row">
          {TAG_FILTERS.map(f => (
            <button
              key={f}
              className={`filter-pill${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <p className="result-count"><span>{filtered.length}</span> projects</p>

        <div className="cards-col">
          {filtered.length === 0 ? (
            <div className="empty">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <span>No projects match your search.</span>
            </div>
          ) : (
            filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} animDelay={0.03 + i * 0.04} />
            ))
          )}
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => navigate("/new")}>
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span className="fab-tooltip">New Project</span>
      </button>
    </div>
  );
}
