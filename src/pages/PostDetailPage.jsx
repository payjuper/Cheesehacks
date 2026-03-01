import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PostDetailPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    // ---------------------------------------------------------
    // 💡 기존에 짜둔 완벽한 DB 로직 (절대 건드리지 않음!)
    // ---------------------------------------------------------
    useEffect(() => {
        fetchData();
    }, [postId]);

    const fetchData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setCurrentUser(session?.user || null);

            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    project_roles ( id, role_name, is_closed ),
                    profiles ( id, school_email )
                `)
                .eq('id', postId)
                .single();

            if (error) throw error;
            setProject(data);
        } catch (error) {
            console.error('글 상세정보 에러:', error.message);
            alert('존재하지 않거나 삭제된 프로젝트입니다.');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (roleId, roleName) => {
        if (!currentUser) {
            alert('지원하시려면 먼저 로그인을 해주세요!');
            navigate('/login');
            return;
        }
        alert(`[${roleName}] 포지션에 지원했습니다!`);
    };

    const handleToggleClose = async (roleId, currentStatus) => {
        const newStatus = !currentStatus; 
        
        const { data, error } = await supabase
            .from('project_roles')
            .update({ is_closed: newStatus })
            .eq('id', roleId)
            .select();

        if (error) {
            alert('상태 변경에 실패했습니다.');
            return;
        }

        if (!data || data.length === 0) {
            alert('수정 권한이 없습니다.');
            return;
        }

        setProject({
            ...project,
            project_roles: project.project_roles.map(role => 
                role.id === roleId ? { ...role, is_closed: newStatus } : role
            )
        });
    };

    const handleDelete = async () => {
        const isConfirm = window.confirm('정말로 이 글을 삭제하시겠습니까?');
        if (!isConfirm) return;

        const { error } = await supabase.from('projects').delete().eq('id', project.id);

        if (error) {
            alert('글 삭제에 실패했습니다.');
        } else {
            alert('글이 성공적으로 삭제되었습니다.');
            navigate('/');
        }
    };

    const handleEdit = () => alert('글 수정 기능은 개발 예정입니다.');

    if (loading) return <div className="text-center py-20 font-bold text-[#999990] bg-[#F4F2EF] min-h-screen">Loading project...</div>;
    if (!project) return null;

    const isAuthor = currentUser?.id === project.author_id;

    // ---------------------------------------------------------
    // 🎨 친구분의 UI/UX 디자인이 적용된 렌더링 영역
    // ---------------------------------------------------------
    return (
        <div className="bg-[#F4F2EF] min-h-screen py-10 px-4 font-['DM_Sans',_sans-serif]">
            {/* 친구분 디자인에 있던 폰트와 스크롤바 숨김, 애니메이션 CSS 주입 */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    .rise { animation: rise 0.6s cubic-bezier(0.22,1,0.36,1) both; }
                    @keyframes rise {
                        from { opacity: 0; transform: translateY(20px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>

            <div className="max-w-4xl mx-auto rise">
                
                {/* 1. 상단 프로젝트 상세 정보 카드 */}
                <div className="bg-[#FFFFFF] border border-[#E8E5E0] rounded-2xl shadow-sm overflow-hidden mb-10">
                    <div className="p-8 border-b border-[#E8E5E0]">
                        <div className="flex justify-between items-center mb-6">
                            <span className="px-3 py-1 bg-gray-100 text-[#111111] text-xs font-bold rounded-full border border-[#E8E5E0]">
                                {project.category_tag}
                            </span>
                            <span className="text-sm text-[#999990] font-medium">
                                {new Date(project.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-extrabold text-[#111111] mb-3 font-['Syne',_sans-serif] tracking-tight">
                                    {project.title}
                                </h1>
                                <p className="text-sm text-[#999990] font-medium flex items-center">
                                    <span className="w-6 h-6 rounded-full bg-indigo-100 inline-block mr-2 text-center leading-6 text-xs text-indigo-700 font-bold">
                                        {project.profiles?.school_email?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                    {project.profiles?.school_email?.split('@')[0] || '익명 유저'}
                                </p>
                            </div>

                            {/* [조건부 렌더링] 작성자용 수정/삭제 버튼 */}
                            {isAuthor && (
                                <div className="flex space-x-2 ml-4">
                                    <button onClick={handleEdit} className="px-4 py-2 text-sm font-semibold bg-gray-100 text-[#111111] hover:bg-gray-200 rounded-lg transition-colors">
                                        수정
                                    </button>
                                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold bg-[#FFF0F0] text-[#E14141] hover:bg-red-100 rounded-lg transition-colors">
                                        삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8">
                        <h3 className="text-sm uppercase tracking-widest font-bold text-[#999990] mb-4">Project Overview</h3>
                        <p className="text-[#111111] whitespace-pre-wrap leading-relaxed text-lg">
                            {project.content}
                        </p>
                    </div>
                </div>

                {/* 2. 하단 역할군 (Role Cards) - 친구분 디자인의 가로 스크롤 적용 */}
                <div className="mb-4 px-2">
                    <h3 className="text-2xl font-bold text-[#111111] font-['Syne',_sans-serif]">Open Roles</h3>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar px-2">
                    {project.project_roles && project.project_roles.map((role, index) => (
                        <div 
                            key={role.id} 
                            className={`min-w-[280px] flex-shrink-0 bg-[#FFFFFF] border ${role.is_closed ? 'border-gray-200 opacity-70' : 'border-[#E8E5E0]'} rounded-2xl p-6 shadow-sm flex flex-col justify-between rise`}
                            style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#F4F2EF] flex items-center justify-center text-lg border border-[#E8E5E0]">
                                        🎯
                                    </div>
                                    {role.is_closed && <span className="text-xs font-bold text-[#E14141] bg-[#FFF0F0] px-2 py-1 rounded-full border border-[#f5d5d5]">Closed</span>}
                                </div>
                                <h4 className="text-xl font-bold text-[#111111] mb-2">{role.role_name}</h4>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-[#E8E5E0]">
                                {isAuthor ? (
                                    <button 
                                        onClick={() => handleToggleClose(role.id, role.is_closed)}
                                        className={`w-full py-2.5 font-bold rounded-lg transition-colors ${
                                            role.is_closed 
                                                ? 'bg-[#F4F2EF] text-[#111111] hover:bg-gray-200 border border-[#E8E5E0]' 
                                                : 'bg-[#E14141] hover:bg-red-600 text-white shadow-sm'
                                        }`}
                                    >
                                        {role.is_closed ? '마감 취소' : '마감하기'}
                                    </button>
                                ) : (
                                    role.is_closed ? (
                                        <button disabled className="w-full py-2.5 bg-[#F4F2EF] text-[#999990] font-bold rounded-lg cursor-not-allowed border border-[#E8E5E0]">
                                            모집 마감
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleApply(role.id, role.role_name)}
                                            className="w-full py-2.5 bg-[#111111] hover:bg-gray-800 text-white font-bold rounded-lg transition-transform hover:-translate-y-0.5 shadow-md"
                                        >
                                            지원하기 →
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                    {project.project_roles?.length === 0 && (
                        <div className="text-[#999990] text-sm p-4">등록된 모집 포지션이 없습니다.</div>
                    )}
                </div>

            </div>
        </div>
    );
}