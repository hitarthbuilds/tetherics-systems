"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export const SCENES = [
  { id: "signal", number: "00", label: "SIGNAL", state: "INITIALIZING" },
  { id: "software", number: "01", label: "SOFTWARE", state: "OBSERVING" },
  { id: "intelligence", number: "02", label: "INTELLIGENCE", state: "MODELING" },
  { id: "seerflow", number: "03", label: "SEERFLOW", state: "REASONING" },
  { id: "architecture", number: "04", label: "DATABASE CHAMBER", state: "TRAVERSING" },
  { id: "boundary", number: "05", label: "PHYSICAL BOUNDARY", state: "TRANSMITTING" },
  { id: "machine", number: "06", label: "MACHINE", state: "ASSEMBLING" },
  { id: "perception", number: "07", label: "MACHINE PERCEPTION", state: "ESTIMATING" },
  { id: "actuation", number: "08", label: "ACTUATION", state: "CONTROLLING" },
  { id: "feedback", number: "09", label: "FEEDBACK", state: "ADAPTING" },
  { id: "recovery", number: "10", label: "RECOVERY", state: "DEGRADED" },
  { id: "scale", number: "11", label: "SCALE", state: "EXPANDING" },
  { id: "convergence", number: "12", label: "CONVERGENCE", state: "CONNECTING" },
  { id: "revelation", number: "13", label: "REVELATION", state: "RESOLVING" },
  { id: "everything", number: "14", label: "EVERYTHING", state: "STABLE" },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];
export type QualityTier = "HIGH" | "MEDIUM" | "LOW" | "MOBILE" | "FALLBACK";

export type RuntimeFrame = {
  scene: SceneId;
  sceneIndex: number;
  localProgress: number;
  globalProgress: number;
  velocity: number;
  pointerX: number;
  pointerY: number;
  direction: 1 | -1;
};

declare global {
  interface WindowEventMap {
    "tetherics:frame": CustomEvent<RuntimeFrame>;
  }
}

type CinematicRuntimeValue = {
  activeScene: SceneId;
  activeIndex: number;
  audioEnabled: boolean;
  inspected: string[];
  quality: QualityTier;
  consoleOpen: boolean;
  recordsOpen: "research" | "ventures" | "directive" | null;
  activeInspection: string | null;
  inspect: (id: string) => void;
  closeInspection: () => void;
  jumpTo: (id: SceneId) => void;
  setConsoleOpen: (open: boolean) => void;
  setRecordsOpen: (record: "research" | "ventures" | "directive" | null) => void;
  toggleAudio: () => void;
};

const RuntimeContext = createContext<CinematicRuntimeValue | null>(null);

