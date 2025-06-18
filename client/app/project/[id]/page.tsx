"use client";
import React, { useState, useRef, useEffect } from "react";
import CollaboratorList from "@/components/CollaboratorList";
import ProjectFiles from "@/components/ProjectFiles";
import ChatBox from "@/components/ChatBox";
import CodeEditor from "@/components/CodeEditor";
import IframePreview from "@/components/IframePreview";
import AddCollaboratorModal from "@/components/AddCollaboratorModal";
import { FiUsers, FiPlus, FiX } from "react-icons/fi";
import axios from "axios";
import { useParams } from "next/navigation";
import { initializeSocket, receiveMessage, sendMessage } from '@/config/socketIo';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import UserProtectWrapper from "@/components/UserProtectWrapper";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type FileTreeType = Record<string, { file: { contents: string } }>;

const WriteAiMessage: React.FC<{ message: string }> = ({ message }) => {
  let text = message;
  try {
    const parsed = JSON.parse(message);
    if (parsed.content) text = parsed.content;
    else if (parsed.text) text = parsed.text;
    else if (parsed.message) text = parsed.message;
    else if (parsed.files && Array.isArray(parsed.files)) {
      text = parsed.files.map((f: any) =>
        `### ${f.fileName || f.filename}\n\n\`\`\`\n${(f.content || "").replace(/\\n/g, '\n')}\n\`\`\`\n`
      ).join('\n');
    }
  } catch {}
  text = text.replace(/\\n/g, '\n');

  return (
    <div
      className="bg-slate-950 text-white rounded-sm p-2 w-[300px] max-w-xs overflow-x-auto break-words"
      style={{ whiteSpace: "pre-line" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, className, children, ...props}) {
            // @ts-ignore: node.inline is not in the type but is present at runtime
            const isInline = node && (node as any).inline;
            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre({children, ...props}) {
            return (
              <pre
                className="overflow-x-auto min-w-0"
                style={{
                  maxWidth: "100%",
                  whiteSpace: "pre",
                  wordBreak: "break-all"
                }}
                {...props}
              >
                {children}
              </pre>
            );
          },
          p({children, ...props}) {
            if (
              Array.isArray(children) &&
              children.length === 1 &&
              React.isValidElement(children[0]) &&
              (children[0] as any).type === "pre"
            ) {
              return children[0];
            }
            return <p {...props}>{children}</p>;
          }
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};
const ProjectPageCompo = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<Set<string>>(new Set());
  const [project, setProject] = useState<any>();
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [fileTree, setFileTree] = useState<FileTreeType>({}); // Start with empty file tree
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [iframeUrl, setIframeUrl] = useState("https://example.com");
  const messageBox = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const projectID = String(id);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    // Initialize socket connection
    initializeSocket(projectID);
    
     receiveMessage("project-message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      console.log("Received message:", newMessage);
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch project data
        const projectRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/project/get-project/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const projectData = projectRes.data.project;
        setProject(projectData);
        if (projectData.fileTree && Object.keys(projectData.fileTree).length > 0) {
          setFileTree(projectData.fileTree);
          const firstFile = Object.keys(projectData.fileTree)[0];
          setCurrentFile(firstFile);
          setOpenFiles([firstFile]);
        } else {
          setFileTree({});
          setCurrentFile(null);
          setOpenFiles([]);
        }

        // Fetch users data
        const usersRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/getAll`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const usersData = usersRes.data.allUsers;
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserClick = (id: string) => {
    setSelectedUserId((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const addCollaborators = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/project/addUsers`,
        {
          projectId: Number(project.id),
          users: Array.from(selectedUserId).map(Number),
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Optionally update project state with new users
      setProject(response.data.project);
      setSelectedUserId(new Set());
    } catch (error) {
      console.error("Error adding collaborators:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const send = () => {
    if (!message.trim()) return;

    // Send the message to the server via socket
    if (!user) return;
    sendMessage("project-message", {
      message,
      sender: { _id: user.id, email: user.email }
    });

    // Update local state
    setMessages((prev) => [
      ...prev,
      {  sender: { _id: user.id, email: user.email }, message },
    ]);
    setMessage("");
    setTimeout(() => {
      if (messageBox.current) {
        messageBox.current.scrollTop = messageBox.current.scrollHeight;
      }
    }, 100);
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00ff88] mb-6"></div>
        <div className="text-2xl font-bold text-[#00ff88] drop-shadow-lg mb-2">Loading...</div>
        <div className="text-[#b2becd] text-base">Please wait while we verify your session</div>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen flex bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e]">
      {/* Sidebar and Chat */}
      <section className="relative flex flex-col h-screen min-w-80 bg-[#181c2f]/80 border-r border-[#00ff88]/20">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-[#181c2f]/90 border-b border-[#00ff88]/10 sticky top-0 z-10 shadow-md">
          <button className="flex gap-2 items-center font-semibold bg-gradient-to-r from-[#00ff88] to-[#00bfff] text-[#0e1e13] rounded-lg px-4 py-2 transition text-base shadow hover:from-[#00bfff] hover:to-[#00ff88] hover:text-white border-2 border-transparent hover:border-[#00ff88]" onClick={() => setIsModalOpen(true)}>
            <span className="text-lg font-bold">+</span> Add collaborator
          </button>
          <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className="p-2 text-[#00ff88] hover:bg-[#232946] bg-transparent rounded-full transition border border-[#00ff88]/30">
            <FiUsers />
          </button>
        </header>
        <ChatBox
          messages={messages}
          users={users}
          message={message}
          setMessage={setMessage}
          send={send}
          messageBox={messageBox as React.RefObject<HTMLDivElement>}
          WriteAiMessage={WriteAiMessage}
          currentUserId={user?.id} // Pass the logged-in user's id
        />
        {/* Side Panel: Collaborators */}
        {isSidePanelOpen && (
          <div className="sidePanel w-full h-full flex flex-col gap-2 bg-[#232946]/95 absolute top-0 left-0 z-20 shadow-lg border border-[#00ff88]/20">
            <header className="flex justify-between items-center px-4 p-2 bg-[#181c2f]/90 border-b border-[#00ff88]/10">
              <h1 className="font-semibold text-lg text-[#00ff88]">Collaborators</h1>
              <button onClick={() => setIsSidePanelOpen(false)} className="p-2 text-[#b2becd] hover:bg-[#232946] rounded-full transition">
                <FiX />
              </button>
            </header>
            <CollaboratorList users={project?.users} />
          </div>
        )}
      </section>
      {/* Center: File Explorer & Code Editor */}
      <section className="flex flex-col flex-grow h-full">
        <div className="flex h-full">
          {/* File Explorer */}
          <div className="explorer h-full max-w-64 min-w-52 bg-[#232946]/80 border-r border-[#00ff88]/20 shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 pt-4 pb-4">
              <span className="text-lfont-semibold text-[#00ff88] uppercase tracking-wider">Project Files</span>
            </div>
            <hr className="border-t border-[#00ff88]/30 mx-4 mb-2" />
            <ProjectFiles
              files={Object.keys(fileTree)}
              currentFile={currentFile || ""}
              setCurrentFile={setCurrentFile}
              openFiles={openFiles}
              setOpenFiles={setOpenFiles}
            />
          </div>
          {/* Code Editor */}
          <div className="code-editor flex flex-col flex-grow h-full bg-[#181c2f]/80">
            {/* Tabs */}
            <div className="top flex justify-between w-full border-b border-[#00ff88]/10 bg-[#232946]/80">
              <div className="files flex">
                {openFiles.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFile(file)}
                    className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 border-b-2 rounded-t-lg font-medium transition text-[#b2becd] ${currentFile === file ? "bg-[#181c2f] border-[#00ff88] text-[#00ff88]" : "bg-[#232946] border-transparent hover:bg-[#181c2f] hover:text-[#00ff88]"}`}
                  >
                    <p className="font-semibold text-base">{file}</p>
                    {openFiles.length > 1 && (
                      <span
                        className="ml-2 text-[#b2becd] hover:text-red-500 rounded-full p-1 transition"
                        onClick={e => {
                          e.stopPropagation();
                          setOpenFiles(openFiles.filter(f => f !== file));
                          if (currentFile === file && openFiles.length > 1) {
                            const idx = openFiles.findIndex(f => f === file);
                            setCurrentFile(openFiles[idx === 0 ? 1 : idx - 1]);
                          }
                        }}
                        aria-label="Close tab"
                      >
                        <FiX />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="actions flex gap-2 p-2">
                <button
                  onClick={() => setIframeUrl("https://example.com")}
                  className="p-2 px-4 bg-gradient-to-r from-[#00ff88] to-[#00bfff] text-[#0e1e13] rounded-lg hover:from-[#00bfff] hover:to-[#00ff88] hover:text-white font-semibold shadow border-2 border-transparent hover:border-[#00ff88]"
                >
                  Run
                </button>
                <button
                  onClick={() => setIframeUrl("")}
                  className="p-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold shadow"
                >
                  Stop
                </button>
              </div>
            </div>
            {/* Code Area */}
            <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
              {currentFile && fileTree[currentFile] ? (
                <CodeEditor
                  fileContent={fileTree[currentFile].file.contents}
                  onChange={(updatedContent) => {
                    const ft = {
                      ...fileTree,
                      [currentFile]: {
                        file: {
                          contents: updatedContent,
                        },
                      },
                    };
                    setFileTree(ft);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#b2becd] text-lg">No file selected</div>
              )}
            </div>
          </div>
          {/* Live Preview (iframe) */}
          {iframeUrl && (
            <IframePreview iframeUrl={iframeUrl} setIframeUrl={setIframeUrl} />
          )}
        </div>
      </section>
      {/* Add Collaborator Modal */}
      {isModalOpen && (
        <AddCollaboratorModal
          users={users}
          selectedUserId={selectedUserId}
          handleUserClick={handleUserClick}
          addCollaborators={addCollaborators}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </main>
  );
};

const projectPage = () => {
  return (
    <UserProtectWrapper>
      <ProjectPageCompo />
    </UserProtectWrapper>
  );
};

export default projectPage;