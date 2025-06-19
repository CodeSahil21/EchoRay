import React from "react";
import { FiUser } from "react-icons/fi";

interface CollaboratorListProps {
  users?: { id: string; email: string }[];
  leaderId?: string | number;
  onDeleteProject?: () => void;
  currentUserId?: string | number;
}

const CollaboratorList: React.FC<CollaboratorListProps> = ({ users, leaderId, onDeleteProject, currentUserId }) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const isLeader = leaderId && (currentUserId === leaderId || String(currentUserId) === String(leaderId));
  return (
    <div className="users flex flex-col gap-3 px-4 py-4 h-full">
      {safeUsers.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          No collaborator in project for now
        </div>
      ) : (
        safeUsers.map((user) => (
          <div
            key={user.id}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#232946] border border-[#00ff88]/30 shadow-md hover:shadow-lg transition group backdrop-blur-sm">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-[#00ff88] to-[#00bfff] text-[#0e1e13] text-lg font-bold shadow group-hover:scale-110 transition-transform border-2 border-[#00ff88]/60">
                <FiUser />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)] text-base">
                  {user.email}
                  {leaderId && (user.id === leaderId || user.id === String(leaderId)) && (
                    <span className="ml-2 text-xs text-yellow-400 font-bold">(Leader)</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
      {/* Delete Project button at the bottom, only for leader */}
      {isLeader && (
        <button
          className="mt-8 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition self-center"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
              onDeleteProject && onDeleteProject();
            }
          }}
        >
          Delete Project
        </button>
      )}
    </div>
  );
};

export default CollaboratorList;
