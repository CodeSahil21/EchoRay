import React from "react";

const ProjectPageskeleton: React.FC = () => {
    return (
        <main className="h-screen w-screen flex bg-slate-100 animate-pulse">
            {/* Sidebar Skeleton */}
            <section className="relative flex flex-col h-screen min-w-80 bg-white/90 border-r border-slate-200">
                <header className="flex justify-between items-center p-2 px-4 w-full bg-white/80 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                    <div className="h-10 w-40 bg-slate-200 rounded-lg" />
                    <div className="h-10 w-10 bg-slate-200 rounded-full" />
                </header>
                {/* ChatBox Skeleton */}
                <div className="flex-grow p-4 space-y-4 overflow-auto">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <div key={idx} className="w-3/4 h-14 bg-slate-200 rounded-xl shadow" />
                    ))}
                </div>
                <div className="h-16 border-t border-slate-200 bg-white flex items-center px-4 gap-2">
                    <div className="flex-grow h-10 bg-slate-200 rounded" />
                    <div className="h-10 w-10 bg-slate-200 rounded-full" />
                </div>
            </section>

            {/* Main Workspace */}
            <section className="flex flex-col flex-grow h-full">
                <div className="flex h-full">
                    {/* File Explorer Skeleton */}
                    <div className="h-full max-w-64 min-w-52 bg-white border-r border-slate-200 shadow-sm flex flex-col">
                        <div className="px-4 pt-4 pb-2">
                            <div className="h-4 w-24 bg-slate-200 rounded" />
                        </div>
                        <div className="flex flex-col gap-2 p-2">
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="h-10 bg-slate-200 rounded-lg" />
                            ))}
                        </div>
                    </div>

                    {/* Code Editor Skeleton */}
                    <div className="flex flex-col flex-grow h-full bg-white">
                        <div className="top flex justify-between w-full border-b border-slate-200 bg-slate-50 p-2">
                            <div className="flex gap-2">
                                {Array.from({ length: 2 }).map((_, idx) => (
                                    <div key={idx} className="h-10 w-24 bg-slate-200 rounded-lg" />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <div className="h-10 w-16 bg-slate-200 rounded-lg" />
                                <div className="h-10 w-16 bg-slate-200 rounded-lg" />
                            </div>
                        </div>
                        <div className="flex-grow bg-slate-100 p-6 overflow-auto">
                            <div className="h-full w-full bg-slate-200 rounded-xl shadow-inner" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProjectPageskeleton;
