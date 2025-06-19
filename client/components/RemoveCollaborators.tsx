import React, { useState } from "react";
import { FiX, FiUser, FiSearch, FiUserMinus } from "react-icons/fi";

interface RemoveCollaboratorsProps {
  users: { id: string; email: string }[];
  selectedUserId: Set<string>;
  handleUserClick: (id: string) => void;
  removeCollaborators: () => void;
  setIsRemoveModalOpen: (open: boolean) => void;
  leaderId?: string | number;
}

const RemoveCollaborators: React.FC<RemoveCollaboratorsProps> = ({
  users,
  selectedUserId,
  handleUserClick,
  removeCollaborators,
  setIsRemoveModalOpen,
  leaderId
}) => {
  const [search, setSearch] = useState("");
  const filteredUsers = (Array.isArray(users) ? users : [])
    .filter(user => user.id !== String(leaderId))
    .filter(user => user.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl bg-gradient-to-br from-[#232946]/90 to-[#181c2f]/90 border border-[#00ff88]/20 p-0 overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center px-5 py-3 bg-[#181c2f]/90 border-b border-[#00ff88]/20 rounded-t-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <FiUserMinus className="text-red-400 text-xl" />
            <h2 className="text-lg font-bold text-red-400 tracking-wide">Remove Collaborators</h2>
          </div>
          <button onClick={() => setIsRemoveModalOpen(false)} className="p-2 text-[#b2becd] hover:bg-[#232946] rounded-full transition">
            <FiX className="text-xl" />
          </button>
        </header>
        {/* Search Input */}
        <div className="flex items-center gap-2 px-5 pt-4 pb-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#00ff88]/20 bg-[#232946] focus:outline-none focus:ring-2 focus:ring-[#00ff88]/30 text-[#00ff88] placeholder:text-[#b2becd] shadow-sm transition"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ff88]/60 text-lg" />
          </div>
        </div>
        {/* User List */}
        <div className="users-list flex flex-col gap-2 px-5 pb-20 pt-2 max-h-80 overflow-y-auto">
          {filteredUsers.length === 0 && <div className="text-[#b2becd] text-center py-8">No users found.</div>}
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className={`user flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition shadow-sm hover:border-red-400 hover:bg-red-400/10 ${selectedUserId.has(user.id) ? "bg-gradient-to-r from-red-400/20 to-[#00bfff]/20 border-red-400" : "bg-[#232946] border-[#00ff88]/20"}`}
              onClick={() => handleUserClick(user.id)}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-red-400 to-[#00bfff] text-[#0e1e13] text-lg font-bold shadow">
                <FiUser />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-white text-base">{user.email}</span>
              </div>
              {selectedUserId.has(user.id) && (
                <span className="ml-auto px-3 py-1 text-xs rounded-full bg-red-400 text-[#0e1e13] font-semibold shadow">Selected</span>
              )}
            </div>
          ))}
        </div>
        {/* Action Button */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center bg-[#181c2f]/90 py-4 rounded-b-2xl border-t border-[#00ff88]/20">
          <button
            onClick={removeCollaborators}
            className="px-6 py-2 bg-gradient-to-r from-red-400 to-[#00bfff] text-[#0e1e13] font-bold rounded-lg shadow hover:from-[#00bfff] hover:to-red-400 transition text-base tracking-wide border-2 border-red-400/40 hover:border-red-400"
          >
            Remove Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveCollaborators;
