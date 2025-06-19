The dompurify library is used to sanitize HTML to prevent Cross-Site Scripting (XSS) and other injection attacks. It ensures that any HTML content rendered in the DOM (especially user-provided content) is safe and does not include malicious scripts or elements.

⚠️ Why is it needed in your component?
In your CodeEditor component, this line is potentially dangerous:

tsx
Copy
Edit
dangerouslySetInnerHTML={{
  __html: fileContent,
}}
This means you are directly injecting fileContent (which may come from user input or an untrusted source) as HTML into the DOM. If fileContent includes something like:

html
Copy
Edit
<script>alert('XSS');</script>
It will execute in the browser—this is a severe security vulnerability.

✅ How does dompurify help?
You can sanitize the HTML like this:

tsx
Copy
Edit
import DOMPurify from 'dompurify';

dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(fileContent),
}}
This will strip or neutralize dangerous content like <script> tags, inline event handlers (onclick, onload, etc.), and other potentially harmful code, ensuring only safe HTML is rendered.

🔍 Summary
Feature	Explanation
What is DOMPurify?	A JavaScript library to sanitize HTML and prevent XSS.
Why use it here?	You're rendering dangerouslySetInnerHTML, which is risky if not sanitized.
What does it do?	It removes or neutralizes malicious scripts or HTML content.
Result?	Your component becomes safe to use with untrusted or user-generated input.

If your fileContent comes from any external or user-modifiable source, using DOMPurify.sanitize(fileContent) is highly recommended.


Workspace
(rerun without)
Collecting workspace information

Thank you for sharing the reference project (soen). Here’s how you can adapt your codebase to be language-agnostic and not just for a MERN chat application:

1. File Storage & Project Model
Reference Project: The original may store files or code in a way that assumes JavaScript/Node (e.g., only .js files, or a single server.js/client.js).
Your Project: Your Project model already uses a fileTree of type Json, which is language-agnostic. You can store any file type (e.g., .py, .java, .cpp, etc.).
No change needed here.

2. Frontend Code Editor
Reference Project: May use a code editor with syntax highlighting only for JavaScript.
Your Project: Your CodeEditor is currently a simple content-editable area.
To support all languages:
Integrate a code editor like Monaco Editor or CodeMirror that supports multiple languages.
Allow users to select the language for each file (optional, but improves syntax highlighting).
Example (Monaco Editor):

You’ll need to update how you track file types and pass the correct language prop.

3. File Creation/Upload
Reference Project: May restrict file extensions or structure.
Your Project: Ensure your file creation UI allows any extension and does not assume .js or .json.
4. Backend Logic
Reference Project: May have logic that parses or runs only JavaScript/Node code.
Your Project:
If you add code execution features, make sure to use language-agnostic sandboxes or APIs (e.g., Judge0, Piston).
For now, your backend is language-agnostic since it just stores files as JSON.
5. AI Integration
When you add Gemini AI or similar, ensure you pass the correct language context for code generation or completion.
6. UI/UX
Allow users to specify file type/language when creating a new file.
Show icons or labels for different languages in the file tree.
Summary Table
Area	Reference Project (MERN)	Your Project (Current)	What to Change/Check
File Storage	JS/JSON only?	JSON, any file	Allow any extension
Code Editor	JS highlighting	Plaintext	Use Monaco/CodeMirror, multi-lang
File Creation	.js/.json	Any	Allow any extension
Backend Execution	Node.js only?	None	Use language-agnostic runner (opt.)
AI Integration	JS prompts	None yet	Pass language context
In summary:
Your codebase is already mostly language-agnostic. The main improvement is to use a multi-language code editor and ensure your UI/backend never assumes a specific language. You can look at the Monaco Editor integration example above to get started.

If you want more detailed, file-by-file guidance, let me know!

