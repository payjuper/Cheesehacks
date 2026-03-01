import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// 💡 30개 이상의 통합된 최신 기술 스택 리스트 (프로필 페이지와 동일하게 사용)
const AVAILABLE_TECH = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Next.js', 'Node.js', 
    'Java', 'Spring', 'Python', 'Django', 'Ruby', 'Ruby on Rails',
    'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter', 'React Native',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'GraphQL', 
    'AWS', 'Docker', 'Kubernetes', 'Firebase',
    'Figma', 'UI/UX', 'Unity', 'Unreal Engine'
];

export default function CreatePostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryTag, setCategoryTag] = useState('Web Development');
    const [roleInput, setRoleInput] = useState('');
    const [roles, setRoles] = useState([]); 
    
    // 기술 스택 상태 관리 배열
    const [selectedTech, setSelectedTech] = useState([]); 
    
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert('팀원 모집글을 작성하려면 로그인이 필요합니다!');
                navigate('/login');
            }
        };
        checkAuth();
    }, [navigate]);

    const toggleTech = (tech) => {
        if (selectedTech.includes(tech)) {
            setSelectedTech(selectedTech.filter(t => t !== tech)); 
        } else {
            setSelectedTech([...selectedTech, tech]); 
        }
    };

    const handleAddRole = (e) => {
        e.preventDefault();
        if (roleInput.trim() !== '') {
            setRoles([...roles, roleInput.trim()]);
            setRoleInput('');
        }
    };

    const removeRole = (indexToRemove) => {
        setRoles(roles.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        if (roles.length === 0) return alert('최소 1개 이상의 모집 직군을 추가해주세요!');

        const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .insert([{ 
                title, 
                content, 
                category_tag: categoryTag, 
                author_id: session.user.id,
                tech_stacks: selectedTech.join(', ') // 콤마 문자열로 저장
            }])
            .select(); 

        if (projectError) return alert('글 저장 실패: ' + projectError.message);

        const rolesToInsert = roles.map(roleName => ({
            project_id: projectData[0].id,
            role_name: roleName
        }));

        await supabase.from('project_roles').insert(rolesToInsert);
        navigate('/'); 
    };

    return (
        <div className="ml-[64px] min-h-screen bg-[#F4F2EF] p-10 flex justify-center font-['DM_Sans',_sans-serif]">
            <div className="w-full max-w-3xl rise">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-[#111111] mb-2 font-['Syne',_sans-serif] tracking-tight">Post a Project</h1>
                    <p className="text-[#999990] text-lg font-medium">Share your idea and find the right teammates.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#FFFFFF] border border-[#E8E5E0] rounded-2xl p-8 shadow-sm space-y-8">
                    
                    <div>
                        <label className="block text-sm font-bold text-[#111111] mb-2 uppercase tracking-wider">Category</label>
                        <select 
                            value={categoryTag} onChange={(e) => setCategoryTag(e.target.value)}
                            className="w-full p-4 bg-[#F4F2EF] border border-[#E8E5E0] rounded-xl font-medium focus:outline-none focus:border-[#E14141] transition-colors cursor-pointer"
                        >
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile App">Mobile App</option>
                            <option value="AI / Machine Learning">AI / Machine Learning</option>
                            <option value="Game Development">Game Development</option>
                            <option value="Data Science & Analytics">Data Science & Analytics</option>
                            <option value="Cyber Security">Cyber Security</option>
                            <option value="Blockchain & Web3">Blockchain & Web3</option>
                            <option value="Hardware & IoT">Hardware & IoT</option>
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Business & PM">Business & Startup</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#111111] mb-2 uppercase tracking-wider">Project Title</label>
                        <input 
                            type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                            className="w-full p-4 bg-[#F4F2EF] border border-[#E8E5E0] rounded-xl text-lg font-bold focus:outline-none focus:border-[#E14141]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#111111] mb-2 uppercase tracking-wider">Overview</label>
                        <textarea 
                            value={content} onChange={(e) => setContent(e.target.value)} required rows="5"
                            className="w-full p-4 bg-[#F4F2EF] border border-[#E8E5E0] rounded-xl font-medium focus:outline-none focus:border-[#E14141] resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-6 border-t border-[#E8E5E0]">
                        <label className="block text-sm font-bold text-[#111111] mb-3 uppercase tracking-wider">Required Tech Stacks</label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_TECH.map(tech => {
                                const isSelected = selectedTech.includes(tech);
                                return (
                                    <button
                                        key={tech}
                                        type="button"
                                        onClick={() => toggleTech(tech)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                                            isSelected 
                                            ? 'bg-[#FFF0F0] text-[#E14141] border-[#E14141] shadow-sm' 
                                            : 'bg-[#F4F2EF] text-[#999990] border-[#E8E5E0] hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        {tech}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#E8E5E0]">
                        <label className="block text-sm font-bold text-[#111111] mb-2 uppercase tracking-wider">Open Roles</label>
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text" value={roleInput} onChange={(e) => setRoleInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddRole(e)}
                                placeholder="E.g., Frontend React 1명"
                                className="flex-1 p-3 bg-[#F4F2EF] border border-[#E8E5E0] rounded-xl focus:outline-none focus:border-[#E14141]"
                            />
                            <button type="button" onClick={handleAddRole} className="px-6 py-3 bg-[#111111] text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-[#F4F2EF] border border-[#E8E5E0] rounded-xl border-dashed">
                            {roles.length > 0 ? roles.map((role, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] text-white rounded-lg font-bold text-sm">
                                    {role}
                                    <button type="button" onClick={() => removeRole(idx)} className="text-gray-400 hover:text-red-400">×</button>
                                </div>
                            )) : <span className="text-[#999990] text-sm font-medium">포지션을 추가해주세요.</span>}
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                        <button type="submit" className="px-10 py-4 bg-[#E14141] text-white font-bold text-lg rounded-xl hover:bg-red-700 transition-transform shadow-lg">
                            Publish Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}