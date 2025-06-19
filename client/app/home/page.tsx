"use client";
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import NewProjectPopup from '@/components/newProjectPopup';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import { useRouter } from 'next/navigation';
import UserProtectWrapper from '@/components/UserProtectWrapper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProjectStatetype {
  id: number;
  name: string;
  createdAt: string;
  users?: { id: number; }[]; 
}
const HomePageCompo: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [projectsState, setProjectsState] = useState<ProjectStatetype[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const popupPanelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10);
  };

  // Logout handler (clears localStorage and reloads)
  const handleLogout = () => {
    toast.info("Logging out...");
    router.push('/logout');
  };

  // Animate popup in/out with GSAP like a centered modal
  useEffect(() => {
    if (popupPanelRef.current) {
      if (popupOpen) {
        gsap.set(popupPanelRef.current, { y: -40, opacity: 0, scale: 0.95, display: 'flex' });
        gsap.to(popupPanelRef.current, { y: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out', display: 'flex' });
      } else {
        gsap.to(popupPanelRef.current, { y: -40, opacity: 0, scale: 0.95, duration: 0.22, ease: 'power2.in', onComplete: () => {
          if (popupPanelRef.current) gsap.set(popupPanelRef.current, { display: 'none' });
        }});
      }
    }
  }, [popupOpen]);

  const handleCreateProject = (name: string) => {
    setProjectsState(prev => [
      ...prev,
      { id: Date.now(), name, createdAt: new Date().toISOString() }
    ]);
    setPopupOpen(false);
  };

  //Fetch all projects for logged-in user
  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/project/getAll`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setProjectsState(res.data.allProjects as ProjectStatetype[]);
        } else {
          console.error("Failed to fetch projects");
        }
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e] flex flex-col items-stretch py-0 px-0 overflow-hidden w-full">
      <ToastContainer
           position="top-center"
           autoClose={2000}
           hideProgressBar={false}
           newestOnTop={false}
           closeOnClick
           rtl={false}
           pauseOnFocusLoss
           draggable
           pauseOnHover
           theme="dark"
       />
      {/* Decorative blurred circles and rings */}
      <div className="pointer-events-none select-none">
        <div className="absolute top-[-100px] left-[-120px] w-96 h-96 bg-[#00ff88]/20 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-[-120px] right-[-100px] w-[420px] h-[420px] bg-[#00bfff]/20 rounded-full blur-3xl z-0" />
        <div className="absolute top-1/3 left-[-60px] w-40 h-40 border-2 border-[#00ff88]/30 rounded-full opacity-60 blur-xl z-0" />
        <div className="absolute bottom-1/4 right-[-40px] w-28 h-28 border-2 border-[#00bfff]/20 rounded-full opacity-40 blur-lg z-0" />
      </div>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full z-20 bg-[#181c2f]/80 backdrop-blur-md shadow-lg flex items-center justify-between px-8 py-4 border-b border-[#00ff88]/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00bfff] flex items-center justify-center shadow-lg">
            <span className="text-xl font-extrabold text-[#0e1e13] select-none uppercase">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <span className="text-2xl font-bold text-white tracking-wider drop-shadow-lg select-none">
            EchoRay
          </span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#232946] to-[#2c5364] text-[#00ff88] font-bold text-base md:text-lg shadow-xl border-2 border-[#00ff88]/40 hover:bg-[#00ff88] hover:text-[#0e1e13] hover:border-[#00ff88] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00ff88]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
          Logout
        </button>
      </div>
      <div className="relative w-full max-w-5xl mx-auto z-10 pt-24 px-0 md:px-4 lg:px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-end gap-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00bfff] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-extrabold text-[#0e1e13] select-none uppercase">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-1">
                  Welcome, <span className="text-[#00ff88]">{user?.email?.split('@')[0] || 'User'}</span>
                </h1>
                <p className="text-[#b2becd] text-base md:text-lg">Your personal lab to create something</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00bfff] text-[#0e1e13] font-bold text-base md:text-lg shadow-xl hover:from-[#00bfff] hover:to-[#00ff88] hover:text-white transition-all duration-200 border-2 border-transparent hover:border-[#00ff88] focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
              onClick={() => setPopupOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              New Project
            </button>
          </div>
        </div>
        {/* Total Projects Section */}
        <div className="mb-6 flex items-center gap-4 bg-gradient-to-r from-[#00ff88]/10 to-[#00bfff]/10 border border-[#00ff88]/20 rounded-xl px-6 py-4 shadow-lg">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00bfff] text-[#0e1e13] font-extrabold text-2xl shadow-xl">
            {projectsState.length}
          </div>
          <div>
            <div className="text-lg md:text-xl font-bold text-white">Total Projects</div>
            <div className="text-[#b2becd] text-sm">All your projects at a glance</div>
          </div>
        </div>
        {/* Project List Section */}
        <div className="bg-[#181c2f]/80 rounded-2xl shadow-2xl p-6 border border-[#00ff88]/20 backdrop-blur-md w-full">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="animate-pulse bg-[#232946]/60 border border-[#00ff88]/10 rounded-xl p-5 shadow-lg flex flex-col gap-3">
                  <div className="h-6 w-1/2 bg-[#2c5364]/40 rounded mb-2"></div>
                  <div className="h-4 w-1/3 bg-[#2c5364]/30 rounded mb-1"></div>
                  <div className="h-4 w-1/4 bg-[#2c5364]/20 rounded"></div>
                  <div className="h-8 w-24 bg-[#2c5364]/20 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : projectsState.length === 0 ? (
            <div className="text-center text-[#b2becd] text-base">No projects found. Start by creating a new project!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {projectsState.map((project) => (
                <div key={project.id} className="group bg-gradient-to-br from-[#232946]/80 to-[#232946]/60 border border-[#00ff88]/10 rounded-xl p-5 shadow-lg hover:shadow-2xl hover:border-[#00ff88]/40 transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1 group-hover:text-[#00ff88] transition-all duration-200">
                      {project.name}
                    </h2>
                    <p className="text-[#b2becd] text-xs mb-2">Created: {formatDate(project.createdAt)}</p>
                    {/* Collaborators section with Remix Icon */}
                    <div className="flex items-center gap-2 mt-3">
                      <i className="ri-group-fill text-[#00bfff] text-lg"></i>
                      <span className="text-[#b2becd] text-xs font-medium ml-2">{project.users ? project.users.length : 1} Collaborator{project.users && project.users.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <button onClick={() => router.push(`/project/${project.id}`)}
                    className="mt-2 inline-block text-[#00ff88] font-semibold hover:underline text-sm">View Project</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          ref={popupPanelRef}
          style={{ display: 'none', position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 100, alignItems: 'center', justifyContent: 'center' }}
        >
          <NewProjectPopup onClose={() => setPopupOpen(false)} onCreate={handleCreateProject} />
        </div>
      </div>
    </main>
  );
};

const HomePage: React.FC = () => {
  return (
    <UserProtectWrapper>
      <HomePageCompo />
    </UserProtectWrapper>
  );
};

export default HomePage;