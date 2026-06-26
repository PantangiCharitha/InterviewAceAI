import { useState } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor({
  language,
  setLanguage,
  code,
  setCode,
}) {
  const starterCode = {
    java: `public class Main {

    public static void main(String[] args) {

    }

}`,

    javascript: `function solution() {

}`,

    python: `def solution():

    pass`,
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;

    setLanguage(newLanguage);

    setCode(starterCode[newLanguage]);
  };
    return (
    <div className="bg-white rounded-3xl shadow-xl p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-indigo-700">
          💻 Code Editor
        </h2>

        <select
          value={language}
          onChange={handleLanguageChange}
          className="border rounded-xl px-4 py-2"
        >
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>

      </div>

      <Editor
        height="500px"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
        options={{
          fontSize: 16,
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
        }}
      />

    </div>
  );
}

export default CodeEditor;