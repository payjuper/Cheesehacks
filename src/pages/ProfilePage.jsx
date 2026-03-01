import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Feed from "../components/Feed";
import Modal from "../components/Modal";
import { supabase } from "../supabaseClient";

const SKILL_OPTIONS = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Next.js', 'Node.js', 
    'Java', 'Spring', 'Python', 'Django', 'Ruby', 'Ruby on Rails',
    'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'GraphQL', 
    'AWS', 'Docker', 'Kubernetes', 'Firebase',
    'Figma', 'UI/UX', 'Unity', 'Unreal Engine'
];
const INTEREST_OPTIONS = ['Web Dev', 'Mobile App', 'AI/ML', 'Game Dev', 'Data Science', 'Fintech', 'EdTech', 'Startup', 'Cyber Security', 'Blockchain'];

const fallbackProfile = { id: "unknown-user", school_email: "unknown@school.edu", manner_temp: 50, github_url: "", linkedin_url: "", avatar_url: "https://www.gravatar.com/avatar/?d=mp&s=300" };

function isUuid(value) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value)); }
function clamp01to100(n) { return Math.max(0, Math.min(100, Number(n) || 50)); }
function normalizeList(raw, fallback) {
  if (Array.isArray(raw) && raw.length > 0) return raw;
  if (typeof raw === "string") {
    const parsed = raw.split(",").map((v) => v.trim()).filter(Boolean);
    return parsed.length > 0 ? parsed : fallback;
  }
  return fallback;
}
function formatDate(dateString) {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleDateString();
}

