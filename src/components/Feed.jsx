import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// 💡 authorId를 Prop으로 받습니다. (안 넘겨주면 undefined이 되어 모든 글을 가져옵니다)
export default function Feed({ authorId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [authorId]); // authorId가 바뀔 때마다 다시 데이터를 불러옵니다.

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // 기본 쿼리 준비
      let query = supabase
        .from('projects')
        .select(`*, project_roles ( id, role_name, is_closed ), profiles ( id, school_email )`)
        .order('created_at', { ascending: false });

      // 🚨 만약 authorId가 전달되었다면, 해당 유저가 쓴 글만 필터링!
      if (authorId) {
        query = query.eq('author_id', authorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-[200px] flex items-center justify-center font-bold text-[#999990]">Loading projects...</div>;

  if (projects.length === 0) return <div className="py-10 text-center text-[#999990] font-medium border border-dashed border-gray-300 rounded-2xl bg-white">등록된 프로젝트가 없습니다.</div>;

  return (
    <div className="font-['DM_Sans',_sans-serif] w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');
        .rise { animation: rise 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {projects.map((project, i) => {
          const author = project.profiles?.school_email?.split('@')[0] || '익명 유저';
          const techStacksArray = project.tech_stacks ? project.tech_stacks.split(',').map(tech => tech.trim()) : [];

          return (
            <div 
              key={project.id} 
              onClick={() => navigate(`/post/${project.id}`)}
              className="bg-[#FFFFFF] border border-[#E8E5E0] rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between rise"
              style={{ animationDelay: `${0.1 + (i * 0.05)}s` }}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-[#111111] text-xs font-bold rounded-full border border-[#E8E5E0]">
                    {project.category_tag}
                  </span>
                  <span className="text-xs text-[#999990] font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <h2 className="text-xl font-bold text-[#111111] mb-2 font-['Syne',_sans-serif] leading-tight line-clamp-2">
                  {project.title}
                </h2>
                <div className="text-[#999990] text-sm mb-5 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-bold">
                    {author[0].toUpperCase()}
                  </div>
                  {author}
                </div>

                {techStacksArray.length > 0 && (
                  <div className="mb-5">
                    <div className="flex flex-wrap gap-2">
                      {techStacksArray.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs font-bold rounded-md bg-[#F4F2EF] text-[#111111] border border-[#E8E5E0]">
                          {tech}
                        </span>
                      ))}
                      {techStacksArray.length > 3 && <span className="text-xs text-gray-400 font-bold self-center">+{techStacksArray.length - 3}</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#E8E5E0]">
                <p className="text-xs font-bold text-[#999990] uppercase tracking-wider mb-2">Open Roles</p>
                <div className="flex flex-wrap gap-2">
                  {project.project_roles?.map(role => (
                    <span key={role.id} className={`px-2 py-1 text-xs font-semibold rounded-md ${role.is_closed ? 'bg-gray-100 text-[#999990] line-through' : 'bg-[#FFF0F0] text-[#E14141]'}`}>
                      {role.role_name}
                    </span>
                  ))}
                  {(!project.project_roles || project.project_roles.length === 0) && (
                    <span className="text-xs text-[#999990]">No roles specified</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}