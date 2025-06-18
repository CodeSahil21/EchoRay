import React from "react";
import dompurify from "dompurify";
interface CodeEditorProps {
  fileContent: string;
  onChange: (content: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ fileContent, onChange }) => (
  <div className="code-editor-area h-full overflow-auto flex-grow bg-[#181c2f] p-0 rounded-b-xl shadow-inner">
    <pre className="hljs h-full rounded-xl bg-[#232946] p-6 text-[#00ff88] text-base font-mono overflow-auto" style={{ minHeight: '100%', margin: 0 }}>
      <code
        className="hljs h-full outline-none"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onChange(e.currentTarget.innerText)}
        style={{
          whiteSpace: "pre-wrap",
          paddingBottom: "2rem",
          counterSet: "line-numbering",
          minHeight: '100%',
        }}
        dangerouslySetInnerHTML={{
          __html: dompurify.sanitize(fileContent),
        }}
      />
    </pre>
  </div>
);

export default CodeEditor;
/*
import MonacoEditor from "@monaco-editor/react";

export interface CodeEditorProps {
  fileContent: string;
  onChange: (content: string) => void;
  language?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ fileContent, onChange, language = "javascript" }) => (
  <div className="code-editor-area h-full overflow-auto flex-grow bg-[#181c2f] p-0 rounded-b-xl shadow-inner">
    <MonacoEditor
      height="100%"
      language={language}
      value={fileContent}
      theme="vs-dark"
      options={{
        fontSize: 16,
        minimap: { enabled: false },
        fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineNumbers: "on",
        renderLineHighlight: "all",
        scrollbar: { vertical: "auto" },
      }}
      onChange={(value: string | undefined) => onChange(value || "")}
    />
  </div>
);
*/