function TimelineSection({ title, items }) {
  return (
    <section className="rounded-xl border border-[#E8E5E0] bg-white p-5 shadow-sm">
      <h4 className="text-lg font-bold text-[#111111] mb-4 font-['Syne',_sans-serif]">{title}</h4>
      {items.length === 0 ? (
        <p className="text-sm text-[#999990] font-medium">내역이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-gray-100 bg-[#F4F2EF] p-4 transition-colors hover:bg-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[#111111]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#E14141] font-semibold">{item.content}</p>
                </div>
                <span className="whitespace-nowrap text-xs text-[#999990] font-bold">{formatDate(item.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const routeKey = id ?? "unknown-user";

  const [profile, setProfile] = useState({ ...fallbackProfile, id: routeKey });
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // 🚨 State 변수들이 덮어씌워지지 않도록 철저히 보호
  const [projectTimeline, setProjectTimeline] = useState([]); // 내가 쓴 글
  const [appTimeline, setAppTimeline] = useState([]); // 내가 지원한 내역
  
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editManner, setEditManner] = useState("50");

  useEffect(() => {
    let active = true;

    const fetchProfilePageData = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      const authUserId = authData?.user?.id;
      setCurrentUserId(authUserId);
      
      let profileRow = null;

      if (routeKey === "me" && authUserId) {
        const { data } = await supabase.from("profiles").select("*").eq("id", authUserId).maybeSingle();
        profileRow = data;
      } else if (isUuid(routeKey)) {
        const { data } = await supabase.from("profiles").select("*").eq("id", routeKey).maybeSingle();
        profileRow = data;
      } else {
        const { data } = await supabase.from("profiles").select("*").ilike("school_email", `${routeKey}@%`).maybeSingle();
        profileRow = data;
      }

      if (profileRow && active) {
        const normalizedProfile = { ...fallbackProfile, ...profileRow, manner_temp: clamp01to100(profileRow.manner_temp) };
        setProfile(normalizedProfile);
        
        setEditLinkedin(normalizedProfile.linkedin_url || "");
        setEditGithub(normalizedProfile.github_url || "");
        setEditManner(String(normalizedProfile.manner_temp));
        setSelectedSkills(normalizeList(profileRow.technical_skills, []));
        setSelectedTags(normalizeList(profileRow.interest_tags, []));

        // 1. 내가 쓴 글 (Project Timeline)
        const { data: postsData } = await supabase
          .from("projects")
          .select("id, author_id, title, category_tag, content, created_at")
          .eq("author_id", profileRow.id)
          .order("created_at", { ascending: false });
        setProjectTimeline(postsData || []);

        // 2. 내가 지원한 내역 (Application Timeline)
        const { data: appsData, error: appsError } = await supabase
          .from("applications")
          .select(`
            id, created_at, status,
            project_roles (
              role_name,
              projects ( title )
            )
          `)
          .eq("applicant_id", profileRow.id)
          .order("created_at", { ascending: false });

        if (appsError) console.error("지원 내역 에러:", appsError);

        const formattedApps = (appsData || []).map(app => {
          // Supabase가 데이터를 배열로 주든 객체로 주든 100% 안전하게 처리
          const roleData = Array.isArray(app.project_roles) ? app.project_roles[0] : app.project_roles;
          const projectData = Array.isArray(roleData?.projects) ? roleData.projects[0] : roleData?.projects;

          return {
            id: app.id,
            title: `[지원] ${projectData?.title || '삭제된 프로젝트'}`,
            content: `포지션: ${roleData?.role_name || '알 수 없음'} (상태: ${app.status || '대기중'})`,
            created_at: app.created_at
          };
        });
        setAppTimeline(formattedApps);
      }
      setLoading(false);
    };

    fetchProfilePageData();
    return () => { active = false; };
  }, [routeKey]);

  const displayId = profile.school_email.split('@')[0];
  const isMyProfile = currentUserId === profile.id;
  const commitCount = projectTimeline.length;

  const toggleArrayItem = (item, array, setArray) => {
    if (array.includes(item)) setArray(array.filter(i => i !== item));
    else setArray([...array, item]);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const nextManner = clamp01to100(editManner);

    if (isUuid(profile.id)) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          linkedin_url: editLinkedin,
          github_url: editGithub,
          manner_temp: nextManner,
          technical_skills: selectedSkills.join(", "),
          interest_tags: selectedTags.join(", ")
        })
        .eq("id", profile.id);

      if (updateError) {
        alert("저장 실패: " + updateError.message);
      } else {
        setProfile((prev) => ({
          ...prev, linkedin_url: editLinkedin, github_url: editGithub, manner_temp: nextManner,
        }));
        setIsEditOpen(false); 
      }
    }
    setSaving(false);
  };

  const blackBtn = "bg-black text-white hover:bg-black/85";
  const whitePill = "rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-medium text-black/80";

  if (loading) return <div className="ml-[64px] min-h-screen bg-[#F4F2EF] p-10 font-bold text-[#999990]">Loading profile...</div>;

  return (
    <section className="ml-[64px] min-h-screen bg-[#F4F2EF] p-4 lg:p-8 font-['DM_Sans',_sans-serif]">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-black/20 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 font-['Syne',_sans-serif]">Projects by {displayId}</h2>
            {profile.id !== "unknown-user" && <Feed authorId={profile.id} />}
          </div>

          <div className="rounded-2xl border border-black/20 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-black font-['Syne',_sans-serif]">Activity Timeline</h3>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <TimelineSection title="Applications" items={appTimeline} />
              <TimelineSection title="Posted Projects" items={projectTimeline} />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="relative rounded-2xl border border-black/20 bg-white p-6 shadow-sm text-center">
            <img src={profile.avatar_url || fallbackProfile.avatar_url} alt="profile avatar" className="mx-auto h-36 w-36 rounded-full border-4 border-black/20 bg-white object-cover" />
            <h2 className="mt-4 break-all text-3xl font-extrabold text-black font-['Syne',_sans-serif]">{displayId}</h2>
            <p className="mt-1 text-sm text-black/80 font-medium">{profile.school_email}</p>

            <div className="mt-5 h-3 w-full rounded-full bg-[#FFF0F0] overflow-hidden">
              <div className="h-3 rounded-full bg-[#E14141]" style={{ width: `${clamp01to100(profile.manner_temp)}%` }} />
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-black/60">Technical Skills</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {selectedSkills.length > 0 ? selectedSkills.map((skill) => (<span key={skill} className={whitePill}>{skill}</span>)) : <span className="text-xs text-gray-400">Not set</span>}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-black/60">Interest Tags</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {selectedTags.length > 0 ? selectedTags.map((tag) => (<span key={tag} className={whitePill}>{tag}</span>)) : <span className="text-xs text-gray-400">Not set</span>}
              </div>
            </div>

            {isMyProfile && (
              <div className="mt-8 text-center">
                <button onClick={() => setIsEditOpen(true)} className={`inline-flex rounded-xl px-8 py-3 text-sm font-bold shadow-md ${blackBtn}`}>
                  Edit Profile
                </button>
              </div>
            )}
            
            <div className="absolute bottom-4 right-4 rounded-full border border-[#E14141] bg-[#FFF0F0] px-3 py-1 text-xs font-bold text-[#E14141]">
              ● Posts {commitCount}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleEditSave} className="space-y-6">
          <div className="block">
            <span className="text-sm font-bold text-gray-700">Technical Skills</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(skill => (
                <button key={skill} type="button" onClick={() => toggleArrayItem(skill, selectedSkills, setSelectedSkills)} className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${selectedSkills.includes(skill) ? 'bg-black text-white border-black shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="block">
            <span className="text-sm font-bold text-gray-700">Interest Tags</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleArrayItem(tag, selectedTags, setSelectedTags)} className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${selectedTags.includes(tag) ? 'bg-[#E14141] text-white border-[#E14141] shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-gray-700">LinkedIn URL</span>
            <input type="url" value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E14141] focus:outline-none" />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-gray-700">GitHub URL</span>
            <input type="url" value={editGithub} onChange={(e) => setEditGithub(e.target.value)} placeholder="https://github.com/..." className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#E14141] focus:outline-none" />
          </label>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={() => setIsEditOpen(false)} className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[#E14141] px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-md disabled:opacity-60">{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}