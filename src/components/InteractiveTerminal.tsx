import React, { useState, useRef, useEffect } from "react";
import { AsciiArt } from "./ui/ascii-art";

interface HistoryEntry {
  id: string;
  command: string;
  output?: React.ReactNode;
}

interface InteractiveTerminalProps {
  onOpenAsciiTerminal?: () => void;
}

export default function InteractiveTerminal({ onOpenAsciiTerminal }: InteractiveTerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Focus input on mount and on click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to bottom whenever history updates
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
            <div className="text-gray-400">Available commands:</div>
            <div className="flex">
              <span className="text-yellow-400 font-semibold w-24">ascii</span>
              <span className="text-gray-300">- Run ASCII portrait art animation</span>
            </div>
            <div className="flex">
              <span className="text-yellow-400 font-semibold w-24">clear</span>
              <span className="text-gray-300">- Clear terminal screen</span>
            </div>
          </div>
        );
      } else if (lower === "ascii") {
        output = (
          <div className="py-2">
            <div className="text-gray-400 text-[11px] mb-2 flex items-center justify-between">
              <span>Rendering ASCII portrait...</span>
              {onOpenAsciiTerminal && (
                <button
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onOpenAsciiTerminal();
                  }}
                  className="text-blue-400 hover:underline hover:text-blue-300 text-[11px] cursor-pointer"
                >
                  [Open dedicated window ↗]
                </button>
              )}
            </div>
            <div className="h-[220px] w-full max-w-[440px] rounded-lg overflow-hidden bg-black/90 border border-white/10 shadow-inner">
              <AsciiArt
                src="/suman.png"
                resolution={100}
                color="#e5e5e5"
                animationStyle="typewriter"
                animateOnView={false}
                className="w-full h-full"
                objectFit="contain"
              />
            </div>
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
