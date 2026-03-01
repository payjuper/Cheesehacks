import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Supabase Auth에 로그인 요청
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert('로그인 실패: 이메일이나 비밀번호를 확인해주세요. (' + error.message + ')');
        } else {
            alert('환영합니다!');
            navigate('/'); // 메인 화면으로 이동
        }
    };

    return (
        <form onSubmit={handleLogin} className="w-full max-w-md mx-auto p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">로그인</h2>
            
            <label className="block mb-4">
                <span className="text-gray-700 font-semibold">이메일</span>
                <input 
                    type="email" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>

            <label className="block mb-6">
                <span className="text-gray-700 font-semibold">비밀번호</span>
                <input 
                    type="password" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>

            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors">
                로그인
            </button>

            <div className="mt-4 text-center text-sm text-gray-600">
                아직 계정이 없으신가요? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">회원가입하기</Link>
            </div>
        </form>
    );
}