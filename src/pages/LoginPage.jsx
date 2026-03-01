import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  }

  .login-root {
    min-height: 100vh; display: flex;
    background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text);
  }

  /* ── Left panel ── */
  .login-left {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px; position: relative; overflow: hidden;
  }

  .login-card {
    width: 100%; max-width: 380px;
    animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }

  .login-logo {
    display: flex; align-items: center; gap: 10px; margin-bottom: 40px;
    animation: fade 0.4s ease both;
  }
  .login-logo-dot {
    width: 32px; height: 32px; border-radius: 10px;
    background: var(--red); display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(225,65,65,0.35);
  }
  .login-logo-dot svg { width: 16px; height: 16px; stroke: #fff; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .login-logo-text { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }

  .login-heading { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; }
  .login-sub { font-size: 13px; font-weight: 300; color: var(--muted); margin-top: 8px; line-height: 1.6; }

  .login-divider { height: 1px; background: var(--border); margin: 28px 0; }

  /* ── Fields ── */
  .login-field { margin-bottom: 14px; }
  .login-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 7px; }
  .login-input {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid var(--border); border-radius: 12px;
    background: var(--card); font-family: 'DM Sans', sans-serif;
    font-size: 13px; color: var(--text); outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .login-input:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(225,65,65,0.08); }
  .login-input::placeholder { color: #ccc; }

  .login-btn {
    width: 100%; padding: 12px; border-radius: 12px; border: none;
    background: var(--red); color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; margin-top: 8px;
    box-shadow: 0 4px 16px rgba(225,65,65,0.32);
    transition: all 0.18s; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .login-btn:hover:not(:disabled) { background: #d03232; transform: translateY(-1px); box-shadow: 0 6px 22px rgba(225,65,65,0.4); }
  .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .login-btn svg { width: 14px; height: 14px; stroke: #fff; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }

  .login-error {
    background: var(--red-light); border: 1.5px solid #F5C6C6;
    border-radius: 10px; padding: 10px 14px;
    font-size: 12px; color: var(--red); margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .login-error svg { width: 13px; height: 13px; stroke: var(--red); fill: none; stroke-width: 2; stroke-linecap: round; flex-shrink: 0; }

  .login-toggle {
    text-align: center; margin-top: 20px;
    font-size: 12px; color: var(--muted);
  }
  .login-toggle button {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 12px;
    color: var(--red); font-weight: 600; padding: 0; margin-left: 4px;
    transition: opacity 0.15s;
  }
  .login-toggle button:hover { opacity: 0.7; }

  /* ── Right panel ── */
  .login-right {
    width: 480px; flex-shrink: 0;
    background: #111; position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: flex-end; padding: 48px;
  }
  .login-right::before {
    content: ''; position: absolute; inset: 0;
    background: repeating-linear-gradient(
      45deg, transparent, transparent 60px,
      rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px
    );
  }
  .login-glow {
    position: absolute; top: -80px; right: -80px;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(225,65,65,0.22) 0%, transparent 65%);
    pointer-events: none;
  }
  .login-glow2 {
    position: absolute; bottom: -60px; left: -60px;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(59,111,224,0.15) 0%, transparent 65%);
    pointer-events: none;
  }

  .login-right-content { position: relative; z-index: 1; }
  .login-right-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(225,65,65,0.15); border: 1px solid rgba(225,65,65,0.3);
    border-radius: 100px; padding: 5px 12px;
    font-size: 11px; font-weight: 500; color: #ff8c8c;
    letter-spacing: 0.04em; margin-bottom: 20px;
  }
  .login-right-tag span { width: 6px; height: 6px; border-radius: 50%; background: #E14141; display: inline-block; }
  .login-right-quote {
    font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800;
    color: #fff; line-height: 1.2; letter-spacing: -0.025em; margin-bottom: 16px;
  }
  .login-right-quote em { color: #E14141; font-style: normal; }
  .login-right-desc { font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.45); line-height: 1.65; margin-bottom: 32px; }

  .login-features { display: flex; flex-direction: column; gap: 12px; }
  .login-feature { display: flex; align-items: center; gap: 12px; }
  .login-feature-icon {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
  }
  .login-feature-icon svg { width: 14px; height: 14px; stroke: rgba(255,255,255,0.6); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .login-feature-text { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 300; }
  .login-feature-text strong { color: rgba(255,255,255,0.85); font-weight: 500; display: block; font-size: 13px; margin-bottom: 1px; }

  @media (max-width: 860px) {
    .login-right { display: none; }
    .login-left { padding: 32px 24px; }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    let result;
    if (mode === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="login-root">
      <style>{style}</style>

      {/* Left — form */}
      <div className="login-left">
        <div className="login-card">

          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-dot">
              <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <span className="login-logo-text">Cheesehacks</span>
          </div>

          <h1 className="login-heading">
            {mode === "login" ? "Welcome back." : "Join the community."}
          </h1>
          <p className="login-sub">
            {mode === "login"
              ? "Sign in to access your projects and profile."
              : "Create an account to start building and collaborating."}
          </p>

          <div className="login-divider" />

          {error && (
            <div className="login-error">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              className="login-input"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <button className="login-btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Please wait…"
              : mode === "login"
                ? <><svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>Sign In</>
                : <><svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>Create Account</>
            }
          </button>

          <div className="login-toggle">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>

        </div>
      </div>

      {/* Right — branding panel */}
      <div className="login-right">
        <div className="login-glow" />
        <div className="login-glow2" />
        <div className="login-right-content">
          <div className="login-right-tag">
            <span />
            Student Projects Platform
          </div>
          <div className="login-right-quote">
            Build things that <em>matter.</em> Find people who care.
          </div>
          <p className="login-right-desc">
            A space for students to publish projects, find collaborators, and grow their skills together.
          </p>
          <div className="login-features">
            {[
              { icon: <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, title: "Publish Projects", desc: "Share what you're building with the community" },
              { icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, title: "Find Collaborators", desc: "Connect with students who share your interests" },
              { icon: <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, title: "Grow Your Stack", desc: "Discover new technologies through real projects" },
            ].map((f, i) => (
              <div key={i} className="login-feature">
                <div className="login-feature-icon">{f.icon}</div>
                <div className="login-feature-text">
                  <strong>{f.title}</strong>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
