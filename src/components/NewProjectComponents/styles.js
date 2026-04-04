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

  /* ── Topbar ── */
  .np-topbar { padding: 36px 48px 0; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .np-topbar-left h1 { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
  .np-topbar-left p { margin-top: 6px; font-size: 14px; font-weight: 300; color: var(--muted); }
  .np-topbar-actions { display: flex; gap: 10px; align-items: center; }

  .btn-ghost {
    padding: 9px 20px; border-radius: 100px;
    border: 1.5px solid var(--border); background: var(--card);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--muted); cursor: pointer; transition: all 0.18s;
  }
  .btn-ghost:hover { border-color: #ccc; color: var(--text); }

  .btn-primary {
    padding: 9px 22px; border-radius: 100px; border: none; background: var(--red);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: #fff; cursor: pointer; transition: all 0.18s;
    display: flex; align-items: center; gap: 7px;
    box-shadow: 0 2px 12px rgba(225,65,65,0.28);
  }
  .btn-primary:hover { background: #d03232; box-shadow: 0 4px 18px rgba(225,65,65,0.38); transform: translateY(-1px); }
  .btn-primary svg { width: 14px; height: 14px; stroke: #fff; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }

  /* ── Steps ── */
  .np-steps { padding: 28px 48px 0; display: flex; align-items: center; }
  .step { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; color: var(--muted); }
  .step.done { color: var(--red); }
  .step-dot {
    width: 24px; height: 24px; border-radius: 50%;
    border: 1.5px solid var(--border); background: var(--card);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; color: var(--muted);
    transition: all 0.2s; flex-shrink: 0;
  }
  .step.done .step-dot { border-color: var(--red); background: var(--red); color: #fff; }
  .step.error { color: #f87171; }
  .step.error .step-dot { border-color: #f87171; background: #fff0f0; color: #f87171; }
  .step-line { flex: 1; height: 1px; background: var(--border); margin: 0 10px; min-width: 24px; }
  .step-line.done { background: var(--red); opacity: 0.4; }

  /* ── Body ── */
  .np-body { padding: 28px 48px 80px; }

  /* ── Form card ── */
  .np-form-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 2px 14px rgba(0,0,0,0.04);
    animation: rise 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pop  { from { opacity: 0; transform: scale(0.8); }       to { opacity: 1; transform: scale(1); } }

  .form-section { padding: 28px 32px; border-bottom: 1px solid var(--border); }
  .form-section:last-child { border-bottom: none; }

  .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .section-num {
    width: 26px; height: 26px; border-radius: 8px;
    background: var(--bg); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--muted); flex-shrink: 0;
  }
  .section-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: -0.01em; }
  .section-sub { font-size: 12px; font-weight: 300; color: var(--muted); margin-top: 2px; }

  /* ── Fields ── */
  .field { margin-bottom: 18px; }
  .field:last-child { margin-bottom: 0; }
  .field-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }

  .field-input {
    width: 100%; padding: 10px 14px;
    border: 1.5px solid var(--border); border-radius: 12px;
    background: var(--bg); font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--text); outline: none;
    transition: border-color 0.18s, background 0.18s;
  }
  .field-input:focus { border-color: var(--red); background: #fff; }
  .field-input::placeholder { color: #bbb; }

  .field-textarea {
    width: 100%; padding: 12px 14px;
    border: 1.5px solid var(--border); border-radius: 12px;
    background: var(--bg); font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--text); outline: none;
    resize: vertical; min-height: 110px; line-height: 1.65;
    transition: border-color 0.18s, background 0.18s;
  }
  .field-textarea:focus { border-color: var(--red); background: #fff; }
  .field-textarea::placeholder { color: #bbb; }

  .char-count { font-size: 11px; color: var(--muted); text-align: right; margin-top: 5px; }
  .char-count.warn { color: var(--red); }

  /* ── Upload ── */
  .upload-zone {
    border: 2px dashed var(--border); border-radius: 14px;
    background: var(--bg); padding: 24px 20px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; cursor: pointer; transition: all 0.18s; text-align: center;
  }
  .upload-zone:hover { border-color: #ccc; background: #f0eee9; }
  .upload-zone.dragging { border-color: var(--red); background: var(--red-light); }
  .upload-icon {
    width: 38px; height: 38px; border-radius: 11px;
    background: var(--card); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
  }
  .upload-icon svg { width: 17px; height: 17px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .upload-label { font-size: 13px; font-weight: 500; color: var(--text); }
  .upload-sub { font-size: 11px; color: var(--muted); }
  .upload-previews { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
  .upload-preview { width: 68px; height: 68px; border-radius: 10px; overflow: hidden; position: relative; border: 1.5px solid var(--border); }
  .upload-preview img { width: 100%; height: 100%; object-fit: cover; }
  .preview-remove {
    position: absolute; top: 4px; right: 4px;
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(0,0,0,0.55); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; color: #fff;
    font-size: 10px; line-height: 1;
  }
  .preview-remove:hover { background: var(--red); }

  /* ── Tags ── */
  .tags-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag-toggle {
    font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 100px;
    border: 1.5px solid var(--border); background: var(--bg);
    color: var(--muted); cursor: pointer; transition: all 0.18s; user-select: none;
  }
  .tag-toggle:hover { border-color: #ccc; color: var(--text); }
  .tag-toggle.sel-ai   { background: #FFF0F0; color: #E14141; border-color: #F5C6C6; }
  .tag-toggle.sel-data { background: #EEF4FF; color: #3B6FE0; border-color: #C3D5F8; }
  .tag-toggle.sel-ml   { background: #F0FFF4; color: #2E8B57; border-color: #B2DFC0; }
  .tag-toggle.sel-web  { background: #FFF8EE; color: #E07B20; border-color: #F5D9B0; }
  .tag-toggle.sel-sec  { background: #F5F0FF; color: #7B3FE4; border-color: #D4B8F8; }
  .tag-toggle.sel-iot  { background: #F0F9FF; color: #0284C7; border-color: #BAE6FD; }
  .tag-toggle.sel-custom { background: #111; color: #fff; border-color: #111; }

  .tag-custom-row { display: flex; gap: 8px; margin-top: 12px; }
  .tag-custom-input {
    flex: 1; padding: 8px 12px;
    border: 1.5px solid var(--border); border-radius: 100px;
    background: var(--bg); font-family: 'DM Sans', sans-serif;
    font-size: 12px; color: var(--text); outline: none; transition: border-color 0.18s;
  }
  .tag-custom-input:focus { border-color: var(--red); }
  .tag-custom-input::placeholder { color: #bbb; }
  .tag-add-btn {
    padding: 8px 16px; border-radius: 100px;
    border: 1.5px solid var(--border); background: var(--card);
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
    color: var(--muted); cursor: pointer; transition: all 0.18s;
    display: flex; align-items: center; gap: 5px;
  }
  .tag-add-btn:hover { border-color: var(--text); color: var(--text); }
  .tag-add-btn svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2.2; stroke-linecap: round; }

  /* ── Tech stack ── */
  .stack-search-wrap { position: relative; margin-bottom: 14px; }
  .stack-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; pointer-events: none; }
  .stack-search {
    width: 100%; padding: 9px 14px 9px 34px;
    border: 1.5px solid var(--border); border-radius: 12px;
    background: var(--bg); font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--text); outline: none; transition: border-color 0.18s;
  }
  .stack-search:focus { border-color: var(--red); background: #fff; }
  .stack-search::placeholder { color: #bbb; }

  .tech-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .tech-chip {
    display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--bg);
    font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.18s; user-select: none;
  }
  .tech-chip:hover { border-color: #ccc; }
  .tech-chip.selected { border-color: var(--text); background: var(--text); color: #fff; }
  .tech-icon { width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; }

  .selected-stack { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
  .selected-stack-empty { font-size: 12px; color: #bbb; padding-top: 14px; border-top: 1px solid var(--border); margin-top: 14px; }
  .sel-chip {
    display: flex; align-items: center; gap: 6px; padding: 5px 10px 5px 12px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--card);
    font-size: 11px; font-weight: 500;
    animation: pop 0.2s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .sel-chip-remove {
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--bg); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); font-size: 11px; line-height: 1;
    transition: background 0.15s, color 0.15s;
  }
  .sel-chip-remove:hover { background: #fee; color: var(--red); }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 36px; left: 50%; transform: translateX(-50%) translateY(80px);
    background: #111; color: #fff; font-size: 13px; font-weight: 500;
    padding: 12px 22px; border-radius: 100px;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s;
    opacity: 0; pointer-events: none; z-index: 999; white-space: nowrap;
  }
  .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; pointer-events: auto; }
  .toast svg { width: 15px; height: 15px; stroke: #4ade80; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

  @media (max-width: 680px) {
    .np-topbar, .np-steps, .np-body { padding-left: 16px; padding-right: 16px; }
  }
`;

export const PRESET_TAGS = [
  { id: "ai",   label: "AI",           cls: "sel-ai"   },
  { id: "ml",   label: "ML",           cls: "sel-ml"   },
  { id: "data", label: "Data Science", cls: "sel-data" },
  { id: "web",  label: "Web",          cls: "sel-web"  },
  { id: "sec",  label: "Security",     cls: "sel-sec"  },
  { id: "iot",  label: "IoT",          cls: "sel-iot"  },
];

export const ALL_TECH = [
  // Frontend
  { id: "javascript",   name: "JavaScript",   color: "#F7DF1E" },
  { id: "typescript",   name: "TypeScript",   color: "#3178C6" },
  { id: "react",        name: "React",        color: "#61DAFB" },
  { id: "vue",          name: "Vue",          color: "#42B883" },
  { id: "nextjs",       name: "Next.js",      color: "#000000" },
  { id: "angular",      name: "Angular",      color: "#DD0031" },
  { id: "svelte",       name: "Svelte",       color: "#FF3E00" },
  { id: "tailwind",     name: "Tailwind CSS", color: "#06B6D4" },
  // Backend
  { id: "nodejs",       name: "Node.js",      color: "#539E43" },
  { id: "express",      name: "Express.js",   color: "#000000" },
  { id: "java",         name: "Java",         color: "#E11D2C" },
  { id: "spring",       name: "Spring",       color: "#6DB33F" },
  { id: "python",       name: "Python",       color: "#3572A5" },
  { id: "django",       name: "Django",       color: "#092E20" },
  { id: "flask",        name: "Flask",        color: "#000000" },
  { id: "fastapi",      name: "FastAPI",      color: "#009688" },
  { id: "ruby",         name: "Ruby",         color: "#CC342D" },
  { id: "rails",        name: "Ruby on Rails",color: "#CC0000" },
  { id: "php",          name: "PHP",          color: "#777BB4" },
  { id: "laravel",      name: "Laravel",      color: "#FF2D20" },
  { id: "cpp",          name: "C++",          color: "#00599C" },
  { id: "csharp",       name: "C#",           color: "#512BD4" },
  { id: "go",           name: "Go",           color: "#00ACD7" },
  { id: "rust",         name: "Rust",         color: "#DEA584" },
  { id: "scala",        name: "Scala",        color: "#DC322F" },
  // ML / AI
  { id: "tensorflow",   name: "TensorFlow",   color: "#FF6F00" },
  { id: "pytorch",      name: "PyTorch",      color: "#EE4C2C" },
  { id: "pandas",       name: "Pandas",       color: "#150458" },
  // Database
  { id: "mysql",        name: "MySQL",        color: "#4479A1" },
  { id: "postgres",     name: "PostgreSQL",   color: "#336791" },
  { id: "mongodb",      name: "MongoDB",      color: "#47A248" },
  { id: "redis",        name: "Redis",        color: "#DC382D" },
  { id: "graphql",      name: "GraphQL",      color: "#E10098" },
  { id: "firebase",     name: "Firebase",     color: "#FFCA28" },
  { id: "elasticsearch",name: "Elasticsearch",color: "#005571" },
  // DevOps / Cloud
  { id: "aws",          name: "AWS",          color: "#FF9900" },
  { id: "docker",       name: "Docker",       color: "#2496ED" },
  { id: "kubernetes",   name: "Kubernetes",   color: "#326CE5" },
  { id: "git",          name: "Git",          color: "#F05032" },
  { id: "linux",        name: "Linux",        color: "#FCC624" },
  { id: "terraform",    name: "Terraform",    color: "#7B42BC" },
  // Mobile
  { id: "swift",        name: "Swift",        color: "#FA7343" },
  { id: "kotlin",       name: "Kotlin",       color: "#7F52FF" },
  { id: "flutter",      name: "Flutter",      color: "#02569B" },
  { id: "reactnative",  name: "React Native", color: "#61DAFB" },
  // Design / Game
  { id: "figma",        name: "Figma",        color: "#F24E1E" },
  { id: "unity",        name: "Unity",        color: "#000000" },
  { id: "unreal",       name: "Unreal Engine",color: "#0D1117" },
];
