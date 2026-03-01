import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // 1. Supabase Auth에 회원가입
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (authError) {
            alert('회원가입 에러: ' + authError.message);
            return;
        }

        // 2. 가입 성공 시, profiles 테이블에 데이터 생성
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: authData.user.id,
                        school_email: email,
                    }
                ]);

            if (profileError) {
                console.error('프로필 생성 에러:', profileError.message);
                alert('가입은 되었으나 프로필 생성에 실패했습니다.');
            } else {
                alert('회원가입 성공! 로그인 페이지로 이동합니다.');
                navigate('/login'); 
            }
        }
    };

    return (
        <form onSubmit={handleRegister} className="w-full max-w-md mx-auto p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Wisc Project Share 가입</h2>
            
            <label className="block mb-4">
                <span className="text-gray-700 font-semibold">학교 이메일 (@wisc.edu)</span>
                <input 
                    type="email" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>

            <label className="block mb-6">
                <span className="text-gray-700 font-semibold">비밀번호 (최소 6자리)</span>
                <input 
                    type="password" 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>

            <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition-colors">
                회원가입 완료
            </button>

            <div className="mt-4 text-center text-sm text-gray-600">
                이미 계정이 있으신가요? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">로그인하기</Link>
            </div>
        </form>
    );
}