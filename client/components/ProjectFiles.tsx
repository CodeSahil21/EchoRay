import React from "react";

interface ProjectFilesProps {
  files: string[];
  currentFile: string;
  setCurrentFile: (file: string) => void;
  openFiles: string[];
  setOpenFiles: (files: string[]) => void;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ files, currentFile, setCurrentFile, openFiles, setOpenFiles }) => (
  <div className="file-tree w-full flex flex-col gap-1 px-2 overflow-y-auto" style={{ width: '220px', minWidth: '220px', maxWidth: '220px', height: '100%' }}>
    {files.map((file, index) => {
      const isActive = currentFile === file;
      return (
        <button
          key={index}
          onClick={() => {
            setCurrentFile(file);
            setOpenFiles(Array.from(new Set([...openFiles, file])));
          }}
          className={`tree-element cursor-pointer p-2 px-4 flex items-center gap-2 rounded-lg font-medium transition text-left w-full ${isActive ? "bg-gradient-to-r from-[#00ff88]/20 to-[#00bfff]/20 text-[#00ff88]" : "bg-[#232946] text-[#b2becd] hover:bg-[#00ff88]/10"}`}
        >
          <span className="font-semibold text-base truncate">{file}</span>
        </button>
      );
    })}
  </div>
);

export default ProjectFiles;
