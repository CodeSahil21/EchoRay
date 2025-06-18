"use client";
import React, { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from "@/store";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserProtectWrapper from '@/components/UserProtectWrapper';

const LogoutPage: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const token =  localStorage.getItem('user');    
    useEffect(() => {
      const logoutUser = async()=>{
        try{
            if(!token){
                router.push('/signin');
                return;
            }

            await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/logout`, {
                headers: { authorization: `Bearer ${token}` },
                withCredentials: true
            });
            localStorage.removeItem('token');
            dispatch({ type: 'user/clearUser' });
            router.push('/signin');
        }catch(e){
            console.error('Logout failed:', e);
            router.push('/home'); // Redirect to home or any other page if logout fails
        }
 }
        logoutUser();
    },[])
    // You can add logout logic here, e.g., clearing tokens, redirecting, etc.
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00ff88] mb-6"></div>
        <div className="text-2xl font-bold text-[#00ff88] drop-shadow-lg mb-2">Loading...</div>
        <div className="text-[#b2becd] text-base">Please wait while we logging you out</div>
      </div>
    );
};

const userLogoutPage :React.FC = () => {
    return (
        <UserProtectWrapper>
        <LogoutPage />
        </UserProtectWrapper>
    );
}
export default userLogoutPage;