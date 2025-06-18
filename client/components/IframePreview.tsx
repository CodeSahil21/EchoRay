import React from "react";

interface IframePreviewProps {
  iframeUrl: string;
  setIframeUrl: (url: string) => void;
}

const IframePreview: React.FC<IframePreviewProps> = ({ iframeUrl, setIframeUrl }) => (
  <div className="flex min-w-96 flex-col h-full border-l border-[#00ff88]/20 bg-[#232946]">
    <div className="address-bar bg-[#181c2f] border-b border-[#00ff88]/20 p-2 flex items-center">
      <input
        type="text"
        onChange={(e) => setIframeUrl(e.target.value)}
        value={iframeUrl}
        className="w-full p-2 px-4 bg-[#232946] text-[#00ff88] font-mono text-base rounded shadow-inner border border-[#00ff88]/20 focus:outline-none focus:ring-2 focus:ring-[#00ff88]/30"
      />
    </div>
    <iframe src={iframeUrl} className="w-full h-full flex-grow bg-[#181c2f]" />
  </div>
);

export default IframePreview;
