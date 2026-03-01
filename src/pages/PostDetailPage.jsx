import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function PostDetailPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    
    // 🚨 [추가됨] 내가 지원한 포지션들의 ID를 기억할 Set 자료구조
    const [appliedRoles, setAppliedRoles] = useState(new Set());

    useEffect(() => {
        fetchData();
    }, [postId]);

    const fetchData = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user || null;
            setCurrentUser(user);

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

            // 🚨 [핵심 로직] 로그인한 유저라면, 이 프로젝트의 직군들에 이미 지원했는지 검사
            if (user && data.project_roles?.length > 0) {
                const roleIds = data.project_roles.map(r => r.id);
                
                const { data: appliedData } = await supabase
                    .from('applications')
                    .select('role_id')
                    .eq('applicant_id', user.id)
                    .in('role_id', roleIds); // 이 프로젝트에 속한 직군 ID들만 검색

                if (appliedData) {
                    // 내가 이미 지원한 role_id들만 모아서 Set에 저장
                    setAppliedRoles(new Set(appliedData.map(a => a.role_id)));
                }
            }

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

        const { error } = await supabase
            .from('applications')
            .insert([{
                role_id: roleId,
                applicant_id: currentUser.id,
                message: "프로젝트에 함께하고 싶습니다!", 
                status: "pending" 
            }]);

        if (error) {
            if (error.code === '23505') {
                alert('이미 지원한 포지션입니다!');
            } else {
                alert('지원 처리 중 오류가 발생했습니다: ' + error.message);
            }
        } else {
            alert(`[${roleName}] 포지션에 성공적으로 지원했습니다! 내 프로필에서 확인하세요.`);
            
            // 🚨 [추가됨] DB 저장이 성공하면, 화면의 버튼도 즉시 "지원 완료"로 바꾸기 위해 Set에 추가
            setAppliedRoles(prev => new Set(prev).add(roleId));
        }
    };

    const handleToggleClose = async (roleId, currentStatus) => {
        const newStatus = !currentStatus; 
        
        const { data, error } = await supabase
            .from('project_roles')
            .update({ is_closed: newStatus })
            .eq('id', roleId)
            .select();

        if (error || !data || data.length === 0) {
            alert('상태 변경에 실패했거나 수정 권한이 없습니다.');
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

    if (loading) return <div className="ml-[64px] min-h-screen bg-[#F4F2EF] py-20 text-center font-bold text-[#999990]">Loading project...</div>;
    if (!project) return null;

    const isAuthor = currentUser?.id === project.author_id;
    const authorName = project.profiles?.school_email?.split('@')[0] || '익명 유저';
    const techStacksArray = project.tech_stacks ? project.tech_stacks.split(',').map(t => t.trim()) : [];

    return (
        <div className="ml-[64px] min-h-screen bg-[#F4F2EF] py-10 px-4 font-['DM_Sans',_sans-serif]">
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
                                <h1 className="text-4xl font-extrabold text-[#111111] mb-4 font-['Syne',_sans-serif] tracking-tight">
                                    {project.title}
                                </h1>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm text-indigo-700 font-bold">
                                        {authorName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-[#999990] font-bold">{authorName}</span>
                                </div>
                            </div>

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

                        {techStacksArray.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {techStacksArray.map((tech, idx) => (
                                    <span key={idx} className="px-3 py-1 text-xs font-bold rounded-md bg-[#111111] text-white">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-8">
                        <h3 className="text-sm uppercase tracking-widest font-bold text-[#999990] mb-4">Project Overview</h3>
                        <p className="text-[#111111] whitespace-pre-wrap leading-relaxed text-lg">
                            {project.content}
                        </p>
                    </div>
                </div>

                {/* 2. 하단 역할군 (Role Cards) */}
                <div className="mb-4 px-2">
                    <h3 className="text-2xl font-bold text-[#111111] font-['Syne',_sans-serif]">Open Roles</h3>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar px-2">
                    {project.project_roles && project.project_roles.map((role, index) => {
                        // 🚨 현재 반복문이 돌고 있는 직군에 내가 지원했는지 여부 확인
                        const hasApplied = appliedRoles.has(role.id);

                        return (
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
                                    ) : role.is_closed ? (
                                        <button disabled className="w-full py-2.5 bg-[#F4F2EF] text-[#999990] font-bold rounded-lg cursor-not-allowed border border-[#E8E5E0]">
                                            모집 마감
                                        </button>
                                    ) : hasApplied ? (
                                        // 🚨 이미 지원한 상태라면 비활성화된 "지원 완료" 버튼 표시
                                        <button disabled className="w-full py-2.5 bg-[#FFF0F0] text-[#E14141] font-bold rounded-lg cursor-not-allowed border border-[#f5d5d5]">
                                            지원 완료 ✓
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleApply(role.id, role.role_name)}
                                            className="w-full py-2.5 bg-[#111111] hover:bg-gray-800 text-white font-bold rounded-lg transition-transform hover:-translate-y-0.5 shadow-md"
                                        >
                                            지원하기 →
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {project.project_roles?.length === 0 && (
                        <div className="text-[#999990] text-sm p-4">등록된 모집 포지션이 없습니다.</div>
                    )}
                </div>

            </div>
        </div>
    );
}