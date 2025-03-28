export const SUPPORTED_LANGUAGES = {
  c: {
    name: "C",
    monacoLang: "c",
    defaultCode: `// C\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
    icon: "🔷",
    fileExtension: "c",
    color: "bg-blue-500/10 text-blue-500",
    pistonLang: "c",
  },
  cpp: {
    name: "C++",
    monacoLang: "cpp",
    defaultCode: `// C++\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
    icon: "➕",
    fileExtension: "cpp",
    color: "bg-purple-500/10 text-purple-500",
    pistonLang: "cpp",
  },
  java: {
    name: "Java",
    monacoLang: "java",
    defaultCode: `// Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    icon: "☕",
    fileExtension: "java",
    color: "bg-red-500/10 text-red-500",
    pistonLang: "java",
  },
  python: {
    name: "Python",
    monacoLang: "python",
    defaultCode: `# Python\nprint("Hello, World!")`,
    icon: "🐍",
    fileExtension: "py",
    color: "bg-yellow-500/10 text-yellow-500",
    pistonLang: "python",
  },
  javascript: {
    name: "JavaScript",
    monacoLang: "javascript",
    defaultCode: `// JavaScript\nconsole.log("Hello, World!");`,
    icon: "📜",
    fileExtension: "js",
    color: "bg-yellow-400/10 text-yellow-400",
    pistonLang: "javascript",
  },
  typescript: {
    name: "TypeScript",
    monacoLang: "typescript",
    defaultCode: `// TypeScript\nconst message: string = 'Hello, World!';\nconsole.log(message);`,
    icon: "🟦",
    fileExtension: "ts",
    color: "bg-blue-600/10 text-blue-600",
    pistonLang: "typescript",
  },
  csharp: {
    name: "C#",
    monacoLang: "csharp",
    defaultCode: `// C#\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
    icon: "🔶",
    fileExtension: "cs",
    color: "bg-green-600/10 text-green-600",
    pistonLang: "csharp",
  },
  go: {
    name: "Go",
    monacoLang: "go",
    defaultCode: `// Go\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
    icon: "🚀",
    fileExtension: "go",
    color: "bg-cyan-500/10 text-cyan-500",
    pistonLang: "go",
  },
  rust: {
    name: "Rust",
    monacoLang: "rust",
    defaultCode: `// Rust\nfn main() {\n    println!("Hello, World!");\n}`,
    icon: "🦀",
    fileExtension: "rs",
    color: "bg-orange-600/10 text-orange-600",
    pistonLang: "rust",
  },
  ruby: {
    name: "Ruby",
    monacoLang: "ruby",
    defaultCode: `# Ruby\nputs "Hello, World!"`,
    icon: "💎",
    fileExtension: "rb",
    color: "bg-red-600/10 text-red-600",
    pistonLang: "ruby",
  },
  swift: {
    name: "Swift",
    monacoLang: "swift",
    defaultCode: `// Swift\nprint("Hello, World!")`,
    icon: "🕊️",
    fileExtension: "swift",
    color: "bg-orange-500/10 text-orange-500",
    pistonLang: "swift",
  },
  php: {
    name: "PHP",
    monacoLang: "php",
    defaultCode: `// PHP\n<?php\necho "Hello, World!";`,
    icon: "🐘",
    fileExtension: "php",
    color: "bg-purple-600/10 text-purple-600",
    pistonLang: "php",
  },
};
