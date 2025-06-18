import React from "react";
import { FiUser } from "react-icons/fi";

interface CollaboratorListProps {
  users?: { id: string; email: string }[];
}

const CollaboratorList: React.FC<CollaboratorListProps> = ({ users }) => {
  const safeUsers = Array.isArray(users) ? users : [];
  return (
    <div className="users flex flex-col gap-3 px-4 py-4">
      {safeUsers.length === 0 ? (
        <div className="text-slate-400 text-center py-8">
          No collaborator in project for now
        </div>
      ) : (
        safeUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#232946] border border-[#00ff88]/30 shadow-md hover:shadow-lg transition group backdrop-blur-sm"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-[#00ff88] to-[#00bfff] text-[#0e1e13] text-lg font-bold shadow group-hover:scale-110 transition-transform border-2 border-[#00ff88]/60">
              <FiUser />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)] text-base">
                {user.email}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CollaboratorList;