function detectQuality(): QualityTier {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse || window.innerWidth < 760) return "MOBILE";
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  if (memory >= 8 && cores >= 8) return "HIGH";
  if (memory >= 4 && cores >= 4) return "MEDIUM";
  return "LOW";
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function CinematicRuntime({ children }: { children: React.ReactNode }) {
  const [activeScene, setActiveScene] = useState<SceneId>("signal");
  const [activeIndex, setActiveIndex] = useState(0);
  const [quality, setQuality] = useState<QualityTier>("MEDIUM");
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [recordsOpen, setRecordsOpen] = useState<"research" | "ventures" | "directive" | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [inspected, setInspected] = useState<string[]>([]);
  const [activeInspection, setActiveInspection] = useState<string | null>(null);
  const audioRef = useRef<{ context: AudioContext; gain: GainNode; oscillators: OscillatorNode[] } | null>(null);

  const inspect = useCallback((id: string) => {
    setActiveInspection(id);
    setInspected((current) => {
      if (current.includes(id)) return current;
      const next = [...current, id];
      try { sessionStorage.setItem("ts-cinematic-path", JSON.stringify(next)); } catch { /* session storage is optional */ }
      return next;
    });
  }, []);

  const closeInspection = useCallback(() => setActiveInspection(null), []);

  const jumpTo = useCallback((id: SceneId) => {
    setConsoleOpen(false);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-scene="${id}"]`)?.scrollIntoView({ behavior: "smooth" }));
  }, []);

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      const active = audioRef.current;
      active.gain.gain.setTargetAtTime(0, active.context.currentTime, 0.08);
      window.setTimeout(() => {
        active.oscillators.forEach((oscillator) => oscillator.stop());
        void active.context.close();
      }, 240);
      audioRef.current = null;
      setAudioEnabled(false);
      return;
    }

    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.gain.value = 0;
    gain.connect(context.destination);
    const frequencies = [43, 86.3];
    const oscillators = frequencies.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const level = context.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      level.gain.value = index === 0 ? 0.8 : 0.14;
      oscillator.connect(level).connect(gain);
      oscillator.start();
      return oscillator;
    });
    gain.gain.setTargetAtTime(0.018, context.currentTime, 0.4);
    audioRef.current = { context, gain, oscillators };
    setAudioEnabled(true);
  }, []);

  useEffect(() => {
    const stored = (() => {
      try { return JSON.parse(sessionStorage.getItem("ts-cinematic-path") || "[]"); } catch { return []; }
    })();
    const restored = Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string") : [];
    const restoreTimer = window.setTimeout(() => {
      setQuality(detectQuality());
      setInspected(restored);
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reducedMotion ? null : new Lenis({ autoRaf: true, duration: 1.08, smoothWheel: true, wheelMultiplier: 0.92 });
    let requested = false;
    let previousY = window.scrollY;
    let smoothedVelocity = 0;
    let pointerX = 0;
    let pointerY = 0;
    let currentScene = -1;

    const update = () => {
      requested = false;
      const scrollY = window.scrollY;
      const rawVelocity = scrollY - previousY;
      previousY = scrollY;
      smoothedVelocity += (rawVelocity - smoothedVelocity) * 0.18;
      const anchor = scrollY + window.innerHeight * 0.5;
      const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      let index = 0;
      let localProgress = 0;

      for (let sceneIndex = 0; sceneIndex < elements.length; sceneIndex += 1) {
        const element = elements[sceneIndex];
        const top = element.offsetTop;
        const bottom = top + element.offsetHeight;
        if (anchor >= top && anchor < bottom) {
          index = sceneIndex;
          localProgress = clamp((scrollY - top) / Math.max(element.offsetHeight - window.innerHeight, 1));
          break;
        }
        if (anchor >= bottom) {
          index = sceneIndex;
          localProgress = 1;
        }
      }

      const scene = SCENES[Math.min(index, SCENES.length - 1)];
      const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const globalProgress = clamp(scrollY / total);
      const frame: RuntimeFrame = {
        scene: scene.id,
        sceneIndex: index,
        localProgress,
        globalProgress,
        velocity: smoothedVelocity,
        pointerX,
        pointerY,
        direction: rawVelocity >= 0 ? 1 : -1,
      };

      const root = document.documentElement;
      root.style.setProperty("--timeline", globalProgress.toFixed(4));
      root.style.setProperty("--scene-time", localProgress.toFixed(4));
      root.style.setProperty("--scroll-velocity", Math.min(1, Math.abs(smoothedVelocity) / 80).toFixed(3));
      root.style.setProperty("--pointer-x", pointerX.toFixed(3));
      root.style.setProperty("--pointer-y", pointerY.toFixed(3));
      window.dispatchEvent(new CustomEvent("tetherics:frame", { detail: frame }));

      if (currentScene !== index) {
        currentScene = index;
        setActiveIndex(index);
        setActiveScene(scene.id);
      }

      if (audioRef.current) {
        const audio = audioRef.current;
        const target = 38 + index * 2.1 + localProgress * 3;
        audio.oscillators[0].frequency.setTargetAtTime(target, audio.context.currentTime, 0.25);
      }
    };

    const schedule = () => {
      if (!requested) {
        requested = true;
        requestAnimationFrame(update);
      }
    };
    const pointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
      schedule();
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setConsoleOpen((open) => !open);
      }
      const target = event.target instanceof Element
        ? event.target.closest("input, textarea, select, [contenteditable='true']")
        : null;
      if (!target && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(SCENES.length - 1, currentScene + direction));
        event.preventDefault();
        document.querySelector<HTMLElement>(`[data-scene="${SCENES[nextIndex].id}"]`)
          ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      }
      if (event.key === "Escape") {
        setConsoleOpen(false);
        setRecordsOpen(null);
        setActiveInspection(null);
      }
    };

    lenis?.on("scroll", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("keydown", shortcut);
    schedule();

    return () => {
      lenis?.destroy();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("keydown", shortcut);
    };
  }, []);

  useEffect(() => () => {
    if (audioRef.current) {
      audioRef.current.oscillators.forEach((oscillator) => oscillator.stop());
      void audioRef.current.context.close();
    }
  }, []);

  const value = useMemo<CinematicRuntimeValue>(() => ({
    activeScene,
    activeIndex,
    activeInspection,
    audioEnabled,
    inspected,
    quality,
    consoleOpen,
    recordsOpen,
    inspect,
    closeInspection,
    jumpTo,
    setConsoleOpen,
    setRecordsOpen,
    toggleAudio,
  }), [activeIndex, activeInspection, activeScene, audioEnabled, closeInspection, consoleOpen, inspect, inspected, jumpTo, quality, recordsOpen, toggleAudio]);

  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>;
}

export function useCinematicRuntime() {
  const context = useContext(RuntimeContext);
  if (!context) throw new Error("useCinematicRuntime must be used within CinematicRuntime");
  return context;
}

export function useSceneProgress(scene: SceneId) {
  const [progress, setProgress] = useState(0);
  const lastUpdate = useRef(0);

  useEffect(() => {
    const update = (event: WindowEventMap["tetherics:frame"]) => {
      const now = performance.now();
      if (now - lastUpdate.current < 34 && event.detail.localProgress > 0 && event.detail.localProgress < 1) return;
      lastUpdate.current = now;
      setProgress(event.detail.scene === scene ? event.detail.localProgress : event.detail.sceneIndex > SCENES.findIndex((item) => item.id === scene) ? 1 : 0);
    };
    window.addEventListener("tetherics:frame", update);
    return () => window.removeEventListener("tetherics:frame", update);
  }, [scene]);

  return progress;
}
