import { useState, useEffect } from "react";
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
    --sidebar-w: 64px;
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }

  .jobs-root {
    margin-left: var(--sidebar-w);
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    display: flex;
    flex-direction: column;
  }

  /* Top bar */
  .jobs-topbar {
    padding: 32px 48px 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .jobs-topbar-left h1 {
    font-family: 'Syne', sans-serif;
    font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1;
  }
  .jobs-topbar-left p {
    margin-top: 6px; font-size: 14px; font-weight: 300; color: var(--muted);
  }

  /* Search */
  .jobs-search-row {
    padding: 16px 48px 0;
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  }
  .jobs-search-wrap { position: relative; display: flex; align-items: center; flex: 1; min-width: 200px; max-width: 500px; }
  .jobs-search-wrap svg { position: absolute; left: 12px; width: 15px; height: 15px; stroke: var(--muted); fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
  .jobs-search { width: 100%; padding: 10px 14px 10px 36px; border: 1.5px solid var(--border); border-radius: 12px; background: var(--card); font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.18s; }
  .jobs-search:focus { border-color: #bbb; }
  .jobs-search::placeholder { color: var(--muted); }
  .result-count { font-size: 12px; color: var(--muted); white-space: nowrap; }
  .result-count span { color: var(--text); font-weight: 600; }

  /* Body layout */
  .jobs-body {
    display: flex;
    gap: 0;
    padding: 20px 0 80px;
    flex: 1;
    min-height: 0;
    align-items: flex-start;
  }

  /* Filter sidebar */
  .jobs-filters {
    width: 220px;
    min-width: 220px;
    padding: 0 0 0 48px;
    flex-shrink: 0;
    position: sticky;
    top: 24px;
  }
  .filter-section { margin-bottom: 24px; }
  .filter-section-title {
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 10px;
  }
  .filter-check-list { display: flex; flex-direction: column; gap: 8px; }
  .filter-check {
    display: flex; align-items: center; gap: 9px;
    cursor: pointer; user-select: none;
  }
  .filter-check input[type=checkbox] {
    width: 15px; height: 15px; accent-color: var(--red);
    cursor: pointer; flex-shrink: 0;
  }
  .filter-check-label { font-size: 13px; font-weight: 400; color: var(--text); }
  .filter-divider { height: 1px; background: var(--border); margin-bottom: 20px; }

  .clear-filters-btn {
    background: none; border: none; padding: 0;
    font-size: 12px; font-weight: 500; color: var(--red);
    cursor: pointer; text-decoration: underline; text-underline-offset: 2px;
    opacity: 0; pointer-events: none; transition: opacity 0.18s;
  }
  .clear-filters-btn.visible { opacity: 1; pointer-events: auto; }

  /* Job list */
  .jobs-list-panel {
    flex: 1;
    min-width: 0;
    padding: 0 0 0 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Split view */
  .jobs-split { display: flex; gap: 0; flex: 1; min-width: 0; }
  .jobs-list-col { flex: 1; min-width: 0; max-width: 440px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
  .jobs-detail-col {
    flex: 1; min-width: 0;
    margin-left: 16px;
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    position: sticky;
    top: 24px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  .no-selection {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; height: 100%; min-height: 300px;
    gap: 12px; color: var(--muted); padding: 40px;
  }
  .no-selection svg { width: 36px; height: 36px; stroke: #ccc; fill: none; stroke-width: 1.5; stroke-linecap: round; }
  .no-selection p { font-size: 13px; font-weight: 300; text-align: center; }

  @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* Job Card (list item) */
  .job-card {
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 16px 18px;
    cursor: pointer;
    transition: all 0.18s;
    animation: rise 0.38s cubic-bezier(0.22,1,0.36,1) both;
    display: flex; flex-direction: column; gap: 10px;
  }
  .job-card:hover { border-color: #d0ccc8; box-shadow: 0 4px 20px rgba(0,0,0,0.07); transform: translateY(-1px); }
  .job-card.selected { border-color: var(--red); box-shadow: 0 0 0 3px rgba(225,65,65,0.08); }

  .job-card-top { display: flex; align-items: flex-start; gap: 12px; }
  .company-logo {
    width: 42px; height: 42px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
    color: var(--red); flex-shrink: 0; overflow: hidden;
  }
  .company-logo img { width: 100%; height: 100%; object-fit: contain; }

  .job-card-info { flex: 1; min-width: 0; }
  .job-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.3; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .job-company { font-size: 12px; font-weight: 500; color: var(--muted); }
  .job-location { font-size: 11px; color: var(--muted); margin-top: 2px; display: flex; align-items: center; gap: 4px; }
  .job-location svg { width: 10px; height: 10px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; }

  .job-card-badges { display: flex; gap: 5px; flex-wrap: wrap; }
  .job-badge {
    font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
    text-transform: uppercase; padding: 3px 8px; border-radius: 7px;
    border: 1.5px solid transparent; white-space: nowrap;
  }
  .badge-type     { background: #EEF4FF; color: #3B6FE0; border-color: #C3D5F8; }
  .badge-paid     { background: #F0FFF4; color: #2E8B57; border-color: #B2DFC0; }
  .badge-unpaid   { background: #FFF8EE; color: #E07B20; border-color: #F5D9B0; }
  .badge-opt      { background: #F0F9FF; color: #0284C7; border-color: #BAE6FD; }
  .badge-citizen  { background: #FFF0F0; color: var(--red); border-color: #F5C6C6; }
  .badge-remote   { background: #F5F0FF; color: #7B3FE4; border-color: #D4B8F8; }

  .job-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .job-posted { font-size: 11px; color: var(--muted); }
  .job-deadline { font-size: 11px; font-weight: 500; color: var(--red); }

  /* Detail panel */
  .detail-header {
    padding: 28px 28px 20px;
    border-bottom: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 14px;
  }
  .detail-top { display: flex; align-items: flex-start; gap: 14px; }
  .detail-logo {
    width: 54px; height: 54px; border-radius: 12px;
    border: 1.5px solid var(--border); background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
    color: var(--red); flex-shrink: 0; overflow: hidden;
  }
  .detail-logo img { width: 100%; height: 100%; object-fit: contain; }
  .detail-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; }
  .detail-company { font-size: 14px; font-weight: 500; color: var(--muted); margin-top: 3px; }

  .detail-meta { display: flex; flex-wrap: wrap; gap: 6px; }
  .detail-badges { display: flex; flex-wrap: wrap; gap: 6px; }

  .apply-btn {
    background: var(--red); color: #fff; border: none;
    border-radius: 12px; padding: 11px 22px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; text-decoration: none; display: inline-flex;
    align-items: center; gap: 7px;
    box-shadow: 0 4px 14px rgba(225,65,65,0.28);
    transition: all 0.18s; align-self: flex-start;
  }
  .apply-btn:hover { background: #d03232; transform: translateY(-1px); }
  .apply-btn svg { width: 12px; height: 12px; stroke: #fff; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

  .detail-body { padding: 24px 28px 28px; flex: 1; overflow-y: auto; }
  .detail-section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
  .detail-desc { font-size: 13px; font-weight: 300; line-height: 1.8; color: #444; white-space: pre-wrap; }
  .detail-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .detail-info-item { display: flex; flex-direction: column; gap: 3px; }
  .detail-info-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .detail-info-val { font-size: 13px; font-weight: 500; color: var(--text); }

  /* Save button */
  .job-save-btn {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    background: none; border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.18s; color: var(--muted);
  }
  .job-save-btn:hover { border-color: #B45309; color: #B45309; background: #FFFBEB; }
  .job-save-btn.saved { background: #FFFBEB; border-color: #FDE68A; color: #B45309; }
  .job-save-btn svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .job-save-btn.saved svg { fill: #B45309; }

  /* Applied indicator */
  .badge-applied { background: #F0FFF4; color: #2E8B57; border-color: #B2DFC0; }

  /* Loading / empty */
  .jobs-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; color: var(--muted); font-size: 14px; }
  .jobs-empty { display: flex; flex-direction: column; align-items: center; padding: 60px 0; gap: 10px; color: var(--muted); font-size: 13px; font-weight: 300; }
  .jobs-empty svg { width: 32px; height: 32px; stroke: #ccc; fill: none; stroke-width: 1.5; }

  @media (max-width: 900px) {
    .jobs-detail-col { display: none; }
    .jobs-list-col { max-width: 100%; }
  }
  @media (max-width: 680px) {
    .jobs-topbar, .jobs-search-row { padding-left: 16px; padding-right: 16px; }
    .jobs-filters { padding-left: 16px; width: 180px; min-width: 180px; }
    .jobs-list-panel { padding-left: 12px; }
  }
`;

const JOB_TYPES = ["internship", "full-time", "part-time", "co-op"];
const TYPE_LABEL = { "internship": "Internship", "full-time": "Full-time", "part-time": "Part-time", "co-op": "Co-op" };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function formatDeadline(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function JobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [appliedIds, setAppliedIds] = useState(new Set());

  // Filters
  const [typeFilters, setTypeFilters] = useState(new Set());
  const [onlyOpt, setOnlyOpt] = useState(false);
  const [onlyNoCitizen, setOnlyNoCitizen] = useState(false);
  const [onlyPaid, setOnlyPaid] = useState(false);
  const [onlyUnpaid, setOnlyUnpaid] = useState(false);
  const [onlyRemote, setOnlyRemote] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data: authData } = await supabase.auth.getSession();
      const user = authData?.session?.user || null;
      setCurrentUser(user);

      if (user) {
        const [savedRes, appliedRes] = await Promise.all([
          supabase.from("saved_jobs").select("job_id").eq("user_id", user.id),
          supabase.from("job_applications").select("job_id").eq("user_id", user.id),
        ]);
        if (savedRes.data) setSavedIds(new Set(savedRes.data.map(r => r.job_id)));
        if (appliedRes.data) setAppliedIds(new Set(appliedRes.data.map(r => r.job_id)));
      }

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("posted_at", { ascending: false });
      if (!error) setJobs(data || []);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const handleToggleSave = async (e, jobId) => {
    e.stopPropagation();
    if (!currentUser) { navigate("/login"); return; }
    if (savedIds.has(jobId)) {
      await supabase.from("saved_jobs").delete().eq("user_id", currentUser.id).eq("job_id", jobId);
      setSavedIds(prev => { const n = new Set(prev); n.delete(jobId); return n; });
    } else {
      await supabase.from("saved_jobs").insert({ user_id: currentUser.id, job_id: jobId });
      setSavedIds(prev => new Set(prev).add(jobId));
    }
  };

  const handleApply = async (jobId, applyUrl) => {
    if (currentUser && !appliedIds.has(jobId)) {
      await supabase.from("job_applications").insert({ user_id: currentUser.id, job_id: jobId });
      setAppliedIds(prev => new Set(prev).add(jobId));
    }
    window.open(applyUrl, "_blank", "noopener,noreferrer");
  };

  const hasActiveFilter =
    typeFilters.size > 0 || onlyOpt || onlyNoCitizen || onlyPaid || onlyUnpaid || onlyRemote;

  const clearFilters = () => {
    setTypeFilters(new Set());
    setOnlyOpt(false);
    setOnlyNoCitizen(false);
    setOnlyPaid(false);
    setOnlyUnpaid(false);
    setOnlyRemote(false);
  };

  const toggleType = (t) => {
    setTypeFilters(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const filtered = jobs.filter(job => {
    if (typeFilters.size > 0 && !typeFilters.has(job.job_type)) return false;
    if (onlyOpt && !job.opt_cpt_eligible) return false;
    if (onlyNoCitizen && job.us_citizenship_required) return false;
    if (onlyPaid && !job.is_paid) return false;
    if (onlyUnpaid && job.is_paid) return false;
    if (onlyRemote && !job.is_remote) return false;
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      (job.location || "").toLowerCase().includes(q) ||
      (job.tags || "").toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (selected && !filtered.find(j => j.id === selected.id)) {
      setSelected(filtered[0] || null);
    }
    if (!selected && filtered.length > 0) {
      setSelected(filtered[0]);
    }
  }, [filtered.length]);

  if (loading) return (
    <div className="jobs-root">
      <style>{style}</style>
      <div className="jobs-loading">Loading jobs…</div>
    </div>
  );

  return (
    <div className="jobs-root">
      <style>{style}</style>

      {/* Top bar */}
      <div className="jobs-topbar">
        <div className="jobs-topbar-left">
          <h1>Job Board</h1>
          <p>CS & DS opportunities — filtered for you.</p>
        </div>
      </div>

      {/* Search */}
      <div className="jobs-search-row">
        <div className="jobs-search-wrap">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="jobs-search"
            type="text"
            placeholder="Search title, company, location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <p className="result-count"><span>{filtered.length}</span> jobs</p>
      </div>

      {/* Body */}
      <div className="jobs-body">
        {/* Filters */}
        <div className="jobs-filters">
          <div className="filter-section">
            <p className="filter-section-title">Job Type</p>
            <div className="filter-check-list">
              {JOB_TYPES.map(t => (
                <label key={t} className="filter-check">
                  <input
                    type="checkbox"
                    checked={typeFilters.has(t)}
                    onChange={() => toggleType(t)}
                  />
                  <span className="filter-check-label">{TYPE_LABEL[t]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <p className="filter-section-title">Visa / Status</p>
            <div className="filter-check-list">
              <label className="filter-check">
                <input type="checkbox" checked={onlyOpt} onChange={e => setOnlyOpt(e.target.checked)} />
                <span className="filter-check-label">OPT / CPT OK</span>
              </label>
              <label className="filter-check">
                <input type="checkbox" checked={onlyNoCitizen} onChange={e => setOnlyNoCitizen(e.target.checked)} />
                <span className="filter-check-label">No citizenship req.</span>
              </label>
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <p className="filter-section-title">Compensation</p>
            <div className="filter-check-list">
              <label className="filter-check">
                <input type="checkbox" checked={onlyPaid} onChange={e => setOnlyPaid(e.target.checked)} />
                <span className="filter-check-label">Paid</span>
              </label>
              <label className="filter-check">
                <input type="checkbox" checked={onlyUnpaid} onChange={e => setOnlyUnpaid(e.target.checked)} />
                <span className="filter-check-label">Unpaid</span>
              </label>
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-section">
            <p className="filter-section-title">Location</p>
            <div className="filter-check-list">
              <label className="filter-check">
                <input type="checkbox" checked={onlyRemote} onChange={e => setOnlyRemote(e.target.checked)} />
                <span className="filter-check-label">Remote only</span>
              </label>
            </div>
          </div>

          <button
            className={`clear-filters-btn${hasActiveFilter ? " visible" : ""}`}
            onClick={clearFilters}
          >
            Clear all filters
          </button>
        </div>

        {/* List + Detail */}
        <div className="jobs-list-panel">
          {filtered.length === 0 ? (
            <div className="jobs-empty">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>No jobs match your filters.</span>
            </div>
          ) : (
            <div className="jobs-split">
              {/* List */}
              <div className="jobs-list-col">
                {filtered.map((job, i) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    animDelay={0.02 + i * 0.03}
                    selected={selected?.id === job.id}
                    isSaved={savedIds.has(job.id)}
                    isApplied={appliedIds.has(job.id)}
                    onToggleSave={handleToggleSave}
                    onClick={() => setSelected(job)}
                  />
                ))}
              </div>

              {/* Detail */}
              <div className="jobs-detail-col">
                {selected ? (
                  <JobDetail job={selected} isApplied={appliedIds.has(selected.id)} onApply={handleApply} />
                ) : (
                  <div className="no-selection">
                    <svg viewBox="0 0 24 24">
                      <rect x="2" y="7" width="20" height="14" rx="2"/>
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    </svg>
                    <p>Select a job to see details.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, animDelay, selected, isSaved, isApplied, onToggleSave, onClick }) {
  const initial = job.company.charAt(0).toUpperCase();
  return (
    <div
      className={`job-card${selected ? " selected" : ""}`}
      style={{ animationDelay: `${animDelay}s` }}
      onClick={onClick}
    >
      <div className="job-card-top">
        <div className="company-logo">
          {job.company_logo ? <img src={job.company_logo} alt={job.company} /> : initial}
        </div>
        <div className="job-card-info">
          <p className="job-title">{job.title}</p>
          <p className="job-company">{job.company}</p>
          <p className="job-location">
            <svg viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {job.is_remote ? "Remote" : job.location}
          </p>
        </div>
        <button
          className={`job-save-btn${isSaved ? " saved" : ""}`}
          onClick={e => onToggleSave(e, job.id)}
          title={isSaved ? "Unsave" : "Save job"}
        >
          <svg viewBox="0 0 24 24">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
          </svg>
        </button>
      </div>

      <div className="job-card-badges">
        <span className="job-badge badge-type">{TYPE_LABEL[job.job_type] || job.job_type}</span>
        {job.is_paid
          ? <span className="job-badge badge-paid">Paid</span>
          : <span className="job-badge badge-unpaid">Unpaid</span>
        }
        {job.opt_cpt_eligible && <span className="job-badge badge-opt">OPT/CPT OK</span>}
        {job.us_citizenship_required && <span className="job-badge badge-citizen">US Citizen</span>}
        {job.is_remote && <span className="job-badge badge-remote">Remote</span>}
        {isApplied && <span className="job-badge badge-applied">✓ Applied</span>}
      </div>

      <div className="job-card-footer">
        <span className="job-posted">{timeAgo(job.posted_at)}</span>
        {job.deadline && <span className="job-deadline">Due {formatDeadline(job.deadline)}</span>}
      </div>
    </div>
  );
}

function JobDetail({ job, isApplied, onApply }) {
  const tags = job.tags ? job.tags.split(",").map(t => t.trim()).filter(Boolean) : [];

  return (
    <>
      <div className="detail-header">
        <div className="detail-top">
          <div className="detail-logo">
            {job.company_logo
              ? <img src={job.company_logo} alt={job.company} />
              : job.company.charAt(0).toUpperCase()
            }
          </div>
          <div>
            <p className="detail-title">{job.title}</p>
            <p className="detail-company">{job.company}</p>
          </div>
        </div>

        <div className="detail-badges">
          <span className="job-badge badge-type">{TYPE_LABEL[job.job_type] || job.job_type}</span>
          {job.is_paid
            ? <span className="job-badge badge-paid">Paid</span>
            : <span className="job-badge badge-unpaid">Unpaid</span>
          }
          {job.opt_cpt_eligible && <span className="job-badge badge-opt">OPT / CPT Eligible</span>}
          {job.us_citizenship_required && <span className="job-badge badge-citizen">US Citizenship Required</span>}
          {job.is_remote && <span className="job-badge badge-remote">Remote</span>}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {job.apply_url && (
            <button className="apply-btn" onClick={() => onApply(job.id, job.apply_url)}>
              {isApplied ? "Apply Again" : "Apply Now"}
              <svg viewBox="0 0 24 24">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </button>
          )}
          {isApplied && (
            <span className="job-badge badge-applied" style={{ fontSize: 11, padding: "5px 10px" }}>
              ✓ Marked as Applied
            </span>
          )}
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-info-grid">
          <div className="detail-info-item">
            <span className="detail-info-label">Location</span>
            <span className="detail-info-val">{job.is_remote ? "Remote" : job.location}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">Job Type</span>
            <span className="detail-info-val">{TYPE_LABEL[job.job_type] || job.job_type}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">Posted</span>
            <span className="detail-info-val">{timeAgo(job.posted_at)}</span>
          </div>
          {job.deadline && (
            <div className="detail-info-item">
              <span className="detail-info-label">Deadline</span>
              <span className="detail-info-val" style={{ color: "var(--red)" }}>{formatDeadline(job.deadline)}</span>
            </div>
          )}
          <div className="detail-info-item">
            <span className="detail-info-label">Visa Sponsorship</span>
            <span className="detail-info-val">{job.opt_cpt_eligible ? "OPT / CPT OK" : "Not available"}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-info-label">Citizenship</span>
            <span className="detail-info-val">{job.us_citizenship_required ? "Required" : "Not required"}</span>
          </div>
        </div>

        {tags.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p className="detail-section-title">Tags</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tags.map(t => (
                <span key={t} className="job-badge badge-type" style={{ fontSize: 11 }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {job.description && (
          <div>
            <p className="detail-section-title">Description</p>
            <p className="detail-desc">{job.description}</p>
          </div>
        )}
      </div>
    </>
  );
}
