import React from "react";
import MonacoEditor from "@monaco-editor/react";

export interface CodeEditorProps {
  fileContent: string;
  onChange: (content: string) => void;
  onBlur?: (content: string) => void;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ fileContent, onChange, onBlur, language = "javascript" }) => {
  // Attach blur event to Monaco editor
  const handleEditorMount = (editor: {
    onDidBlurEditorWidget: (callback: () => void) => void;
    getValue: () => string;
  }): void => {
    if (onBlur) {
      editor.onDidBlurEditorWidget(() => {
        const value = editor.getValue();
        onBlur(value);
      });
    }
  };

  return (
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
        onMount={handleEditorMount}
      />
    </div>
  );
};

export default CodeEditor;