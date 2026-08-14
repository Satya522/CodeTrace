"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ExecutionStep, QueryStep, NoSQLStep } from "@/frontend/types";

export type AnyStep = ExecutionStep | QueryStep | NoSQLStep;

export interface VisualizerEngine {
  steps: AnyStep[];
  currentIndex: number;
  currentStep: AnyStep | null;
  isPlaying: boolean;
  speed: number; // ms between steps
  setSteps: (steps: AnyStep[]) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setSpeed: (ms: number) => void;
  reset: () => void;
  isAtEnd: boolean;
  isAtStart: boolean;
  
  // Predict Mode
  showPredictMode: boolean;
  resolvePredictMode: () => void;
}

const DEFAULT_SPEED_MS = 900;
const PREDICT_INTERVAL = 8; // trigger every 8 steps

/**
 * Owns all playback state for the execution visualizer: the step list,
 * the current cursor, autoplay, and speed. Fully decoupled from where the
 * steps came from (Python engine, JS engine, or the simulated fallback).
 */
export function useVisualizerEngine(): VisualizerEngine {
  const [steps, setStepsState] = useState<AnyStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeedState] = useState(DEFAULT_SPEED_MS);
  const [showPredictMode, setShowPredictMode] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setSteps = useCallback((newSteps: AnyStep[]) => {
    setStepsState(newSteps);
    setCurrentIndex(0);
    setIsPlaying(false);
    setShowPredictMode(false);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    // If we're at the end, restart from the beginning on play.
    setCurrentIndex((idx) => (idx >= steps.length - 1 ? 0 : idx));
    setIsPlaying(true);
  }, [steps.length]);

  const next = useCallback(() => {
    setCurrentIndex((idx) => Math.min(idx + 1, Math.max(steps.length - 1, 0)));
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentIndex((idx) => Math.max(idx - 1, 0));
  }, []);

  const setSpeed = useCallback((ms: number) => {
    setSpeedState(ms);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setShowPredictMode(false);
  }, []);
  
  const resolvePredictMode = useCallback(() => {
    setShowPredictMode(false);
    setIsPlaying(true);
  }, []);

  // Autoplay interval: recreated whenever speed or play-state changes,
  // and always cleaned up on unmount / dependency change to avoid leaks.
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((idx) => {
        const nextIdx = idx + 1;
        if (nextIdx >= steps.length) {
          setIsPlaying(false);
          return idx;
        }
        
        // Predict Mode logic
        if (nextIdx > 0 && nextIdx % PREDICT_INTERVAL === 0 && steps.length > 5) {
          setIsPlaying(false);
          setShowPredictMode(true);
        }
        
        return nextIdx;
      });
    }, speed);

    return clearTimer;
  }, [isPlaying, speed, steps.length, clearTimer]);

  // Belt-and-suspenders cleanup on unmount.
  useEffect(() => clearTimer, [clearTimer]);

  const currentStep = steps[currentIndex] ?? null;

  return {
    steps,
    currentIndex,
    currentStep,
    isPlaying,
    speed,
    setSteps,
    play,
    pause,
    next,
    prev,
    setSpeed,
    reset,
    isAtEnd: steps.length === 0 || currentIndex >= steps.length - 1,
    isAtStart: currentIndex === 0,
    showPredictMode,
    resolvePredictMode
  };
}
