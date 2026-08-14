import React, { useState } from "react";
import { Brain, CheckCircle, XCircle } from "lucide-react";

interface PredictModeProps {
  onContinue: () => void;
  variableContext?: string;
}

export function PredictMode({ onContinue, variableContext }: PredictModeProps) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-panel/90 p-6 shadow-2xl">
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accentPurple/20 text-accentPurple">
                <Brain size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Predict Mode</h2>
                <p className="text-xs text-white/50">Execution paused. What happens next?</p>
              </div>
            </div>

            {variableContext && (
              <div className="rounded-lg bg-black/40 p-3 text-xs font-mono text-white/70">
                <span className="text-accentBlue">Context:</span> {variableContext}
              </div>
            )}

            <input
              type="text"
              autoFocus
              placeholder="e.g. i becomes 5, or function returns"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full rounded-lg border border-border bg-black/50 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-accentPurple focus:outline-none focus:ring-1 focus:ring-accentPurple"
            />

            <button
              type="submit"
              disabled={!answer.trim()}
              className="mt-2 w-full rounded-lg bg-accentPurple py-2.5 text-sm font-semibold text-white transition hover:bg-accentPurple/90 disabled:opacity-50"
            >
              Submit Prediction
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accentGreen/20 text-accentGreen">
              <CheckCircle size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Prediction Logged!</h2>
              <p className="mt-1 text-sm text-white/60">
                Let's continue execution and see if you were right.
              </p>
            </div>
            <button
              onClick={onContinue}
              className="mt-2 w-full rounded-lg bg-accentGreen py-2.5 text-sm font-semibold text-white transition hover:bg-accentGreen/90"
            >
              Continue Execution
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
