import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Feed() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 컴포넌트가 처음 화면에 나타날 때 딱 한 번 실행됨
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Join Query: projects 테이블을 가져오면서, 연결된 project_roles 테이블 데이터도 같이 가져옴
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_roles ( id, role_name, is_closed )
      `)
      .order('created_at', { ascending: false }); // 최신 글이 위로 오게 정렬

    if (error) {
      console.error('데이터 불러오기 에러:', error.message);
    } else {
      setProjects(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500 font-semibold">프로젝트 목록을 불러오는 중입니다...</div>;
  }

  if (projects.length === 0) {
    return <div className="text-center py-10 border border-gray-300 rounded-md bg-white">아직 등록된 프로젝트가 없습니다. 첫 글을 작성해보세요!</div>;
  }

  return (
    <div className="flex flex-col space-y-4 w-full">
      {projects.map((project) => (
        <Link 
          to={`/post/${project.id}`} 
          key={project.id} 
          className="block border border-gray-200 rounded-xl bg-white p-6 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer"
        >
          {/* 상단: 카테고리 태그와 작성일 (임시로 날짜만 표시) */}
          <div className="flex justify-between items-start mb-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-extrabold rounded-full border border-indigo-100">
              {project.category_tag}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* 중단: 제목과 본문 요약 */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>
          <p className="text-gray-600 text-sm mb-5 line-clamp-2">
            {project.content}
          </p>

          {/* 하단: 모집 직군 뱃지 리스트 */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 items-center">
            <span className="text-xs text-gray-500 font-bold mr-1">모집 중:</span>
            {project.project_roles && project.project_roles.map(role => (
              <span 
                key={role.id} 
                className={`px-3 py-1 text-xs font-semibold rounded-md border ${
                  role.is_closed 
                    ? 'bg-gray-100 text-gray-400 border-gray-200' 
                    : 'bg-green-50 text-green-700 border-green-200'
                }`}
              >
                {role.role_name} {role.is_closed && '(마감)'}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  );
}