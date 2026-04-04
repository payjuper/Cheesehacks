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


  /* ── REAL LOGIN ── */
  .login-root {
    min-height: 100vh; display: flex; position: relative;
    font-family: 'DM Sans', sans-serif;
  }

  .login-logo-wrap {
    position: fixed; top: 28px; left: 32px;
    display: flex; align-items: center; gap: 10px; z-index: 100;
  }
  .login-logo-text { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; color: #fff; }

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

  .login-heading { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.025em; line-height: 1.1; color: #111; }
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

  const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: { hd: 'wisc.edu', prompt: 'select_account' },
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  });
  if (error) setError(error.message);
};

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

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              <button className="login-btn" onClick={handleGoogleLogin}
                style={{ marginTop: '12px', background: '#fff', color: '#111', border: '1.5px solid var(--border)', boxShadow: 'none' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" style={{ flexShrink: 0 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google (wisc.edu only)
              </button>
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