"use client";
import React, { useState, useRef, useEffect } from "react";
import CollaboratorList from "@/components/CollaboratorList";
import ProjectFiles from "@/components/ProjectFiles";
import ChatBox from "@/components/ChatBox";
import CodeEditor from "@/components/CodeEditor";
import IframePreview from "@/components/IframePreview";
import AddCollaboratorModal from "@/components/AddCollaboratorModal";
import RemoveCollaborators from "@/components/RemoveCollaborators";
import { FiUsers, FiPlus, FiX } from "react-icons/fi";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { initializeSocket, receiveMessage, sendMessage } from '@/config/socketIo';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import UserProtectWrapper from "@/components/UserProtectWrapper";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FileTreeType = Record<string, { file: { contents: string } }>;

interface MessagesType {
  sender: { _id: string; email: string };
  message: string;
}

interface ProjectUser {
  id:  number; 
  email: string;
}

interface ProjectType {
  id:  number; 
  name: string;
  fileTree: any;
  users: ProjectUser[];
  leaderId: number;
}
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
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<Set<string>>(new Set());
  const [project, setProject] = useState<ProjectType>();
  const [message, setMessage] = useState<string>(""); 
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<MessagesType[]>([]);
  const [fileTree, setFileTree] = useState<FileTreeType>({}); // Start with empty file tree
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [iframeUrl, setIframeUrl] = useState("https://example.com");
  const messageBox = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const projectID = String(id);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();
  useEffect(() => {
    // Initialize socket connection
    initializeSocket(projectID);
    
    receiveMessage("project-message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      console.log("Received message:", newMessage);
      // If AI response contains fileTree, update project files
      try {
        const parsed = JSON.parse(newMessage.message);
        if (parsed.fileTree && typeof parsed.fileTree === 'object') {
          setFileTree(prev => ({ ...prev, ...parsed.fileTree }));
        }
      } catch {}
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
      } catch (error:any) {
        // Redirect to home on any API error
        toast.error("An error occurred while fetching project data.");
        router.push("/home");
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
    setIsModalOpen(false);
    toast.info("Adding collaborators...");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/project/addUsers`,
        {
          projectId: Number(project?.id),
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
      toast.success("Collaborators added successfully!");
      setSelectedUserId(new Set());
    } catch (error:any) {
      toast.error(  "only leaders can add collaborators.");
    } 
  };

  const removeCollaborators = async () => {
    if (!project?.id || selectedUserId.size === 0) return;
    setIsRemoveModalOpen(false);
    toast.info("Removing collaborators...");  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/project/removeUsers`,
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
      setProject(response.data.project);
      toast.success("Collaborators removed successfully!");
      setSelectedUserId(new Set());
    } catch (error: any) {
      toast.error(error?.response?.data?.msg || "Failed to remove collaborators.");
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
  
  const handleDeleteProject = async () => {
    if (!project?.id) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/project/delete/${project.id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Project deleted successfully!");
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.msg || "Failed to delete project.");
    }
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
        <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                     />
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
            <CollaboratorList
              users={project?.users?.map(u => ({ id: String(u.id), email: u.email }))}
              leaderId={project?.leaderId}
              onDeleteProject={handleDeleteProject}
              currentUserId={user?.id}
              onRemoveCollaborators={() => setIsRemoveModalOpen(true)}
            />
            {isRemoveModalOpen && (
              <RemoveCollaborators
                users={project?.users?.map(u => ({ id: String(u.id), email: u.email })) || []}
                selectedUserId={selectedUserId}
                handleUserClick={handleUserClick}
                removeCollaborators={removeCollaborators}
                setIsRemoveModalOpen={setIsRemoveModalOpen}
                leaderId={project?.leaderId}
              />
            )}
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

// ErrorBoundary component to catch errors and redirect
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  static contextType = React.createContext({ push: (path: string) => {} });
  declare context: React.ContextType<typeof ErrorBoundary.contextType>;
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log error here if needed
  }
  componentDidUpdate() {
    if (this.state.hasError && this.context && typeof this.context.push === 'function') {
      this.context.push('/home');
    }
  }
  render() {
    if (this.state.hasError) {
      // Optionally render a fallback UI
      return null;
    }
    return this.props.children;
  }
}

const projectPage = () => {
  const router = useRouter();
  return (
    <ErrorBoundary>
      <UserProtectWrapper>
        <ProjectPageCompo />
      </UserProtectWrapper>
    </ErrorBoundary>
  );
};

export default projectPage;