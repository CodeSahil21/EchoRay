import React from "react";
import { FiSend } from "react-icons/fi";

interface ChatMessage {
  sender: { _id: string; email: string };
  message: string;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  users: { _id: string; email: string }[];
  message: string;
  setMessage: (msg: string) => void;
  send: () => void;
  messageBox: React.RefObject<HTMLDivElement>;
  WriteAiMessage: React.FC<{ message: string }>;
  currentUserId?: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, users, message, setMessage, send, messageBox, WriteAiMessage, currentUserId }) => (
  <div className="conversation-area flex-grow flex flex-col h-full min-h-0 relative bg-gradient-to-b from-[#0f2027] via-[#2c5364] to-[#24243e]">
    <div
      ref={messageBox}
      className="message-box px-4 flex-grow flex flex-col gap-3 overflow-y-auto max-h-full min-h-0 scrollbar-thin scrollbar-thumb-[#00ff88]/40 scrollbar-track-[#232946]"
      style={{ height: 'calc(100% - 72px)' }} // 72px is approx height of input section
    >
      {messages.map((msg, index) => {
        const isCurrentUser = msg.sender._id === currentUserId;
        return (
          <div
            key={index}
            className={`w-full flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`message flex flex-col p-3 w-fit rounded-2xl shadow border max-w-xs ${isCurrentUser
                ? 'bg-gradient-to-br from-[#00ff88] to-[#1a3a2d] text-[#0e1e13] border-[#00ff88]/70 items-end shadow-lg'
                : 'bg-gradient-to-br from-[#232946] to-[#2c5364] text-[#e0e7ff] border-[#00bfff]/40 items-start shadow-md'}`}
              style={{ wordBreak: 'break-word', ...(isCurrentUser ? { borderTopRightRadius: 0 } : { borderTopLeftRadius: 0 }) }}
            >
              <small className={`opacity-90 text-xs mb-1 font-bold ${isCurrentUser ? 'text-[#0e1e13]' : 'text-[#b2becd]'}`}>{msg.sender.email}</small>
              <div className={`text-sm ${msg.sender._id === 'ai' ? 'text-[#00bfff]' : isCurrentUser ? 'text-[#0e1e13]' : 'text-[#e0e7ff]'}`}>
                {msg.sender._id === "ai" ? (
                  <WriteAiMessage message={msg.message} />
                ) : (
                  <p>{msg.message}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <div className="inputField w-full flex bg-[#181c2f]/90 border-t border-[#00ff88]/10 shadow-sm px-4 py-3 z-10">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="p-3 px-4 border-none outline-none flex-grow bg-[#232946] text-[#00ff88] placeholder:text-[#00bfff] text-base shadow-inner font-semibold"
        type="text"
        placeholder="Enter message"
        onKeyDown={e => { if (e.key === "Enter") send(); }}
      />
      <button
        onClick={send}
        className="ml-2 bg-gradient-to-r from-[#00ff88] to-[#00bfff] hover:from-[#00bfff] hover:to-[#00ff88] text-[#0e1e13] p-3 shadow-lg flex items-center justify-center transition font-bold border-2 border-[#00ff88]/40 hover:border-[#00ff88] rounded-full"
      >
        <FiSend className="text-lg" />
      </button>
    </div>
    <style jsx global>{`
    .message-box::-webkit-scrollbar {
      width: 8px;
      background: linear-gradient(180deg, #232946 0%, #2c5364 100%);
      border-radius: 8px;
    }
    .message-box::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #00ff88 0%, #00bfff 100%);
      border-radius: 8px;
      min-height: 40px;
      border: 2px solid #232946;
    }
    .message-box::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #00bfff 0%, #00ff88 100%);
    }
    .message-box {
      scrollbar-width: thin;
      scrollbar-color: #00ff88 #232946;
    }
  `}</style>
  </div>
);

export default ChatBox;
