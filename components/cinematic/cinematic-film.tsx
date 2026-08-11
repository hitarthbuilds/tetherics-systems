"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 96;
const FPS = 24;
const LAST_FRAME_TIME = (FRAME_COUNT - 1) / FPS;

export function CinematicFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingTime = useRef(0);
  const scheduled = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [sourceEnabled, setSourceEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enableFallback = () => setSourceEnabled(true);
    if (reducedMotion) enableFallback();
    window.addEventListener("tetherics:3d-unavailable", enableFallback);

    const update = (event: WindowEventMap["tetherics:frame"]) => {
      if (reducedMotion) return;
      const frame = Math.round(event.detail.globalProgress * (FRAME_COUNT - 1));
      pendingTime.current = frame / FPS;
      if (scheduled.current !== null) return;

      scheduled.current = window.requestAnimationFrame(() => {
        scheduled.current = null;
        const video = videoRef.current;
        const target = Math.min(LAST_FRAME_TIME, pendingTime.current);
        if (!video || video.readyState < HTMLMediaElement.HAVE_METADATA) return;
        if (Math.abs(video.currentTime - target) >= 1 / FPS) video.currentTime = target;
      });
    };

    window.addEventListener("tetherics:frame", update);
    return () => {
      window.removeEventListener("tetherics:3d-unavailable", enableFallback);
      window.removeEventListener("tetherics:frame", update);
      if (scheduled.current !== null) window.cancelAnimationFrame(scheduled.current);
    };
  }, []);

  useEffect(() => {
    if (sourceEnabled) videoRef.current?.load();
  }, [sourceEnabled]);

  return (
    <div className={`cinematic-film${ready ? " is-ready" : ""}`} aria-hidden="true">
      <div className="cinematic-film__poster" />
      <video
        ref={videoRef}
        muted
        playsInline
        preload="metadata"
        poster="/cinematic/tetherics-machine-poster-4k.jpg"
        onLoadedMetadata={(event) => {
          event.currentTarget.pause();
          event.currentTarget.currentTime = pendingTime.current;
          setReady(true);
          window.dispatchEvent(new Event("tetherics:cinematic-ready"));
        }}
        onError={() => window.dispatchEvent(new Event("tetherics:cinematic-unavailable"))}
      >
        {sourceEnabled ? <source src="/cinematic/tetherics-machine-4k.mp4" type="video/mp4" /> : null}
      </video>
      <div className="cinematic-film__grade" />
      <div className="cinematic-film__provenance">
        <span>4K / METAL PBR</span>
        <strong>CONCEPT VISUALIZATION</strong>
      </div>
    </div>
  );
}
