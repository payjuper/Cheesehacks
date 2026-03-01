import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Feed() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`*, project_roles ( id, role_name, is_closed ), profiles ( id, school_email )`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="ml-[64px] min-h-screen bg-[#F4F2EF] p-10 font-bold text-[#999990]">Loading...</div>;

  return (
    // 사이드바 두께만큼 왼쪽 여백(ml-[64px]) 확보
    <div className="ml-[64px] min-h-screen bg-[#F4F2EF] font-['DM_Sans',_sans-serif] p-10 flex flex-col items-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');
        .rise { animation: rise 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-end mb-10 rise">
          <div>
            <h1 className="text-5xl font-extrabold text-[#111111] font-['Syne',_sans-serif] mb-2 tracking-tight">Explore Projects</h1>
            <p className="text-[#999990] text-lg font-medium">Discover what others are building and join forces.</p>
          </div>
        </div>

        <p className="mb-6 font-bold text-[#111111] rise" style={{ animationDelay: '0.1s' }}>
          <span className="text-[#E14141]">{projects.length}</span> projects available
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => {
            const author = project.profiles?.school_email?.split('@')[0] || '익명 유저';
            return (
              <div 
                key={project.id} 
                onClick={() => navigate(`/post/${project.id}`)}
                className="bg-[#FFFFFF] border border-[#E8E5E0] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between rise"
                style={{ animationDelay: `${0.15 + (i * 0.05)}s` }}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-[#111111] text-xs font-bold rounded-full border border-[#E8E5E0]">
                      {project.category_tag}
                    </span>
                    <span className="text-xs text-[#999990] font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#111111] mb-2 font-['Syne',_sans-serif] leading-tight line-clamp-2">
                    {project.title}
                  </h2>
                  <p className="text-[#999990] text-sm mb-6 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-bold">
                      {author[0].toUpperCase()}
                    </div>
                    {author}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E5E0]">
                  <p className="text-xs font-bold text-[#999990] uppercase tracking-wider mb-2">Open Roles</p>
                  <div className="flex flex-wrap gap-2">
                    {project.project_roles?.map(role => (
                      <span key={role.id} className={`px-2 py-1 text-xs font-semibold rounded-md ${role.is_closed ? 'bg-gray-100 text-[#999990] line-through' : 'bg-[#FFF0F0] text-[#E14141]'}`}>
                        {role.role_name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}