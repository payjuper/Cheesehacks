import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectsListComponents/ProjectCard";
import { style, TAG_FILTERS } from "../components/ProjectsListComponents/styles";
import { supabase } from "../supabaseClient";

export default function ProjectsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            profiles ( id, school_email ),
            project_roles ( id, role_name, is_closed )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedProjects = (data || []).map(p => {
          const authorEmail = p.profiles?.school_email || 'Anonymous';
          const authorName = authorEmail.split('@')[0];
          const stackArray = p.tech_stacks
            ? p.tech_stacks.split(',').map(t => ({ name: t.trim() }))
            : [];

          return {
            id: p.id,
            title: p.title,
            description: p.content,
            tags: [p.category_tag],
            images: p.images || [],
            stack: stackArray,
            lead: authorName,
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

  const filtered = projects.filter(p => {
    const tagMatch = activeFilter === "All" || p.tags.includes(activeFilter);
    const q = search.toLowerCase().trim();
    const textMatch = !q || p.title.toLowerCase().includes(q) || p.tags.join(" ").toLowerCase().includes(q);
    return tagMatch && textMatch;
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (loading) return <div className="pl-root"><div className="empty">Loading...</div></div>;
  if (error) return <div className="pl-root"><div className="empty">Something went wrong.</div></div>;

  return (
    <div className="pl-root">
      <style>{style}</style>
      <div className="main">
        <div className="topbar">
          <div className="topbar-left">
            <h1>Projects</h1>
            <p>Browse open student projects and find your place.</p>
          </div>
          <div className="search-wrap">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search projects…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-row">
          {TAG_FILTERS.map(f => (
            <button
              key={f}
              className={`filter-pill${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <p className="result-count"><span>{filtered.length}</span> projects</p>

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
              <ProjectCard key={p.id} project={p} animDelay={0.03 + i * 0.04} />
            ))
          )}
        </div>
      </div>

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