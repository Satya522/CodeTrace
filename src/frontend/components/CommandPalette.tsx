import React, { useEffect, useState } from "react";
import { Terminal, Play, Pause, SkipForward, SkipBack, RotateCcw, X } from "lucide-react";

interface Command {
  id: string;
  name: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-lg rounded-xl border border-border bg-panel shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-border px-4 py-3">
          <Terminal size={18} className="text-white/40 mr-3" />
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent text-white outline-none placeholder-white/30"
            placeholder="Search commands..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button onClick={onClose} className="text-white/40 hover:text-white transition">
            <X size={18} />
          </button>
        </div>
        
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-sm text-white/40">No commands found.</div>
          ) : (
            filteredCommands.map((cmd, i) => (
              <button
                key={cmd.id}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition text-left ${
                  i === selectedIndex ? "bg-accentBlue/20 text-accentBlue" : "text-white/70 hover:bg-white/5"
                }`}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className={i === selectedIndex ? "text-accentBlue" : "text-white/40"}>
                  {cmd.icon}
                </div>
                {cmd.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
