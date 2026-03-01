import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Feed from "../components/Feed";
import Modal from "../components/Modal";
import { supabase } from "../supabaseClient";

// 💡 CreatePostForm과 100% 동일하게 통합된 기술 스택 리스트!
const SKILL_OPTIONS = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Next.js', 'Node.js', 
    'Java', 'Spring', 'Python', 'Django', 'Ruby', 'Ruby on Rails',
    'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'GraphQL', 
    'AWS', 'Docker', 'Kubernetes', 'Firebase',
    'Figma', 'UI/UX', 'Unity', 'Unreal Engine'
];

const INTEREST_OPTIONS = ['Web Dev', 'Mobile App', 'AI/ML', 'Game Dev', 'Data Science', 'Cyber Security', 'Blockchain & Web3', 'Hardware & IoT', 'UI/UX Design', 'Business & PM'];

const fallbackProfile = {
  id: "unknown-user",
  school_email: "unknown@school.edu",
  manner_temp: 50,
  github_url: "",
  linkedin_url: "",
  avatar_url: "https://www.gravatar.com/avatar/?d=mp&s=300", 
};

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value));
}

function clamp01to100(n) {
  return Math.max(0, Math.min(100, Number(n) || 50));
}

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
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString();
}

function buildTimeline(posts) {
  const appTimeline = posts.filter((post) => String(post.category_tag ?? "").toLowerCase().includes("app"));
  const projectTimeline = posts.filter((post) => !String(post.category_tag ?? "").toLowerCase().includes("app"));
  return { appTimeline, projectTimeline };
}

function TimelineSection({ title, items }) {
  return (
    <section className="rounded-xl border border-black/15 bg-white p-4">
      <h4 className="text-lg font-semibold text-black">{title}</h4>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-black/70">No timeline entries yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-black/10 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-black">{item.title}</p>
                  <p className="mt-1 text-sm text-black/80">{item.content}</p>
                </div>
                <span className="whitespace-nowrap text-xs text-black/60">{formatDate(item.created_at)}</span>
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
  const [posts, setPosts] = useState([]);
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

        const { data: postsData } = await supabase
          .from("projects")
          .select("id, author_id, title, category_tag, content, created_at")
          .eq("author_id", profileRow.id)
          .order("created_at", { ascending: false });
          
        setPosts(postsData || []);
      }
      setLoading(false);
    };

    fetchProfilePageData();
    return () => { active = false; };
  }, [routeKey]);

  const { appTimeline, projectTimeline } = useMemo(() => buildTimeline(posts), [posts]);
  const displayId = profile.school_email.split('@')[0];
  const commitCount = posts.length;
  const isMyProfile = currentUserId === profile.id;

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
          ...prev,
          linkedin_url: editLinkedin,
          github_url: editGithub,
          manner_temp: nextManner,
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
            <h2 className="text-xl font-semibold mb-4 font-['Syne',_sans-serif]">Explore Projects</h2>
            <Feed />
          </div>

          <div className="rounded-2xl border border-black/20 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-black font-['Syne',_sans-serif]">Timeline</h3>
              <span className="text-sm text-black/70">ID: {displayId}</span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <TimelineSection title="Application Timeline" items={appTimeline} />
              <TimelineSection title="Project Timeline" items={projectTimeline} />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="relative rounded-2xl border border-black/20 bg-white p-6 shadow-sm text-center">
            <img
              src={profile.avatar_url || fallbackProfile.avatar_url}
              alt="profile avatar"
              className="mx-auto h-36 w-36 rounded-full border-4 border-black/20 bg-white object-cover"
            />
            <h2 className="mt-4 break-all text-3xl font-extrabold text-black font-['Syne',_sans-serif]">{displayId}</h2>
            <p className="mt-1 text-sm text-black/80 font-medium">{profile.school_email}</p>

            <div className="mt-5 h-3 w-full rounded-full bg-[#FFF0F0] overflow-hidden">
              <div className="h-3 rounded-full bg-[#E14141]" style={{ width: `${clamp01to100(profile.manner_temp)}%` }} />
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-black/60">Technical Skills</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {selectedSkills.length > 0 ? selectedSkills.map((skill) => (
                  <span key={skill} className={whitePill}>{skill}</span>
                )) : <span className="text-xs text-gray-400">Not set</span>}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-black/60">Interest Tags</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {selectedTags.length > 0 ? selectedTags.map((tag) => (
                  <span key={tag} className={whitePill}>{tag}</span>
                )) : <span className="text-xs text-gray-400">Not set</span>}
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
              ● Commits {commitCount}
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
                <button
                  key={skill} type="button" onClick={() => toggleArrayItem(skill, selectedSkills, setSelectedSkills)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    selectedSkills.includes(skill) ? 'bg-black text-white border-black shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="block">
            <span className="text-sm font-bold text-gray-700">Interest Tags</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(tag => (
                <button
                  key={tag} type="button" onClick={() => toggleArrayItem(tag, selectedTags, setSelectedTags)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    selectedTags.includes(tag) ? 'bg-[#E14141] text-white border-[#E14141] shadow-sm' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
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
            <button type="button" onClick={() => setIsEditOpen(false)} className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[#E14141] px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-md disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}