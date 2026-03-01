export const style = `
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
    width: 641px; height: 405px; flex-shrink: 0;
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

  /* New Project */
  .np-topbar { padding: 36px 48px 0; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .np-topbar-left h1 { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; line-height: 1; }
  .np-topbar-left p { margin-top: 6px; font-size: 14px; font-weight: 300; color: var(--muted); }
  .np-topbar-actions { display: flex; gap: 10px; align-items: center; }

  .btn-ghost { background: none; border: 1.5px solid var(--border); border-radius: 12px; padding: 9px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: var(--muted); cursor: pointer; transition: all 0.18s; }
  .btn-ghost:hover { border-color: #bbb; color: var(--text); }
  .btn-primary { background: var(--red); border: none; border-radius: 12px; padding: 9px 18px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 7px; box-shadow: 0 4px 14px rgba(225,65,65,0.28); transition: all 0.18s; }
  .btn-primary:hover { background: #d03232; transform: translateY(-1px); }
  .btn-primary svg { width: 13px; height: 13px; stroke: #fff; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

  .np-steps { padding: 28px 48px 0; display: flex; align-items: center; }
  .step { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .step-dot { width: 24px; height: 24px; border-radius: 50%; background: var(--border); color: var(--muted); font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .step.done .step-dot { background: var(--red); color: #fff; }
  .step span { font-size: 12px; font-weight: 500; color: var(--muted); transition: color 0.2s; }
  .step.done span { color: var(--text); }
  .step-line { flex: 1; height: 1.5px; background: var(--border); margin: 0 10px; transition: background 0.2s; min-width: 24px; }
  .step-line.done { background: var(--red); }

  .np-body { padding: 24px 48px 80px; }
  .np-form-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 32px; display: flex; flex-direction: column; gap: 32px; box-shadow: 0 2px 14px rgba(0,0,0,0.04); }

  .np-section { display: flex; flex-direction: column; gap: 14px; }
  .np-section-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; letter-spacing: -0.01em; }
  .np-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 7px; }
  .np-input { width: 100%; padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 12px; background: var(--bg); font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.18s, box-shadow 0.18s; }
  .np-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(225,65,65,0.08); }
  .np-input::placeholder { color: #ccc; }
  .np-input[type="date"] { appearance: none; -webkit-appearance: none; color: var(--text); font-family: 'DM Sans', sans-serif; }
  .np-input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
  .np-textarea { width: 100%; padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 12px; background: var(--bg); font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); outline: none; resize: vertical; min-height: 90px; transition: border-color 0.18s, box-shadow 0.18s; }
  .np-textarea:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(225,65,65,0.08); }
  .np-textarea::placeholder { color: #ccc; }

  .np-section-divider { height: 1px; background: var(--border); }

  .toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px); background: #111; color: #fff; font-size: 13px; font-weight: 500; padding: 12px 22px; border-radius: 100px; display: flex; align-items: center; gap: 8px; opacity: 0; pointer-events: none; transition: all 0.3s; z-index: 999; }
  .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .toast svg { width: 14px; height: 14px; stroke: #4ade80; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

`;

export const TAG_CLASS = {
  AI: "tag-ai", ML: "tag-ml", "Data Science": "tag-data",
  Web: "tag-web", Security: "tag-sec", IoT: "tag-iot",
};

export const TAG_FILTERS = ["All", "AI", "ML", "Data Science", "Web", "Security", "IoT"];