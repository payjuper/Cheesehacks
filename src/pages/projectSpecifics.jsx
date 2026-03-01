import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
    --sidebar-w: 64px;
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; }

  .ps-root { margin-left: var(--sidebar-w); min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

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
  .wishlist-base:hover { border-color: #E14141 !important; color: #E14141 !important; }
  .ps-loading { display: flex; align-items: center; justify-content: center; padding: 80px 0; color: var(--muted); font-size: 15px; font-weight: bold; }
`;

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width={15} height={15} fill={filled ? "#E14141" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "fill 0.2s, transform 0.2s", transform: filled ? "scale(1.15)" : "scale(1)" }}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
);

const DefaultTechSvg = () => (
  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

function StackItem({ name }) {
  return (
    <div className="stack-item" style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 15px", borderRadius: 12,
      border: "1.5px solid #E8E5E0",
      background: "#F4F2EF", fontSize: 13, fontWeight: 500,
      transition: "border-color 0.18s, transform 0.15s", cursor: "default",
    }}>
      <span style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#111" }}>
        <DefaultTechSvg />
      </span>
      {name}
    </div>
  );
}

const roleColors = {
  fe: { bg: "#EEF4FF", stroke: "#3B6FE0" },
  ml: { bg: "#FFF0F0", stroke: "#E14141" },
  ds: { bg: "#F0FFF4", stroke: "#2E8B57" },
  ux: { bg: "#FFF8EE", stroke: "#E07B20" },
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

function RoleCard({ role, index, hasApplied, onApply, animClass }) {
  const types = ['fe', 'ml', 'ds', 'ux'];
  const type = types[index % types.length];
  const isFull = role.is_closed;

  return (
    <div className={`role-card-hover ${animClass}`} style={{
      background: "#fff", border: "1.5px solid #E8E5E0", borderRadius: 18,
      padding: "24px 22px 20px", display: "flex", flexDirection: "column", gap: 14,
      minWidth: 210, flex: 1, transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
      opacity: isFull ? 0.6 : 1,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <RoleIcon type={type} />
        <span style={{
          fontSize: 10, fontWeight: 500, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap",
          background: isFull ? "#FFF0F0" : "#F0FFF4", color: isFull ? "#E14141" : "#2E8B57",
          border: `1px solid ${isFull ? "#f5d5d5" : "#B2DFC0"}`,
        }}>
          {isFull ? "Closed" : "Open"}
        </span>
      </div>

      <div>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>{role.role_name}</p>
        {role.required_skills && (
          <p style={{ fontSize: 11, color: '#999990', fontWeight: 400, lineHeight: 1.5 }}>{role.required_skills}</p>
        )}
      </div>

      <div style={{ flexGrow: 1 }} />

      {hasApplied ? (
        <button disabled style={{ width: "100%", padding: 10, borderRadius: 10, border: "1.5px solid #f5d5d5", background: "#FFF0F0", color: "#E14141", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "not-allowed" }}>
          ✓ Applied
        </button>
      ) : isFull ? (
        <button disabled style={{ width: "100%", padding: 10, borderRadius: 10, border: "1.5px solid #E8E5E0", background: "#F4F2EF", color: "#999990", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "not-allowed" }}>
          Closed
        </button>
      ) : (
        <button className="join-btn-base" onClick={() => onApply(role.id, role.role_name)} style={{ width: "100%", padding: 10, borderRadius: 10, border: "1.5px solid #111", background: "#111", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
          Apply Now →
        </button>
      )}
    </div>
  );
}

export default function ProjectSpecifics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [appliedRoles, setAppliedRoles] = useState(new Set());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user || null;
        setCurrentUser(user);

        const { data, error } = await supabase
          .from('projects')
          .select(`*, profiles ( id, school_email ), project_roles ( id, role_name, is_closed, required_skills )`)
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);

        if (user && data.project_roles?.length > 0) {
          const roleIds = data.project_roles.map(r => r.id);
          const { data: appliedData } = await supabase
            .from('applications')
            .select('role_id')
            .eq('applicant_id', user.id)
            .in('role_id', roleIds);

          if (appliedData) {
            setAppliedRoles(new Set(appliedData.map(a => a.role_id)));
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        alert('This project does not exist or has been deleted.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleApply = async (roleId, roleName) => {
    if (!currentUser) {
      alert('Please log in to apply!');
      navigate('/login');
      return;
    }
    const { error } = await supabase.from('applications').insert([{
      role_id: roleId, applicant_id: currentUser.id, message: "I'd love to join!", status: "pending"
    }]);

    if (error) {
      if (error.code === '23505') alert('You have already applied for this position!');
      else alert('Error submitting application: ' + error.message);
    } else {
      alert(`Successfully applied for [${roleName}]! Check your profile to see the status.`);
      setAppliedRoles(prev => new Set(prev).add(roleId));
    }
  };

  if (loading) return <div className="ps-root ps-loading"><style>{styles}</style>Loading project details...</div>;
  if (!project) return null;

  const authorEmail = project.profiles?.school_email || 'Anonymous';
  const authorName = authorEmail.split('@')[0];
  const techStacksArray = project.tech_stacks ? project.tech_stacks.split(',').map(t => t.trim()) : [];

  return (
    <div className="ps-root">
      <style>{styles}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

        <section style={{ display: "flex", alignItems: "flex-start", width: "100%", maxWidth: 860, padding: "48px 40px 0" }}>
          <div className="rise" style={{ background: "#fff", border: "1px solid #E8E5E0", borderRadius: 28, width: "100%", padding: "52px 52px 44px", boxShadow: "0 8px 48px rgba(0,0,0,0.06)" }}>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", padding: "5px 13px", borderRadius: 100, border: "1.5px solid #111", background: "#111", color: "#fff" }}>
                  {project.category_tag || "General"}
                </span>
              </div>
              <button className="wishlist-base" onClick={() => setSaved(s => !s)} style={{ background: saved ? "#FFF0F0" : "none", border: `1.5px solid ${saved ? "#E14141" : "#E8E5E0"}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: saved ? "#E14141" : "#999990", padding: "8px 14px", borderRadius: 100, transition: "all 0.2s" }}>
                <HeartIcon filled={saved} /> {saved ? "Saved" : "Save"}
              </button>
            </div>

            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: 16 }}>
              {project.title}
            </h1>
            <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.75, color: "#333", marginBottom: 36, whiteSpace: "pre-wrap" }}>
              {project.content}
            </p>

            <div style={{ height: 1, background: "#E8E5E0", marginBottom: 30 }} />

            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999990", marginBottom: 14 }}>
              Tech Stack
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {techStacksArray.length > 0 ? techStacksArray.map((tech, idx) => (
                <StackItem key={idx} name={tech} />
              )) : <span style={{ fontSize: 13, color: "#999" }}>Not specified</span>}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 34, paddingTop: 24, borderTop: "1px solid #E8E5E0", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#E14141", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 14, color: "#555", fontWeight: 500 }}>Led by <strong style={{ color: "#111" }}>{authorName}</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#999990" }}>Posted <strong style={{ fontWeight: 500, color: "#444" }}>{new Date(project.created_at).toLocaleDateString()}</strong></span>
              </div>
            </div>

          </div>
        </section>

        <div style={{ width: "100%", maxWidth: 860, padding: "28px 40px 80px", alignSelf: "flex-start" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#111" }}>Open Positions</h3>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 10, msOverflowStyle: "none", scrollbarWidth: "none" }}>
            {project.project_roles && project.project_roles.length > 0 ? (
              project.project_roles.map((role, idx) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  index={idx}
                  hasApplied={appliedRoles.has(role.id)}
                  onApply={handleApply}
                  animClass={`rise-${(idx % 4) + 1}`}
                />
              ))
            ) : (
              <p style={{ color: "#999", fontSize: 14 }}>No open positions listed.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}