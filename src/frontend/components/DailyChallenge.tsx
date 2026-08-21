"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Share2, Check, RefreshCw, Loader2 } from "lucide-react";
import { JS_SNIPPETS } from "@/frontend/lib/algorithmSnippets";

interface DailyChallengeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

interface Challenge {
  id: number;
  title: string;
  code: string;
  questions: Question[];
}

// Pseudo-random deterministic generator based on the current date string
function getDailyChallenge(): Challenge {
  const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const hash = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const snippetIndex = hash % JS_SNIPPETS.length;
  const snippet = JS_SNIPPETS[snippetIndex];

  // Hardcoded generic questions for any snippet for the sake of Gamification demonstration.
  // In a real app, these would be hand-authored per snippet or generated via AI.
  const questions: Question[] = [
    {
      text: "What is the primary Big-O time complexity of this algorithm?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n^2)", "O(n log n)"],
      correctIndex: snippet.category === "sorting" ? 3 : 2, // arbitrary for gamification demo
    },
    {
      text: "Does this algorithm modify the original data structure (in-place)?",
      options: ["Yes", "No", "Depends on the input", "I don't know"],
      correctIndex: 0,
    },
    {
      text: "Which data structure is this algorithm best suited for?",
      options: ["Arrays", "Linked Lists", "Trees", "Graphs"],
      correctIndex: snippet.category === "sorting" ? 0 : snippet.category === "graph" ? 3 : 2,
    }
  ];

  return {
    id: hash,
    title: snippet.name,
    code: snippet.code,
    questions,
  };
}

export function DailyChallenge({ isOpen, onClose }: DailyChallengeProps) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const todayChallenge = getDailyChallenge();
      setChallenge(todayChallenge);
      
      const dateStr = new Date().toISOString().split("T")[0];
      const saved = localStorage.getItem(`codetrace-daily-${dateStr}`);
      if (saved) {
        setAnswers(JSON.parse(saved));
        setCompleted(true);
        setCurrentQ(todayChallenge.questions.length);
      } else {
        setAnswers([]);
        setCompleted(false);
        setCurrentQ(0);
        setCopied(false);
      }
    }
  }, [isOpen]);

  if (!isOpen || !challenge) return null;

  const handleAnswer = (index: number) => {
    const isCorrect = index === challenge.questions[currentQ].correctIndex;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    if (currentQ + 1 < challenge.questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setCompleted(true);
      const dateStr = new Date().toISOString().split("T")[0];
      localStorage.setItem(`codetrace-daily-${dateStr}`, JSON.stringify(newAnswers));
    }
  };

  const getShareText = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const emojiGrid = answers.map(a => a ? "🟩" : "🟥").join("");
    return `CodeTrace Daily ${dateStr}\n${challenge.title}\n${emojiGrid}\nCan you trace it?`;
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0a0f1a] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accentBlue/20 rounded-lg">
                <Target size={20} className="text-accentBlue" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Daily Algorithm Challenge</h2>
                <p className="text-xs text-white/50">{new Date().toLocaleDateString()} • {challenge.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-col md:flex-row min-h-[400px]">
            {/* Left side: Code snippet */}
            <div className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-white/10 bg-[#05080f] overflow-y-auto max-h-[300px] md:max-h-[500px]">
              <div className="text-xs font-mono text-white/40 mb-3 uppercase tracking-wider">Analyze this code:</div>
              <pre className="text-[11px] font-mono text-white/80 leading-relaxed">
                {challenge.code}
              </pre>
            </div>

            {/* Right side: Questions or Results */}
            <div className="md:w-1/2 p-6 flex flex-col justify-center bg-black/20 relative">
              
              {/* Progress Bar */}
              {!completed && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                  <motion.div 
                    className="h-full bg-accentBlue"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentQ / challenge.questions.length) * 100}%` }}
                  />
                </div>
              )}

              {completed ? (
                <div className="flex flex-col items-center text-center">
                  <div className="text-5xl mb-6 flex gap-2">
                    {answers.map((ans, i) => (
                      <motion.span 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                      >
                        {ans ? "🟩" : "🟥"}
                      </motion.span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Challenge Complete!</h3>
                  <p className="text-sm text-white/60 mb-8">
                    You scored {answers.filter(Boolean).length} out of {answers.length}.
                  </p>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-6 py-3 bg-accentBlue text-white font-bold rounded-xl hover:bg-accentBlue/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  >
                    {copied ? <Check size={18} /> : <Share2 size={18} />}
                    {copied ? "Copied to Clipboard!" : "Share Results"}
                  </button>
                  <p className="text-[10px] text-white/40 mt-4">Come back tomorrow for a new challenge!</p>
                </div>
              ) : (
                <div className="flex flex-col h-full justify-center">
                  <div className="mb-6">
                    <span className="text-[10px] font-bold text-accentBlue uppercase tracking-wider mb-2 block">
                      Question {currentQ + 1} of {challenge.questions.length}
                    </span>
                    <h3 className="text-lg font-medium text-white/90 leading-snug">
                      {challenge.questions[currentQ].text}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3">
                    {challenge.questions[currentQ].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        className="text-left px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-sm text-white/80 transition-all hover:translate-x-1"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
