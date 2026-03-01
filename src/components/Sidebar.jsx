import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { HomeIcon, ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline'; // 연필 아이콘 삭제됨

export default function Sidebar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <aside className="fixed top-0 left-0 h-screen w-[64px] bg-[#E14141] flex flex-col items-center justify-between py-7 z-50 shadow-xl">
            {/* 상단: 로고 & 메뉴 */}
            <div className="flex flex-col items-center gap-8 w-full">
                <Link to="/" className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-[#E14141] text-xl shadow-sm mb-4">
                    W
                </Link>
                
                <Link to="/" className={`w-full flex justify-center p-3 transition-colors ${location.pathname === '/' ? 'text-white' : 'text-[#f5a3a3] hover:text-white'}`} title="홈 화면">
                    <HomeIcon className="w-6 h-6" />
                </Link>
                
                {/* 🚨 여기에 있던 글쓰기(/submit) 링크를 완벽하게 삭제했습니다! */}
            </div>

            {/* 하단: 유저 프로필 & 로그아웃 */}
            <div className="flex flex-col items-center gap-4 w-full">
                {user ? (
                    <>
                        <Link to={`/user/${user.email.split('@')[0]}`} title="내 프로필" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#E14141] font-bold text-sm overflow-hidden shadow-sm hover:scale-105 transition-transform">
                            {user.email.charAt(0).toUpperCase()}
                        </Link>
                        <button onClick={handleLogout} className="w-full flex justify-center p-3 text-[#f5a3a3] hover:text-white transition-colors" title="로그아웃">
                            <ArrowRightOnRectangleIcon className="w-6 h-6" />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="w-full flex justify-center p-3 text-white hover:bg-[#c93636] transition-colors" title="로그인">
                        <UserIcon className="w-6 h-6" />
                    </Link>
                )}
            </div>
        </aside>
    );
}