import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red: #E14141;
    --text: #111111;
    --muted: #999990;
    --border: #E8E5E0;
  }

  .login-root {
    min-height: 100vh; display: flex; position: relative;
    font-family: 'DM Sans', sans-serif;
  }

  body { background: #1a1a2e !important; margin: 0; }

  .login-logo-wrap {
    position: fixed; top: 28px; left: 32px;
    display: flex; align-items: center;
    gap: 10px; z-index: 100; animation: fade 0.4s ease both;
  }
  .login-logo-text { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #fff; }

  .login-left {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #1a1a2e;
  }

  .login-bg-video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover; z-index: 0; opacity: 0.55;
  }

  .login-bg-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(10,10,20,0.55) 0%, rgba(10,10,30,0.35) 100%);
    z-index: 0;
  }

  .login-content {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    align-items: center; width: 100%; max-width: 380px;
    padding: 24px;
  }

  .login-card {
    width: 100%;
    background: #fff;
    border: 1px solid #E8E5E0;
    border-radius: 24px; padding: 40px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }

  .login-heading { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; color: #111; }
  .login-sub { font-size: 13px; font-weight: 300; color: var(--muted); margin-top: 8px; line-height: 1.6; }
  .login-divider { height: 1px; background: var(--border); margin: 28px 0; }

  .login-field { margin-bottom: 14px; }
  .login-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); margin-bottom: 7px; }
  .login-input { width: 100%; padding: 11px 14px; border: 1.5px solid var(--border); border-radius: 12px; background: #F4F2EF; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #111; outline: none; transition: border-color 0.18s, box-shadow 0.18s; }
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
    background: #FFF0F0; border: 1.5px solid #F5C6C6;
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

  .login-right { width: 480px; flex-shrink: 0; position: relative; overflow: hidden; }
  .login-right img { width: 100%; height: 100%; object-fit: cover; display: block; }

  @media (max-width: 860px) {
    .login-right { display: none; }
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const result = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (result.error) { setError(result.error.message); return; }
    navigate("/");
  };

  return (
    <div className="login-root">
      <style>{style}</style>

      {/* Logo fixed top-left, outside everything */}
      <div className="login-logo-wrap">
        <img src="/src/assets/logo.png" alt="logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
        <span className="login-logo-text">Pilot Episode</span>
      </div>

      <div className="login-left">
        <video className="login-bg-video" src="/src/assets/jet.mp4" autoPlay loop muted playsInline />
        <div className="login-bg-overlay" />

        <div className="login-content">
          <div className="login-card">
            <h1 className="login-heading">Welcome back.</h1>
            <p className="login-sub">Sign in to access your projects and profile.</p>

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
              {loading ? "Please wait…" : (
                <>
                  <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Sign In
                </>
              )}
            </button>

            <div className="login-toggle">
              Don't have an account?
              <button onClick={() => navigate("/register")}>Sign up</button>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <img src="/src/assets/pilotEpisoe.JPG" alt="background" />
      </div>
    </div>
  );
}