import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectsListComponents/ProjectCard";
import { style, TAG_FILTERS, TAG_CLASS, TAG_NORM } from "../components/ProjectsListComponents/styles";
import { ALL_TECH } from "../components/NewProjectComponents/styles";
import { supabase } from "../supabaseClient";
import CalendarPanel from "../components/ProjectsListComponents/CalendarPanel";

export default function ProjectsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState("title");
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        try {
          const { data: authData } = await supabase.auth.getSession();
          const user = authData?.session?.user || null;
          setCurrentUser(user);
          if (user) {
            const { data: saves } = await supabase
              .from('saved_projects').select('project_id').eq('user_id', user.id);
            if (saves) setSavedIds(new Set(saves.map(s => s.project_id)));
          }
        } catch (_) { /* non-critical, projects still load */ }

        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            profiles!projects_author_id_fkey ( id, school_email, is_professor, professor_title ),
            project_roles ( id, role_name, is_closed )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedProjects = (data || []).map(p => {
          const authorEmail = p.profiles?.school_email || 'Anonymous';
          const authorName = authorEmail.split('@')[0];
          const idToName = Object.fromEntries(ALL_TECH.map(t => [t.id, t.name]));
          const stackArray = p.tech_stacks
            ? p.tech_stacks.split(',').map(t => { const id = t.trim(); return { name: idToName[id] || id }; })
            : [];

          return {
            id: p.id,
            title: p.title,
            description: p.content,
            tags: p.category_tag ? p.category_tag.split(",").map(t => t.trim()) : [],
            images: p.images || [],
            stack: stackArray,
            lead: authorName,
            isAuthorProfessor: p.profiles?.is_professor || false,
            authorProfessorTitle: p.profiles?.professor_title || null,
            contributors: [{ initials: authorName.charAt(0).toUpperCase(), color: '#E14141' }],
            created_at: p.created_at,
            start_date: p.start_date,
            end_date: p.end_date,
          };
        });

        setProjects(mappedProjects);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleToggleSave = async (projectId) => {
    if (!currentUser) { navigate('/login'); return; }
    const isSaved = savedIds.has(projectId);
    if (isSaved) {
      await supabase.from('saved_projects').delete()
        .eq('user_id', currentUser.id).eq('project_id', projectId);
      setSavedIds(prev => { const next = new Set(prev); next.delete(projectId); return next; });
    } else {
      await supabase.from('saved_projects').insert({ user_id: currentUser.id, project_id: projectId });
      setSavedIds(prev => new Set(prev).add(projectId));
    }
  };

  const filtered = projects.filter(p => {
    const tagMatch = activeFilter === "All" || p.tags.some(t => TAG_NORM[t] === TAG_NORM[activeFilter]);
    const q = search.toLowerCase().trim();
    let textMatch = true;
    if (q) {
      if (searchMode === "title")   textMatch = p.title.toLowerCase().includes(q);
      if (searchMode === "content") textMatch = (p.description || "").toLowerCase().includes(q);
      if (searchMode === "writer")  textMatch = (p.lead || "").toLowerCase().includes(q);
    }
    return tagMatch && textMatch;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (loading) return <div className="pl-root"><div className="empty">Loading...</div></div>;
  if (error) return <div className="pl-root"><style>{style}</style><div className="empty">Something went wrong.</div></div>;

  return (
    <div className="pl-root">
      <style>{style}</style>
      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <h1>Projects</h1>
            <p>Browse open student projects and find your place.</p>
          </div>
        </div>

        <div className="filter-row">
          {TAG_FILTERS.map(f => (
            <button
              key={f}
              className={`filter-pill${activeFilter === f ? " active" : ""}${activeFilter === f && TAG_CLASS[f] ? " " + TAG_CLASS[f] : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="search-bar-row">
          <div className="search-wrap">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder={`Search by ${searchMode}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="search-modes">
            {["title", "content", "writer"].map(mode => (
              <button
                key={mode}
                className={`search-mode-pill${searchMode === mode ? " active" : ""}`}
                onClick={() => { setSearchMode(mode); setSearch(""); }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <p className="result-count" style={{ margin: 0 }}><span>{filtered.length}</span> projects</p>
        </div>

        <div className="cards-col">
          {filtered.length === 0 ? (
            <div className="empty">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>No projects match your search.</span>
            </div>
          ) : (
            
            filtered.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                animDelay={0.03 + i * 0.04}
                isSaved={savedIds.has(p.id)}
                onToggleSave={handleToggleSave}
              />
            ))
          )}
        </div>
      </div>

      <CalendarPanel />

      <button className="fab" onClick={() => navigate("/new")}>
        <svg viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span className="fab-tooltip">New Project</span>
      </button>
    </div>
  );
}