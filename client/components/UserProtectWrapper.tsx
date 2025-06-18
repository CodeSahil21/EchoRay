'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '@/store/userSlice'; // adjust path if needed
import { RootState } from '@/store'; // adjust path if needed

interface UserProtectWrapperProps {
  children: React.ReactNode;
}

const UserProtectWrapper: React.FC<UserProtectWrapperProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      dispatch(clearUser());
      router.replace('/signin');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          dispatch(setUser(response.data.user));
        }
      } catch (err) {
        localStorage.removeItem('token');
        dispatch(clearUser());
        router.replace('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router, dispatch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00ff88] mb-6"></div>
        <div className="text-2xl font-bold text-[#00ff88] drop-shadow-lg mb-2">Loading...</div>
        <div className="text-[#b2becd] text-base">Please wait while we verify your session</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserProtectWrapper;