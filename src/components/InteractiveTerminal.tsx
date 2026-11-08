import React, { useState, useRef, useEffect } from "react";

interface HistoryEntry {
  id: string;
  command: string;
  output?: React.ReactNode;
}

export default function InteractiveTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Focus input on mount without scrolling the page
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Auto-scroll terminal container internally whenever history updates (never scroll the outer page)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleContainerClick = () => {
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = input.trim();
      const newEntryId = `${Date.now()}-${Math.random()}`;

      if (!trimmed) {
        setHistory((prev) => [...prev, { id: newEntryId, command: "" }]);
        setInput("");
        setHistoryPointer(-1);
        return;
      }

      // Record in command history for ArrowUp / ArrowDown
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryPointer(-1);

      const lower = trimmed.toLowerCase();

      if (lower === "clear") {
        setHistory([]);
        setInput("");
        return;
      }

      let output: React.ReactNode = null;

      if (lower === "help") {
        output = (
          <div className="space-y-1 text-gray-300 pl-2 py-1">
            <div className="text-gray-400 font-medium">Available commands:</div>
            <div className="flex">
              <span className="text-yellow-400 font-semibold w-24">about</span>
              <span className="text-gray-300">- Brief developer bio & background</span>
            </div>
            <div className="flex">
              <span className="text-yellow-400 font-semibold w-24">skills</span>
              <span className="text-gray-300">- Core tech stack & programming languages</span>
            </div>
            <div className="flex">
              <span className="text-yellow-400 font-semibold w-24">contact</span>
              <span className="text-gray-300">- Direct reachout channels</span>
            </div>
            <div className="flex">
              <span className="text-yellow-400 font-semibold w-24">clear</span>
              <span className="text-gray-300">- Clear terminal screen</span>
            </div>
          </div>
        );
      } else if (lower === "about") {
        output = (
          <div className="text-gray-300 pl-2 py-1 space-y-1">
            <p className="text-cyan-400 font-semibold">Suman Mahanty</p>
            <p className="text-xs text-neutral-300">
              Full Stack & Backend Software Engineer specializing in scalable microservices, interactive web applications, and low-latency systems.
            </p>
          </div>
        );
      } else if (lower === "skills") {
        output = (
          <div className="text-gray-300 pl-2 py-1 space-y-1">
            <p className="text-xs text-emerald-400 font-mono">
              Languages: Java, TypeScript, JavaScript, Golang, C, HTML5, CSS3
            </p>
            <p className="text-xs text-sky-400 font-mono">
              Frameworks: Spring Boot, Node.js, Express, React, Tailwind CSS
            </p>
            <p className="text-xs text-purple-400 font-mono">
              Cloud & Infra: Docker, PostgreSQL, MySQL, Redis, Git, Linux
            </p>
          </div>
        );
      } else if (lower === "contact") {
        output = (
          <div className="text-gray-300 pl-2 py-1 space-y-1 text-xs font-mono">
            <p>Email: <a href="mailto:sumanmahanty.99@gmail.com" className="text-cyan-400 hover:underline">sumanmahanty.99@gmail.com</a></p>
            <p>LinkedIn: <a href="https://linkedin.com/in/suman990" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">linkedin.com/in/suman990</a></p>
            <p>GitHub: <a href="https://github.com/Suman-990" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">github.com/Suman-990</a></p>
          </div>
        );
      } else {
        output = (
          <div className="text-red-400 py-0.5">
            zsh: command not found: {trimmed}. Type <span className="text-yellow-300 font-semibold">"help"</span> to get command list.
          </div>
        );
      }

      setHistory((prev) => [...prev, { id: newEntryId, command: trimmed, output }]);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextPointer = historyPointer === -1 ? commandHistory.length - 1 : Math.max(0, historyPointer - 1);
      setHistoryPointer(nextPointer);
      setInput(commandHistory[nextPointer]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPointer === -1) return;
      const nextPointer = historyPointer + 1;
      if (nextPointer >= commandHistory.length) {
        setHistoryPointer(-1);
        setInput("");
      } else {
        setHistoryPointer(nextPointer);
        setInput(commandHistory[nextPointer]);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="h-full w-full overflow-y-auto custom-scrollbar p-3 font-mono text-[12px] text-gray-300 flex flex-col space-y-2 cursor-text select-text"
    >
      {/* Welcome Banner */}
      <div className="text-gray-400 select-none pb-1 border-b border-white/5">
        Type <span className="text-yellow-400 font-semibold">"help"</span> to get command list.
      </div>

      {/* History log */}
      {history.map((entry) => (
        <div key={entry.id} className="space-y-1">
          <div className="flex items-center">
            <span className="text-green-400 font-semibold mr-2 shrink-0">suman@MacBook-Pro</span>
            <span className="text-blue-400 font-semibold mr-2 shrink-0">~</span>
            <span className="text-gray-400 shrink-0 mr-2">%</span>
            <span className="text-white break-all">{entry.command}</span>
          </div>
          {entry.output && <div>{entry.output}</div>}
        </div>
      ))}

      {/* Current Prompt Line */}
      <div className="flex items-center">
        <span className="text-green-400 font-semibold mr-2 shrink-0 select-none">suman@MacBook-Pro</span>
        <span className="text-blue-400 font-semibold mr-2 shrink-0 select-none">~</span>
        <span className="text-gray-400 shrink-0 mr-2 select-none">%</span>
        <input
          ref={inputRef}
          data-terminal-input="true"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white outline-none border-none p-0 font-mono text-[12px] caret-white"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
