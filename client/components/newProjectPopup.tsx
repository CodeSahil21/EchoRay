import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NewProjectPopupProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

const NewProjectPopup: React.FC<NewProjectPopupProps> = ({ onClose, onCreate }) => {
  const [projectName, setProjectName] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const createProjectData = projectName.trim();
  if (!createProjectData) return;
  onClose();
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/project/create`,
      { name: createProjectData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // Only if you need cookies
      }
    );
    if (response.status === 201) {
      onCreate(createProjectData);
      setProjectName("");
      onClose();
      toast.success("Project created successfully!");
    }
  } catch (e) {
   if (axios.isAxiosError(e)) {
     toast.error(e.response?.data?.msg || "project creation failed,plz try again.");
     console.log('project creation failed:', e.message || e);
  } else {
      toast.error("project creation failed,plz try again.");
       console.log('project creation failed:', e);
  }
  }
};

  return (
    <div className="w-full h-full flex items-center justify-center fixed left-0 top-0 z-50 bg-black/30">
      <div className="w-full max-w-md bg-gradient-to-br from-[#181c2f] to-[#232946] border border-[#00ff88]/30 rounded-2xl shadow-2xl p-8 mx-auto animate-in transition-all duration-300">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-white mb-4 text-center drop-shadow">New Project</h2>
          <input
            id="projectNameInput"
            type="text"
            name="projectName"
            className="w-full px-4 py-3 rounded-xl bg-[#232946] border border-[#00ff88]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#00ff88] text-base mb-6 transition-all"
            placeholder="Enter project name..."
            autoComplete="off"
            required
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
          />
          <div className="flex justify-between gap-3 mt-4">
            <button
              type="button"
              onClick={() => { setProjectName(""); onClose(); }}
              className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#232946] to-[#2c5364] text-[#00bfff] font-bold border border-[#00bfff]/40 hover:bg-[#00bfff] hover:text-[#0e1e13] hover:border-[#00bfff] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#00bfff]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00bfff] text-[#0e1e13] font-bold border border-[#00ff88]/40 hover:bg-[#00ff88] hover:text-white hover:border-[#00ff88] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectPopup;
