import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function CreatePostForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryTag, setCategoryTag] = useState('Web'); // 기본 태그
    const [roles, setRoles] = useState(['']); // 직군 입력창들을 담는 배열
    
    const navigate = useNavigate();

    // 직군 입력창 내용 변경 핸들러
    const handleRoleChange = (index, value) => {
        const newRoles = [...roles];
        newRoles[index] = value;
        setRoles(newRoles);
    };

    // 직군 입력창 추가 핸들러
    const addRoleField = () => setRoles([...roles, '']);

    // 직군 입력창 삭제 핸들러
    const removeRoleField = (index) => {
        setRoles(roles.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 빈 직군 입력값 제거
        const validRoles = roles.filter(role => role.trim() !== '');
        if (validRoles.length === 0) {
            alert('최소 1개 이상의 모집 직군을 입력해주세요! (예: 프론트엔드)');
            return;
        }

        // 1. projects 테이블에 본문 데이터 삽입
        // .select()를 붙여야 방금 생성된 프로젝트의 ID를 돌려받을 수 있습니다. (매우 중요!)
        const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .insert([{ title, content, category_tag: categoryTag }])
            .select(); 

        if (projectError) {
            console.error('프로젝트 저장 에러:', projectError.message);
            alert('글 저장에 실패했습니다.');
            return;
        }

        const newProjectId = projectData[0].id; // 방금 생성된 프로젝트의 ID

        // 2. project_roles 테이블에 직군 데이터들 삽입 (One-to-Many 관계 매핑)
        const rolesToInsert = validRoles.map(roleName => ({
            project_id: newProjectId,
            role_name: roleName
        }));

        const { error: rolesError } = await supabase
            .from('project_roles')
            .insert(rolesToInsert);

        if (rolesError) {
            console.error('직군 저장 에러:', rolesError.message);
            alert('직군 정보 저장 중 문제가 발생했습니다.');
            return;
        }

        alert('프로젝트가 성공적으로 등록되었습니다!');
        navigate('/'); 
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">새 프로젝트 팀원 모집</h2>
            
            <div className="space-y-5">
                {/* 1. 카테고리 (태그) */}
                <label className="block">
                    <span className="text-gray-700 font-semibold">프로젝트 분야 (Tag)</span>
                    <select 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        value={categoryTag}
                        onChange={(e) => setCategoryTag(e.target.value)}
                    >
                        <option value="Web">Web Development</option>
                        <option value="App">Mobile App</option>
                        <option value="AI">AI / Machine Learning</option>
                        <option value="Game">Game Development</option>
                        <option value="Data">Data Science</option>
                    </select>
                </label>

                {/* 2. 제목 */}
                <label className="block">
                    <span className="text-gray-700 font-semibold">프로젝트 제목</span>
                    <input 
                        type="text" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                        placeholder="예) Supabase를 활용한 매칭 서비스 기획"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>

                {/* 3. 내용 */}
                <label className="block">
                    <span className="text-gray-700 font-semibold">프로젝트 개요 (Content)</span>
                    <textarea 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                        rows="5" 
                        placeholder="어떤 프로젝트인가요? 어떤 사람을 찾고 있나요?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </label>

                {/* 4. 동적 직군 추가 (Dynamic Role Fields) */}
                <div className="block pt-4 border-t border-gray-200">
                    <span className="text-gray-700 font-semibold mb-2 block">모집 역할군 (Roles)</span>
                    {roles.map((role, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <input 
                                type="text" 
                                className="flex-1 rounded-md border-gray-300 shadow-sm p-2 border"
                                placeholder="예) React 프론트엔드 1명"
                                value={role}
                                onChange={(e) => handleRoleChange(index, e.target.value)}
                                required
                            />
                            {roles.length > 1 && (
                                <button type="button" onClick={() => removeRoleField(index)} className="px-3 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                                    삭제
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={addRoleField} className="mt-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800">
                        + 모집 역할군 추가하기
                    </button>
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors">
                    모집글 올리기
                </button>
            </div>
        </form>
    );
}