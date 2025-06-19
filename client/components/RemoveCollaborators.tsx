import React, { useState } from "react";

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#181c2f] rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-[#00ff88]">Remove Collaborators</h2>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {users.filter(u => u.id !== String(leaderId)).map((user) => (
            <label key={user.id} className="flex items-center gap-2 p-2 rounded hover:bg-[#232946] cursor-pointer">
              <input
                type="checkbox"
                checked={selectedUserId.has(user.id)}
                onChange={() => handleUserClick(user.id)}
              />
              <span className="text-white">{user.email}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setIsRemoveModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
            onClick={removeCollaborators}
          >
            Remove Selected
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveCollaborators;
