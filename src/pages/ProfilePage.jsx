import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Feed from "../components/Feed";
import UserProfileCard from "../components/UserProfileCard";
import Modal from "../components/Modal";
import { supabase } from "../supabaseClient";

const PROFILE_EXTRA_PREFIX = "profile-extra:";

// DB schema (confirmed):
// profiles: id, school_email, manner_temp, github_url, linkedin_url, created_at
// projects: id, author_id, title, category_tag, content, created_at

const fallbackProfile = {
  id: "unknown-user",
  school_email: "unknown@school.edu",
  manner_temp: 0,
  github_url: "",
  linkedin_url: "https://www.linkedin.com",
  avatar_url: "https://www.gravatar.com/avatar/?d=mp&s=300", // fallback only (not in DB)
};

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value)
  );
}

function clamp01to100(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 50;
  return Math.max(0, Math.min(100, x));
}

function normalizeList(raw, fallback) {
  if (Array.isArray(raw) && raw.length > 0) return raw;
  if (typeof raw === "string") {
    const parsed = raw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    return parsed.length > 0 ? parsed : fallback;
  }
  return fallback;
}

function safeJsonParse(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getEmailLocalPart(email) {
  if (typeof email !== "string" || !email.includes("@")) return "";
  return email.split("@")[0]?.trim() || "";
}

function getDisplayId(profile, routeKey) {
  const localPart = getEmailLocalPart(profile?.school_email);
  if (localPart) return localPart;
  if (routeKey === "me") return "me";
  return profile?.id || routeKey || "unknown-user";
}

function formatDate(dateString) {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString();
}

function buildTimeline(posts) {
  const appTimeline = posts.filter((post) => {
    const tag = String(post.category_tag ?? "").toLowerCase();
    return tag.includes("app") || tag.includes("application");
  });

  const projectTimeline = posts.filter((post) => {
    const tag = String(post.category_tag ?? "").toLowerCase();
    return !(tag.includes("app") || tag.includes("application"));
  });

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

// routeKey: "me" | uuid | email(exact)
async function resolveProfileByRoute(routeKey) {
  // /user/me => logged-in user id
  if (routeKey === "me") {
    const { data, error } = await supabase.auth.getUser();
    const authUserId = data?.user?.id;

    if (!error && authUserId && isUuid(authUserId)) {
      const { data: profileRow, error: profileError } = await supabase
        .from("profiles")
        .select("id, school_email, manner_temp, github_url, linkedin_url, created_at")
        .eq("id", authUserId)
        .maybeSingle();

      return { profileRow: profileRow ?? null, error: profileError ?? null };
    }

    return { profileRow: null, error: error ?? { message: "No authenticated user for /user/me" } };
  }

  // uuid => profiles.id
  if (isUuid(routeKey)) {
    const { data: profileRow, error } = await supabase
      .from("profiles")
      .select("id, school_email, manner_temp, github_url, linkedin_url, created_at")
      .eq("id", routeKey)
      .maybeSingle();

    return { profileRow: profileRow ?? null, error };
  }

  // email exact => profiles.school_email
  if (String(routeKey).includes("@")) {
    const { data: profileRow, error } = await supabase
      .from("profiles")
      .select("id, school_email, manner_temp, github_url, linkedin_url, created_at")
      .eq("school_email", routeKey)
      .maybeSingle();

    return { profileRow: profileRow ?? null, error };
  }

  return { profileRow: null, error: { message: "Route param is not a stable profile identifier" } };
}

export default function ProfilePage() {
  // ✅ IMPORTANT: your App.jsx uses /profile/:id and /user/:id
  // so param name is :id (NOT :username)
  const { id } = useParams();
  const routeKey = id ?? "unknown-user";

  const [profile, setProfile] = useState({ ...fallbackProfile, id: routeKey });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editSkills, setEditSkills] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editManner, setEditManner] = useState("50");
  const [editDiscord, setEditDiscord] = useState("https://discord.com"); // local only

  useEffect(() => {
    let active = true;

    const fetchProfilePageData = async () => {
      setLoading(true);
      setErrorMessage("");

      const { profileRow, error: profileError } = await resolveProfileByRoute(routeKey);

      const normalizedProfile = {
        ...fallbackProfile,
        ...(profileRow ?? {}),
        id: profileRow?.id || routeKey,
        manner_temp: clamp01to100(profileRow?.manner_temp),
      };

      const authorId = profileRow?.id ?? null;
      const emailLocalPart = getEmailLocalPart(profileRow?.school_email);

      let postsData = [];
      let postsError = null;

      if (authorId) {
        const { data, error } = await supabase
          .from("projects")
          .select("id, author_id, title, category_tag, content, created_at")
          .eq("author_id", authorId)
          .order("created_at", { ascending: false })
          .limit(24);

        postsData = data ?? [];
        postsError = error ?? null;

        // legacy support: author_id가 local-part로 저장된 경우
        if (postsData.length === 0 && emailLocalPart) {
          const { data: legacyData, error: legacyErr } = await supabase
            .from("projects")
            .select("id, author_id, title, category_tag, content, created_at")
            .eq("author_id", emailLocalPart)
            .order("created_at", { ascending: false })
            .limit(24);

          // author_id가 uuid 타입이면 여기서 400/22P02가 날 수 있는데, 그땐 그냥 무시
          if (!legacyErr) postsData = legacyData ?? [];
        }
      }

      if (!active) return;

      if (!authorId && routeKey) {
        setErrorMessage("프로필 ID를 확정할 수 없습니다. /user/me 또는 /profile/<uuid> 로 접속하세요.");
      } else if (profileError || postsError) {
        setErrorMessage("Supabase loading issue detected. Showing available fallback data.");
      }

      const extra = safeJsonParse(localStorage.getItem(`${PROFILE_EXTRA_PREFIX}${normalizedProfile.id}`));
      const nextSkills = normalizeList(extra?.technical_skills, ["Python", "Java"]);
      const nextTags = normalizeList(extra?.tags, ["App Development", "UI/UX", "AI"]);
      const nextDiscord = extra?.discord_url || "https://discord.com";

      // safety filter: 내 글만
      const ownedAuthorKeys = new Set(
        [authorId, emailLocalPart].filter(Boolean).map((v) => String(v).toLowerCase())
      );
      const ownedPosts = (postsData ?? []).filter((p) =>
        ownedAuthorKeys.has(String(p.author_id ?? "").toLowerCase())
      );

      setProfile(normalizedProfile);
      setPosts(ownedPosts);

      setEditSkills(nextSkills.join(", "));
      setEditTags(nextTags.join(", "));
      setEditLinkedin(normalizedProfile.linkedin_url || "https://www.linkedin.com");
      setEditGithub(normalizedProfile.github_url || "");
      setEditManner(String(clamp01to100(normalizedProfile.manner_temp)));
      setEditDiscord(nextDiscord);

      setLoading(false);
    };

    fetchProfilePageData();

    return () => {
      active = false;
    };
  }, [routeKey]);

  const { appTimeline, projectTimeline } = useMemo(() => buildTimeline(posts), [posts]);
  const displayId = getDisplayId(profile, routeKey);
  const commitCount = posts.length;

  const technicalSkills = useMemo(() => normalizeList(editSkills, ["Python", "Java"]), [editSkills]);
  const interestTags = useMemo(() => normalizeList(editTags, ["App Development", "UI/UX", "AI"]), [editTags]);

  const handleEditSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    const nextSkills = normalizeList(editSkills, ["Python", "Java"]);
    const nextTags = normalizeList(editTags, ["App Development", "UI/UX", "AI"]);
    const nextManner = clamp01to100(editManner);

    // DB 업데이트는 UUID일 때만
    if (isUuid(profile.id)) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          linkedin_url: editLinkedin || "https://www.linkedin.com",
          github_url: editGithub || "",
          manner_temp: nextManner,
        })
        .eq("id", profile.id);

      if (updateError) {
        setErrorMessage("Supabase profile update failed. Check row permissions / RLS.");
      } else {
        setProfile((prev) => ({
          ...prev,
          linkedin_url: editLinkedin || prev.linkedin_url,
          github_url: editGithub || prev.github_url,
          manner_temp: nextManner,
        }));
      }
    } else {
      setErrorMessage("Cannot update DB: profile.id is not a UUID.");
    }

    // extras는 localStorage
    localStorage.setItem(
      `${PROFILE_EXTRA_PREFIX}${profile.id}`,
      JSON.stringify({
        technical_skills: nextSkills,
        tags: nextTags,
        discord_url: editDiscord || "https://discord.com",
      })
    );

    setSaving(false);
    setIsEditOpen(false);
  };

  const blackBtn = "bg-black text-white hover:bg-black/85";
  const whitePill = "rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-medium text-black/80";

  return (
    <section className="min-h-[calc(100vh-7rem)] bg-white p-4 lg:p-8">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-black/20 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Posts by {displayId}</h2>
            <Feed />
          </div>

          <div className="rounded-2xl border border-black/20 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-black">Timeline</h3>
              <span className="text-sm text-black/70">ID: {displayId}</span>
            </div>

            {errorMessage && (
              <p className="mb-4 rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-black">
                {errorMessage}
              </p>
            )}

            {loading ? (
              <p className="text-black/80">Loading...</p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                <TimelineSection title="Application Timeline" items={appTimeline} />
                <TimelineSection title="Project Timeline" items={projectTimeline} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* if your card expects username, we pass routeKey for now */}
          {/* <UserProfileCard username={routeKey} /> */}

          <div className="relative rounded-2xl border border-black/20 bg-white p-6 shadow-sm">
            <img
              src={profile.avatar_url || fallbackProfile.avatar_url}
              alt="profile avatar"
              className="mx-auto h-36 w-36 rounded-full border-4 border-black/20 bg-white object-cover"
            />

            <h2 className="mt-4 break-all text-center text-3xl font-semibold text-black">{displayId}</h2>
            <p className="mt-2 text-center text-sm text-black/80">{profile.school_email}</p>

            <div className="mt-4 h-3 w-full rounded-full bg-black/15">
              <div className="h-3 rounded-full bg-black" style={{ width: `${clamp01to100(profile.manner_temp)}%` }} />
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-black/70">Technical Skills</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {technicalSkills.map((skill) => (
                  <span key={skill} className={whitePill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-black/70">Interest Tags</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {interestTags.map((tag) => (
                  <span key={tag} className={whitePill}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-center gap-3">
              <a
                href={profile.linkedin_url || "https://www.linkedin.com"}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/20 bg-white text-xl text-black hover:bg-white/80"
              >
                in
              </a>
              <a
                href={profile.github_url || "https://github.com"}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/20 bg-white text-xl text-black hover:bg-white/80"
              >
                ⌂
              </a>
              <a
                href={editDiscord || "https://discord.com"}
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/20 bg-white text-xl text-black hover:bg-white/80"
              >
                ◎
              </a>
            </div>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className={`inline-flex rounded-lg px-4 py-2 text-sm font-medium ${blackBtn}`}
              >
                Edit Profile
              </button>
            </div>

            <div className="absolute bottom-4 right-4 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              ● Commits {commitCount}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Profile">
        <form onSubmit={handleEditSave} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Technical Skills (comma-separated)</span>
            <input
              type="text"
              value={editSkills}
              onChange={(e) => setEditSkills(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Python, Java"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Interest Tags (comma-separated)</span>
            <input
              type="text"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="AI, UI/UX, Security"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">LinkedIn URL</span>
            <input
              type="url"
              value={editLinkedin}
              onChange={(e) => setEditLinkedin(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">GitHub URL</span>
            <input
              type="url"
              value={editGithub}
              onChange={(e) => setEditGithub(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Manner Temp (0–100)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={editManner}
              onChange={(e) => setEditManner(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Discord URL (local only)</span>
            <input
              type="url"
              value={editDiscord}
              onChange={(e) => setEditDiscord(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}