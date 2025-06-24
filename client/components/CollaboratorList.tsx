import React from "react";
import { FiUser } from "react-icons/fi";

interface CollaboratorListProps {
  users?: { id: string; email: string }[];
  leaderId?: string | number;
  onDeleteProject?: () => void;
  currentUserId?: string | number;
  onRemoveCollaborators?: () => void;
}

const CollaboratorList: React.FC<CollaboratorListProps> = ({ users, leaderId, onDeleteProject, currentUserId, onRemoveCollaborators }) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const isLeader = leaderId && (currentUserId === leaderId || String(currentUserId) === String(leaderId));
  return (
    <div className="users flex flex-col gap-3 px-4 py-4 h-full">
      {safeUsers.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          No collaborator in project for now
        </div>
      ) : (
        safeUsers.map((user) => {
          const isUserLeader = Boolean(
            leaderId && (user.id === leaderId || user.id === String(leaderId))
          );
          return (
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
                    {isUserLeader && (
                      <span className="ml-2 text-xs text-yellow-400 font-bold">(Leader)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
      {/* Leader-only actions at the bottom */}
      {isLeader && (
        <div className="flex flex-col gap-2 mt-8 self-center">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
                if (onDeleteProject) {
                  onDeleteProject();
                }
              }
            }}
          >
            Delete Project
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-semibold transition"
            onClick={onRemoveCollaborators}
          >
            Remove Collaborators
          </button>
        </div>
      )}
    </div>
  );
};

export default CollaboratorList;
