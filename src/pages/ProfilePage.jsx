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

// 🚨 기존 친구 CSS의 맨 밑에 "모달과 폼 전용 CSS"를 추가했습니다!
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

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  .pp-root { margin-left: var(--sidebar-w); min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

.pp-banner { height: 160px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 40%, #1f1f1f 100%); position: relative; overflow: hidden; margin-left: calc(-1 * var(--sidebar-w)); padding-left: var(--sidebar-w); }
  .pp-banner-accent { position: absolute; bottom: -40px; right: -40px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(225,65,65,0.18) 0%, transparent 70%); }
  .pp-header { padding: 0 48px; position: relative; }
  .pp-avatar-wrap { position: relative; display: inline-block; margin-top: -44px; margin-bottom: 16px; animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-avatar { width: 88px; height: 88px; border-radius: 50%; border: 4px solid var(--bg); background: linear-gradient(135deg, #E14141, #ff8c8c); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #fff; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
  .pp-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .pp-identity { animation: rise 0.5s 0.05s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-name { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1; }
  .pp-email { font-size: 13px; font-weight: 300; color: var(--muted); margin-top: 4px; }
  .pp-actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; animation: rise 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-btn { display: flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.18s; text-decoration: none; }
  .pp-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .pp-btn-outline { border: 1.5px solid var(--border); background: var(--card); color: var(--muted); }
  .pp-btn-outline:hover { border-color: #bbb; color: var(--text); }
  .pp-btn-red { border: none; background: var(--red); color: #fff; box-shadow: 0 2px 10px rgba(225,65,65,0.28); }
  .pp-btn-red:hover { background: #d03232; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(225,65,65,0.36); }
  .pp-divider { height: 1px; background: var(--border); margin: 24px 48px 0; }
  .pp-body { display: grid; grid-template-columns: 260px 1fr; gap: 24px; padding: 24px 48px 80px; }
  .pp-sidebar { display: flex; flex-direction: column; gap: 16px; }
  .pp-card { background: var(--card); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.04); animation: rise 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-card-header { padding: 16px 20px 12px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
  .pp-card-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800; letter-spacing: -0.01em; }
  .pp-card-body { padding: 16px 20px; }
  .pp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pp-stat { background: var(--bg); border-radius: 12px; padding: 12px 14px; border: 1px solid var(--border); }
  .pp-stat-num { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; line-height: 1; }
  .pp-stat-label { font-size: 10px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }
  .pp-tech-grid { display: flex; flex-wrap: wrap; gap: 7px; }
  .pp-tech-chip { display: flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 9px; border: 1.5px solid var(--border); background: var(--bg); font-size: 11px; font-weight: 500; transition: border-color 0.18s; }
  .pp-tech-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .pp-empty-tech { font-size: 12px; color: var(--muted); font-weight: 300; }
  .pp-main { display: flex; flex-direction: column; gap: 16px; }
  .pp-proj-list { display: flex; flex-direction: column; gap: 10px; }
  .pp-proj-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; display: flex; align-items: center; gap: 16px; text-decoration: none; color: inherit; transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s; animation: rise 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .pp-proj-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.08); border-color: #d8d4ce; transform: translateY(-2px); }
  .pp-proj-card:hover .pp-proj-title { color: var(--red); }
  .pp-proj-img { width: 56px; height: 56px; border-radius: 12px; flex-shrink: 0; background: linear-gradient(135deg, #f0ede9, #e8e4df); overflow: hidden; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; }
  .pp-proj-img img { width: 100%; height: 100%; object-fit: cover; }
  .pp-proj-img svg { width: 20px; height: 20px; stroke: #ccc; fill: none; stroke-width: 1.5; }
  .pp-proj-info { flex: 1; min-width: 0; }
  .pp-proj-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; letter-spacing: -0.01em; transition: color 0.18s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pp-proj-desc { font-size: 12px; font-weight: 300; color: var(--muted); line-height: 1.5; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pp-proj-tags { display: flex; gap: 5px; margin-top: 8px; flex-wrap: wrap; }
  .pp-proj-tag { font-size: 10px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; padding: 3px 9px; border-radius: 100px; border: 1.5px solid transparent; }
  .tag-ai   { background: #FFF0F0; color: #E14141; border-color: #F5C6C6; }
  .tag-data { background: #EEF4FF; color: #3B6FE0; border-color: #C3D5F8; }
  .tag-ml   { background: #F0FFF4; color: #2E8B57; border-color: #B2DFC0; }
  .tag-web  { background: #FFF8EE; color: #E07B20; border-color: #F5D9B0; }
  .tag-sec  { background: #F5F0FF; color: #7B3FE4; border-color: #D4B8F8; }
  .tag-iot  { background: #F0F9FF; color: #0284C7; border-color: #BAE6FD; }
  .tag-default { background: #f3f4f6; color: #4b5563; border-color: #e5e7eb; }
  .pp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 0; gap: 10px; color: var(--muted); font-size: 13px; font-weight: 300; background: var(--card); border: 1px solid var(--border); border-radius: 18px; }
  .pp-empty svg { width: 32px; height: 32px; stroke: #ddd; fill: none; stroke-width: 1.5; }
  .pp-loading { display: flex; align-items: center; justify-content: center; padding: 80px 0; color: var(--muted); font-size: 13px; }

  /* 🚨🚨 완벽 방어! 100% 뜨는 모달창 & 폼 강제 CSS 🚨🚨 */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 99999; display: flex; align-items: center; justify-content: center; }
  .modal-box { background: #fff; width: 100%; max-width: 500px; max-height: 90vh; border-radius: 20px; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.3); animation: rise 0.3s cubic-bezier(0.22,1,0.36,1) forwards; }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg); border-radius: 20px 20px 0 0; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: var(--text); }
  .modal-close { background: none; border: none; font-size: 32px; color: var(--muted); cursor: pointer; line-height: 1; transition: color 0.2s; }
  .modal-close:hover { color: var(--red); }
  .modal-body { padding: 24px; overflow-y: auto; font-family: 'DM Sans', sans-serif; }
  
  .form-group { margin-bottom: 24px; }
  .form-label { display: block; font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--text); }
  .form-input { width: 100%; padding: 12px 16px; border: 1px solid #ccc; border-radius: 10px; font-family: inherit; font-size: 14px; transition: border-color 0.2s; }
  .form-input:focus { outline: none; border-color: var(--red); box-shadow: 0 0 0 3px var(--red-light); }
  .tag-container { display: flex; flex-wrap: wrap; gap: 8px; }
  .tag-btn { padding: 8px 14px; border-radius: 100px; border: 1px solid #ddd; background: #f9f9f9; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; color: #555; }
  .tag-btn:hover { border-color: #bbb; }
  .tag-btn.active-skill { background: var(--text); color: #fff; border-color: var(--text); }
  .tag-btn.active-interest { background: var(--red); color: #fff; border-color: var(--red); }
  
  .modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border); }
  .btn-cancel { padding: 12px 24px; border: 1px solid #ccc; border-radius: 10px; background: #fff; cursor: pointer; font-weight: 700; color: #555; transition: background 0.2s; }
  .btn-cancel:hover { background: #f5f5f5; }
  .btn-save { padding: 12px 24px; border: none; border-radius: 10px; background: var(--red); color: #fff; cursor: pointer; font-weight: 700; transition: background 0.2s, transform 0.1s; }
  .btn-save:hover { background: #c93636; }
  .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const TAG_CLASS = {
  AI: "tag-ai", ML: "tag-ml", "Data Science": "tag-data",
  Web: "tag-web", Security: "tag-sec", IoT: "tag-iot",
};

const TECH_COLORS = {
  python: "#3572A5", react: "#61DAFB", nodejs: "#539E43",
  fastapi: "#009688", tensorflow: "#FF6F00", pytorch: "#EE4C2C",
  docker: "#2496ED", pandas: "#150458", postgres: "#336791",
  mongodb: "#47A248", typescript: "#3178C6", rust: "#DEA584",
  go: "#00ACD7", vue: "#42B883", nextjs: "#555", graphql: "#E10098",
};

function normalizeList(raw) {
  if (Array.isArray(raw) && raw.length > 0) return raw;
  if (typeof raw === "string") {
    const parsed = raw.split(",").map((v) => v.trim()).filter(Boolean);
    return parsed.length > 0 ? parsed : [];
  }
  return [];
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
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editGithub, setEditGithub] = useState("");

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
        setEditLinkedin(profileRow.linkedin_url || "");
        setEditGithub(profileRow.github_url || "");

        const { data: postsData } = await supabase
          .from("projects")
          .select("*")
          .eq("author_id", profileRow.id)
          .order("created_at", { ascending: false });
        setProjects(postsData || []);

        const { data: appsData } = await supabase
          .from("applications")
          .select(`
            id, created_at, status, message,
            project_roles ( role_name, projects ( id, title, content, category_tag, images ) )
          `)
          .eq("applicant_id", profileRow.id)
          .order("created_at", { ascending: false });
        
        const formattedApps = (appsData || []).map(app => {
          const roleData = Array.isArray(app.project_roles) ? app.project_roles[0] : app.project_roles;
          const projectData = Array.isArray(roleData?.projects) ? roleData.projects[0] : roleData?.projects;
          return {
            appId: app.id,
            status: app.status,
            role_name: roleData?.role_name,
            ...projectData
          };
        });
        setApplications(formattedApps);
      }
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [routeKey]);

  const toggleArrayItem = (item, array, setArray) => {
    if (array.includes(item)) setArray(array.filter(i => i !== item));
    else setArray([...array, item]);
  };

  // 🚨 더욱 강력해진 모달 저장 버튼 로직 (에러 추적 및 완벽 업데이트)
  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!profile?.id) {
      alert("프로필 정보를 찾을 수 없습니다.");
      setSaving(false);
      return;
    }

    try {
      // 💡 DB에 보낼 데이터 (DB가 text[] 배열을 원하면 join()을 빼야 할 수도 있습니다!)
      const payload = {
        linkedin_url: editLinkedin,
        github_url: editGithub,
        technical_skills: selectedSkills.join(", "),
        interest_tags: selectedTags.join(", ")
      };

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", profile.id)
        .select(); // 🚨 이거 없으면 업데이트 성공 여부를 정확히 알 수 없습니다!

      if (updateError) {
        console.error("❌ DB 업데이트 에러:", updateError);
        alert(`저장 실패: ${updateError.message} \n(F12 콘솔창을 확인하세요!)`);
      } else if (!data || data.length === 0) {
        console.warn("⚠️ 조용히 차단됨: 업데이트된 데이터가 0개입니다.");
        alert("DB 수정 권한이 없습니다! Supabase에서 profiles 테이블의 RLS(보안)를 꺼주세요.");
      } else {
        console.log("✅ 저장 완료:", data);
        setProfile(prev => ({ 
          ...prev, 
          ...payload 
        }));
        setIsEditOpen(false); 
        alert("saved!");
      }
    } catch (err) {
      console.error("❌ 알 수 없는 에러:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="pp-loading"><style>{style}</style>Loading...</div>;
  if (!profile) return <div className="pp-loading"><style>{style}</style>User not found.</div>;

  const initials = profile.school_email.slice(0, 2).toUpperCase();
  const displayName = profile.school_email.split("@")[0];
  const avatarUrl = profile.avatar_url;

  return (
    <div className="pp-root">
      <style>{style}</style>

      {/* Banner */}
      <div className="pp-banner">
        <div className="pp-banner-accent" />
      </div>

      {/* Header */}
      <div className="pp-header">
        <div className="pp-avatar-wrap">
          <div className="pp-avatar">
            {avatarUrl ? <img src={avatarUrl} alt={displayName} /> : initials}
          </div>
        </div>

        <div className="pp-identity">
          <div className="pp-name">{displayName}</div>
          <div className="pp-email">{profile.school_email}</div>
        </div>

        <div className="pp-actions">
          <a className="pp-btn pp-btn-outline" href={`mailto:${profile.school_email}`}>
            <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
            Email
          </a>
          
          {isMyProfile && (
            <button className="pp-btn pp-btn-red" onClick={() => setIsEditOpen(true)}>
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="pp-divider" />

      {/* Body */}
      <div className="pp-body">
        <div className="pp-sidebar">
          <div className="pp-card" style={{ animationDelay: "0.05s" }}>
            <div className="pp-card-header">
              <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span className="pp-card-title">Overview</span>
            </div>
            <div className="pp-card-body">
              <div className="pp-stats">
                <div className="pp-stat">
                  <div className="pp-stat-num">{projects.length}</div>
                  <div className="pp-stat-label">Posted</div>
                </div>
                <div className="pp-stat">
                  <div className="pp-stat-num">{applications.length}</div>
                  <div className="pp-stat-label">Applied</div>
                </div>
                <div className="pp-stat" style={{ gridColumn: "span 2" }}>
                  <div className="pp-stat-num">{selectedTags.length}</div>
                  <div className="pp-stat-label">Interests</div>
                  <div className="pp-tech-grid" style={{ marginTop: 8 }}>
                    {selectedTags.map(tag => (
                      <div key={tag} className="pp-tech-chip" style={{ fontSize: 10, padding: "2px 8px" }}>{tag}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pp-card" style={{ animationDelay: "0.1s" }}>
            <div className="pp-card-header">
              <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              <span className="pp-card-title">Tech Stack</span>
            </div>
            <div className="pp-card-body">
              {selectedSkills.length > 0 ? (
                <div className="pp-tech-grid">
                  {selectedSkills.map(name => (
                    <div key={name} className="pp-tech-chip">
                      <span className="pp-tech-dot" style={{ background: TECH_COLORS[name.toLowerCase()] ?? "#E14141" }} />
                      {name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="pp-empty-tech">No technologies selected.</p>
              )}
            </div>
          </div>
        </div>

        <div className="pp-main">
          <div className="pp-card" style={{ animationDelay: "0.08s" }}>
            <div className="pp-card-header">
              <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <span className="pp-card-title">Posted Projects</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{projects.length} total</span>
            </div>
            <div className="pp-card-body" style={{ padding: "12px 16px" }}>
              {projects.length === 0 ? (
                <div className="pp-empty">
                  <span>작성한 프로젝트가 없습니다.</span>
                </div>
              ) : (
                <div className="pp-proj-list">
                  {projects.map((p, i) => (
                    <a key={p.id} href={`/post/${p.id}`} className="pp-proj-card" style={{ animationDelay: `${0.1 + i * 0.04}s` }}>
                      <div className="pp-proj-img">
                        {(p.images ?? [])[0] ? <img src={p.images[0]} alt={p.title} /> : <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                      </div>
                      <div className="pp-proj-info">
                        <div className="pp-proj-title">{p.title}</div>
                        <div className="pp-proj-desc">{p.content}</div>
                      </div>
                      <div className="pp-proj-arrow">
                        <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pp-card" style={{ animationDelay: "0.12s" }}>
            <div className="pp-card-header">
              <svg style={{width:14,height:14,stroke:"var(--muted)",fill:"none",strokeWidth:2,strokeLinecap:"round"}} viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span className="pp-card-title">Applied Positions</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>{applications.length} total</span>
            </div>
            <div className="pp-card-body" style={{ padding: "12px 16px" }}>
              {applications.length === 0 ? (
                <div className="pp-empty">
                  <span>Start Applying Today!</span>
                </div>
              ) : (
                <div className="pp-proj-list">
                  {applications.map((app, i) => (
                    <a key={app.appId} href={`/post/${app.id}`} className="pp-proj-card" style={{ animationDelay: `${0.1 + i * 0.04}s` }}>
                      <div className="pp-proj-img">
                        {(app.images ?? [])[0] ? <img src={app.images[0]} alt={app.title} /> : <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                      </div>
                      <div className="pp-proj-info">
                        <div className="pp-proj-title">{app.title}</div>
                        <div className="pp-proj-desc">Applied for: {app.role_name}</div>
                        <div className="pp-proj-tags">
                          <span className="pp-proj-tag tag-ai">{app.status}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🚨 Tailwind 다 버리고 완벽한 자체 CSS로 만든 폼! */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleEditSave}>
          <div className="form-group">
            <span className="form-label">Technical Skills</span>
            <div className="tag-container">
              {SKILL_OPTIONS.map(skill => (
                <button key={skill} type="button" onClick={() => toggleArrayItem(skill, selectedSkills, setSelectedSkills)} className={`tag-btn ${selectedSkills.includes(skill) ? 'active-skill' : ''}`}>
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">Interest Tags</span>
            <div className="tag-container">
              {INTEREST_OPTIONS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleArrayItem(tag, selectedTags, setSelectedTags)} className={`tag-btn ${selectedTags.includes(tag) ? 'active-interest' : ''}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">LinkedIn URL</span>
            <input type="url" value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="form-input" />
          </div>

          <div className="form-group">
            <span className="form-label">GitHub URL</span>
            <input type="url" value={editGithub} onChange={(e) => setEditGithub(e.target.value)} placeholder="https://github.com/..." className="form-input" />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={() => setIsEditOpen(false)} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={saving} className="btn-save">{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}