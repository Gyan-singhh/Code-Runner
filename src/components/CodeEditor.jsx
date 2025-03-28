import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { SUPPORTED_LANGUAGES } from "./languages.js";
import {
  FaSun,
  FaMoon,
  FaPlay,
  FaDownload,
  FaRedo,
  FaTrash,
  FaChevronDown,
} from "react-icons/fa";
import { GiLaptop } from "react-icons/gi";

export default function CodeEditor() {
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("c");
  const [code, setCode] = useState(SUPPORTED_LANGUAGES["c"].defaultCode);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef(null);

  useEffect(() => {
    const savedCode = localStorage.getItem(`code_${language}`);
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedFontSize = parseInt(localStorage.getItem("fontSize")) || 14;

    const isDarkMode = savedDarkMode === null ? true : savedDarkMode === "true";

    setDarkMode(isDarkMode);
    setFontSize(savedFontSize);
    setCode(savedCode || SUPPORTED_LANGUAGES[language].defaultCode);
    setOutput("");
    setExecutionTime(null);

    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [language]);

  const executeWithPiston = async () => {
    setIsLoading(true);
    setOutput("Executing...");
    setExecutionTime(null);
    const startTime = performance.now();

    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: SUPPORTED_LANGUAGES[language].pistonLang,
          version: "*",
          files: [{ content: code }],
          stdin: userInput,
        },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const endTime = performance.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2) + "s";

      const result = response.data;
      setOutput(result.run.output || result.run.stderr || "No output");
      setExecutionTime(timeTaken);
    } catch (error) {
      let errorMessage = "Execution failed";
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Execution timed out (10s limit)";
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Failed to connect to execution service";
      }
      setOutput(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    if (SUPPORTED_LANGUAGES[newLanguage]) {
      localStorage.setItem(`code_${language}`, code);
      setLanguage(newLanguage);
    }
  };

  const clearEditor = () => {
    if (confirm("Are you sure you want to reset the editor?")) {
      setCode(SUPPORTED_LANGUAGES[language].defaultCode);
      localStorage.removeItem(`code_${language}`);
      setOutput("");
      setExecutionTime(null);
    }
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `code.${SUPPORTED_LANGUAGES[language].fileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.documentElement.classList.toggle("dark", newMode);
  };

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 1, 20);
    setFontSize(newSize);
    localStorage.setItem("fontSize", newSize.toString());
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 1, 10);
    setFontSize(newSize);
    localStorage.setItem("fontSize", newSize.toString());
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <header
        className={`flex flex-wrap justify-between items-center p-3 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-100 border-gray-300"
        } border-b shadow-sm gap-2`}
      >
        <div className="flex items-center flex-shrink-0 space-x-2 sm:space-x-4">
          <h1
            className={`text-xl font-bold ${
              darkMode ? "text-blue-400" : "text-blue-600"
            } flex items-center`}
          >
            <GiLaptop size={22} className="mr-2" />
            <span className="hidden sm:inline">Code</span> Runner
          </h1>

          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              disabled={isLoading}
              className={`md:px-3 py-1 px-1 rounded-md text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-800"
              } border focus:outline-none focus:ring-1 ${
                SUPPORTED_LANGUAGES[language].color
              } appearance-none md:pr-7`}
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([key, lang]) => (
                <option
                  key={key}
                  value={key}
                  className={`${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
                >
                  {lang.icon} {lang.name}
                </option>
              ))}
            </select>
            <div
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              <FaChevronDown size={12} />
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <div className="flex p-0.5 items-center bg-gray-200/70 dark:bg-gray-700/80 rounded-md border border-gray-300/50 dark:border-gray-600/50 divide-x divide-gray-300/50 dark:divide-gray-600/50">
            <button
              onClick={decreaseFontSize}
              className={`px-2 py-1 text-xs transition-colors ${
                fontSize <= 10
                  ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-300/70 dark:text-gray-200 dark:hover:bg-gray-600/70"
              } rounded-l-md`}
              disabled={fontSize <= 10}
              aria-label="Decrease font size"
            >
              A-
            </button>
            <span className="text-xs px-2 py-1 text-gray-700 dark:text-gray-200 min-w-[35px] text-center">
              {fontSize}px
            </span>
            <button
              onClick={increaseFontSize}
              className={`px-2 py-1 text-xs transition-colors ${
                fontSize >= 20
                  ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-300/70 dark:text-gray-200 dark:hover:bg-gray-600/70"
              } rounded-r-md`}
              disabled={fontSize >= 20}
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`p-1 rounded-md ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-amber-400"
                : "bg-gray-200 hover:bg-gray-300 text-indigo-600"
            } transition-colors`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={18} />}
          </button>
        </div>
      </header>
      <div className="pb-0.5 flex flex-col md:flex-row">
        <div
          className={`w-full md:w-2/3 ${
            darkMode ? "border-gray-700" : "border-gray-300"
          } border-r`}
        >
          <div
            className={`flex justify-between items-center p-2 ${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            } border-b ${darkMode ? "border-gray-700" : "border-gray-300"}`}
          >
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium ${SUPPORTED_LANGUAGES[language].color} px-2 py-1 rounded-md`}
              >
                {SUPPORTED_LANGUAGES[language].name}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={downloadCode}
                className={`px-3 py-1 text-xs rounded-md flex items-center space-x-1 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                <FaDownload size={15} />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={clearEditor}
                className={`px-3 py-1 text-xl rounded-md ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                <FaRedo size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden h-[33rem]">
            <Editor
              height="100%"
              width="100%"
              language={SUPPORTED_LANGUAGES[language].monacoLang}
              theme={darkMode ? "vs-dark" : "light"}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: fontSize,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 15 },
                lineNumbersMinChars: 3,
                renderWhitespace: "selection",
                wordWrap: "on",
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full md:w-1/3">
          <div
            className={`flex justify-between items-center p-2.5 ${
              darkMode ? "border-gray-700" : "border-gray-300"
            } border-b`}
          >
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm font-medium ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Execution Output
              </span>
              {executionTime && (
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    darkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  ⏱️ {executionTime}
                </span>
              )}
            </div>
            <button
              onClick={() => setOutput("")}
              disabled={!output}
              className={`px-3 py-1 text-xs rounded-md ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-300"
              } disabled:opacity-50`}
            >
              <FaTrash size={15} />
            </button>
          </div>
          <div className="h-[8rem] overflow-y-auto md:h-[21rem]">
            <div
              className={`overflow-y-auto p-4 font-mono text-sm whitespace-pre-wrap ${
                darkMode ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="text-sm">Running your code...</span>
                </div>
              ) : output ? (
                <div
                  className={
                    output.startsWith("Error")
                      ? "text-red-500"
                      : "text-white"
                  }
                >
                  {output}
                </div>
              ) : (
                <div
                  className={`${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  } italic flex items-center justify-center h-full`}
                >
                  {userInput
                    ? "Program will run with provided input"
                    : "Output will appear here"}
                </div>
              )}
            </div>
          </div>
          <div>
            <div
              className={`p-1.5 ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-300 bg-gray-100"
              } border-t`}
            >
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`block text-xs font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  PROGRAM INPUT (STDIN)
                </label>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {userInput.length} chars
                </span>
              </div>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={`w-full p-3 rounded-md font-mono text-sm border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                rows={3}
                placeholder="Enter input for your program (supports STDIN)"
                disabled={isLoading}
              />
            </div>
            <div
              className={`p-3 ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-300 bg-gray-100"
              } border-t flex space-x-2`}
            >
              <button
                onClick={() => setUserInput("")}
                disabled={!userInput}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                } disabled:opacity-50 flex-1`}
              >
                Clear Input
              </button>
              <button
                onClick={executeWithPiston}
                disabled={isLoading || !code.trim()}
                className={`px-4 py-2 rounded-md font-medium flex items-center justify-center flex-1 ${
                  isLoading ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-500"
                } ${
                  !code.trim() ? "opacity-50 cursor-not-allowed" : ""
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Running
                  </>
                ) : (
                  <>
                    <FaPlay className="mr-2" />
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
