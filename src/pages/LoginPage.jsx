import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red: #E14141;
    --muted: #999990;
    --border: #E8E5E0;
  }

  body { margin: 0; background: #fff; }

  /* ── FLASH ── */
  .flash {
    position: fixed; inset: 0; z-index: 9999;
    background: #fff;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.08s ease;
  }
  .flash.bang {
    opacity: 1;
    transition: none;
  }

  /* ── SPLASH ── */
  .splash {
    position: fixed; inset: 0; z-index: 999;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
  }
  .splash.gone { display: none; }

  .splash-logo-wrap {
    position: absolute; top: 28px; left: 32px;
    display: flex; align-items: center; gap: 10px;
  }
  .splash-logo-text { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #111; }

  .splash-content { width: 100%; max-width: 380px; padding: 24px; }

  .splash-card {
    width: 100%; background: #111;
    border: 1px solid #222; border-radius: 24px; padding: 40px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  }

  .splash-heading { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; color: #fff; }
  .splash-sub { font-size: 13px; font-weight: 300; color: rgba(255,255,255,0.4); margin-top: 8px; line-height: 1.6; }
  .splash-divider { height: 1px; background: #333; margin: 28px 0; }

  .splash-field { margin-bottom: 14px; }
  .splash-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 7px; }
  .splash-input { width: 100%; padding: 11px 14px; border: 1.5px solid #333; border-radius: 12px; background: #1a1a1a; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #444; outline: none; }
  .splash-input::placeholder { color: #333; }

  .splash-btn {
    width: 100%; padding: 12px; border-radius: 12px; border: none;
    background: #222; color: #444;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px;
  }
  .splash-btn svg { width: 14px; height: 14px; stroke: #444; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }

  .splash-toggle { text-align: center; margin-top: 20px; font-size: 12px; color: #444; }
  .splash-toggle span { color: #666; font-weight: 600; margin-left: 4px; }

  /* ── REAL LOGIN ── */
  .login-root {
    min-height: 100vh; display: flex; position: relative;
    font-family: 'DM Sans', sans-serif;
  }

  .login-logo-wrap {
    position: fixed; top: 28px; left: 32px;
    display: flex; align-items: center; gap: 10px; z-index: 100;
  }
  .login-logo-text { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #fff; }

  .login-left {
    flex: 1; position: relative;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; background: #1a1a2e;
  }

  .login-bg-video {
    position: absolute; inset: 0; width: 100%; height: 100%;
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
    align-items: center; width: 100%; max-width: 380px; padding: 24px;
  }

  .login-card {
    width: 100%; background: #fff;
    border: 1px solid #E8E5E0; border-radius: 24px; padding: 40px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }

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
    text-align: center; margin-top: 20px; font-size: 12px; color: var(--muted);
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

  @media (max-width: 860px) { .login-right { display: none; } }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [splashDone, setSplashDone] = useState(false);
  const [flashing, setFlashing]    = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space" && !splashDone) {
        e.preventDefault();
        // flash on
        setFlashing(true);
        setTimeout(() => {
          // hide splash, turn off flash
          setSplashDone(true);
          setFlashing(false);
        }, 120);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [splashDone]);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const result = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (result.error) { setError(result.error.message); return; }
    navigate("/");
  };

  return (
    <>
      <style>{style}</style>

      {/* Flash layer */}
      <div className={`flash${flashing ? " bang" : ""}`} />

      {/* Splash */}
      <div className={`splash${splashDone ? " gone" : ""}`}>
        <div className="splash-logo-wrap">
          <img src="/src/assets/logo.png" alt="logo" style={{ width: 200, height: 200, objectFit: "contain" }} />
          <span className="splash-logo-text">Pilot Episode</span>
        </div>
        <div className="splash-content">
          <div className="splash-card">
            <h1 className="splash-heading">Welcome back.</h1>
            <p className="splash-sub">Sign in to access your projects and profile.</p>
            <div className="splash-divider" />
            <div className="splash-field">
              <label className="splash-label">Email</label>
              <input className="splash-input" placeholder="you@university.edu" disabled />
            </div>
            <div className="splash-field">
              <label className="splash-label">Password</label>
              <input className="splash-input" type="password" placeholder="••••••••" disabled />
            </div>
            <button className="splash-btn" disabled>
              <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Sign In
            </button>
            <div className="splash-toggle">
              Don't have an account? <span>Sign up</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real login */}
      <div className="login-root">
        <div className="login-logo-wrap">
          <img src="/src/assets/logo.png" alt="logo" style={{ width: 200, height: 200, objectFit: "contain" }} />
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
                <input className="login-input" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>
              <div className="login-field">
                <label className="login-label">Password</label>
                <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
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
    </>
  );
}