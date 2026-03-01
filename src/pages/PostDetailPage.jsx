import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PostDetailPage() {
    const { postId } = useParams(); // URL에 있는 글 ID를 가져옴
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjectDetail();
    }, [postId]);

    const fetchProjectDetail = async () => {
        try {
            // URL의 postId와 일치하는 글 딱 1개(.single())만 가져오기
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    project_roles ( id, role_name, is_closed )
                `)
                .eq('id', postId)
                .single();

            if (error) throw error;
            setProject(data);
        } catch (error) {
            console.error('글 상세정보 불러오기 에러:', error.message);
            alert('존재하지 않거나 삭제된 프로젝트입니다.');
            navigate('/'); // 에러 나면 메인으로 쫓아냄
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (roleId, roleName) => {
        // 나중에 이 부분에 Email API나 applications 테이블 저장 로직을 넣을 겁니다!
        alert(`[${roleName}] 직군에 지원 요청을 보냈습니다! (기능 구현 예정)`);
    };

    if (loading) {
        return <div className="text-center py-10 font-bold text-gray-500">프로젝트 정보를 불러오는 중입니다...</div>;
    }

    if (!project) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* 상단 헤더 영역 */}
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-extrabold rounded-md">
                        {project.category_tag}
                    </span>
                    <span className="text-sm text-gray-400">
                        {new Date(project.created_at).toLocaleDateString()}
                    </span>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{project.title}</h1>
            </div>

            {/* 본문 영역 */}
            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">프로젝트 개요</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-8">
                    {project.content}
                </p>

                {/* 모집 직군 및 지원 버튼 영역 */}
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">모집 중인 포지션</h3>
                <div className="space-y-3">
                    {project.project_roles && project.project_roles.map((role) => (
                        <div key={role.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:border-indigo-300 transition-colors">
                            <span className="font-semibold text-gray-800 text-lg">{role.role_name}</span>
                            
                            {role.is_closed ? (
                                <button disabled className="px-5 py-2 bg-gray-200 text-gray-500 font-bold rounded-md cursor-not-allowed">
                                    모집 마감
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleApply(role.id, role.role_name)}
                                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition-colors"
                                >
                                    지원하기
                                </button>
                            )}
                        </div>
                    ))}
                    {project.project_roles?.length === 0 && (
                        <div className="text-gray-500 text-sm">등록된 모집 포지션이 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    );
}