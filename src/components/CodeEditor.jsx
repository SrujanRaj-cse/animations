// CodeEditor.jsx
import React from "react";

const CodeEditor = ({ code, setCode }) => {
  return (
    <div
      className="bg-gray-900 text-white p-4 h-full"
      style={{ minHeight: "400px" }}
    >
      <p className="text-sm text-gray-400">// Code Editor Placeholder</p>
      <pre className="mt-2 whitespace-pre-wrap">{code}</pre>
    </div>
  );
};

export default CodeEditor;
