"use client";
import React, { useState } from 'react';
import Link from "next/link";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch,} from 'react-redux';
import { setUser } from '@/store/userSlice'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EyeIcon = ({ open }: { open: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-[#b2becd] cursor-pointer"
    >
        {open ? (
            // Eye open
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
        ) : (
            // Eye closed
            <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .512-.13.995-.36 1.41M15.53 15.53A3 3 0 0112 15c-1.657 0-3-1.343-3-3 0-.512.13-.995.36-1.41" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5c2.28 0 4.36.72 6.09 1.89M21.75 12s-3.75 7.5-9.75 7.5c-2.28 0-4.36-.72-6.09-1.89" />
            </>
        )}
    </svg>
);

const SigninPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const router = useRouter();
    const dispatch = useDispatch();


    const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
      const loginData = {
            email:email.trim(),
            password:password.trim()
          }
         try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/login`,loginData);
            if(response.status === 200){
                toast.success("Login successful!");
                const token = response.data.token;
                localStorage.setItem('token', token);
                dispatch(setUser(response.data.user));
                router.push('/home'); 
            }
         }catch(e: unknown){ // FIX: specify error type
               if (axios.isAxiosError(e)) {
                    toast.error(e.response?.data?.msg || "Login failed. Please try again.");
                    console.log('Login failed:', e.message || e);
                } else {
                    toast.error("Login failed. Please try again.");
                    console.log('Login failed:', e);
                }
         }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e]">
            <ToastContainer
               position="top-center"
               autoClose={3000}
               hideProgressBar={false}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
               theme="dark"
            />
            <form onSubmit={(e)=>{
                    submitHandler(e);
                }}
            className="bg-[#181c2f] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#2c5364] backdrop-blur-md">
                <h1 className="text-3xl font-bold text-center mb-8 text-[#00ffe7] tracking-widest drop-shadow-lg">
                    Sign In for <span className="text-[#00bfff]">Echoray</span>
                </h1>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-[#b2becd] text-sm font-semibold mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-[#232946] text-[#e0e0e0] border border-[#2c5364] focus:outline-none focus:ring-2 focus:ring-[#00ffe7] transition"
                        placeholder="you@email.com"
                    />
                </div>
                <div className="mb-8 relative">
                    <label htmlFor="password" className="block text-[#b2becd] text-sm font-semibold mb-2">Password</label>
                    <div className="relative flex items-center">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 pr-12 rounded-lg bg-[#232946] text-[#e0e0e0] border border-[#2c5364] focus:outline-none focus:ring-2 focus:ring-[#00bfff] transition"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            tabIndex={0}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 h-full flex items-center bg-transparent border-none outline-none cursor-pointer p-0"
                            style={{ lineHeight: 0 }}
                        >
                            <EyeIcon open={showPassword} />
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00ffe7] to-[#00bfff] text-[#181c2f] font-bold text-lg tracking-wide shadow-lg hover:from-[#00bfff] hover:to-[#00ffe7] transition"
                >
                    Sign in
                </button>
                <div className="mt-6 text-center">
                    <span className="text-[#b2becd] text-sm">Don&apos;t have an account? </span>
                    <Link
                        href="/signup"
                        className="text-[#00bfff] hover:underline font-semibold transition-colors"
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SigninPage;