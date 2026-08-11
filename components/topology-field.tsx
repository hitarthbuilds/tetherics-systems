"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number; vx: number; vy: number; role: string };

const roles = ["SENSING", "STATE", "REASONING", "PLANNING", "CONTROL", "FEEDBACK"];

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 91.17 + salt * 37.31) * 10000;
  return value - Math.floor(value);
}

export function TopologyField({ onInspect }: { onInspect: (id: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -1000, y: -1000, active: false });
  const [inspection, setInspection] = useState({ role: "MOVE POINTER TO INSPECT", x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const frame = canvas.parentElement;
    if (!frame) return;
    let animationFrame = 0;
    let visible = true;
    let width = 0;
    let height = 0;
    let points: Point[] = [];

    const rebuild = () => {
      const rect = frame.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 700 ? 28 : 54;
      points = Array.from({ length: count }, (_, index) => ({
        x: seeded(index, 1) * width,
        y: seeded(index, 2) * height,
        vx: (seeded(index, 3) - 0.5) * 0.08,
        vy: (seeded(index, 4) - 0.5) * 0.08,
        role: roles[index % roles.length],
      }));
    };

    const draw = () => {
      if (!visible) return;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(8, 8, 8, .94)";
      context.fillRect(0, 0, width, height);

      let nearest: Point | null = null;
      let nearestDistance = 88;
      points.forEach((point) => {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        const pointerDistance = Math.hypot(point.x - pointer.current.x, point.y - pointer.current.y);
        if (pointerDistance < nearestDistance) {
          nearest = point;
          nearestDistance = pointerDistance;
        }
      });

      for (let index = 0; index < points.length; index += 1) {
        for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
          const point = points[index];
          const next = points[nextIndex];
          const distance = Math.hypot(point.x - next.x, point.y - next.y);
          if (distance < 148) {
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(next.x, next.y);
            context.strokeStyle = `rgba(232, 229, 222, ${0.15 * (1 - distance / 148)})`;
            context.lineWidth = 0.75;
            context.stroke();
          }
        }
      }

      const time = performance.now() * 0.00018;
      points.forEach((point, index) => {
        const active = point === nearest;
        const pulse = (Math.sin(time * 9 + index) + 1) * 0.5;
        context.beginPath();
        context.arc(point.x, point.y, active ? 5 : 1.2 + pulse, 0, Math.PI * 2);
        context.fillStyle = active ? "#ef3d29" : `rgba(232, 229, 222, ${0.42 + pulse * 0.35})`;
        context.fill();
        if (active) {
          context.beginPath();
          context.arc(point.x, point.y, 18, 0, Math.PI * 2);
          context.strokeStyle = "rgba(239, 61, 41, .45)";
          context.stroke();
        }
      });

      if (nearest && pointer.current.active) {
        const node = nearest as Point;
        setInspection((current) =>
          current.role === node.role && Math.abs(current.x - node.x) < 2
            ? current
            : { role: node.role, x: node.x, y: node.y },
        );
      }

      animationFrame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animationFrame);
      }
    });
    observer.observe(frame);

    const resizeObserver = new ResizeObserver(rebuild);
    resizeObserver.observe(frame);
    rebuild();
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  const locate = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointer.current = { x: clientX - rect.left, y: clientY - rect.top, active: true };
  };

  return (
    <div
      className="topology-field"
      data-cursor="INSPECT"
      onPointerMove={(event) => locate(event.clientX, event.clientY)}
      onPointerLeave={() => {
        pointer.current.active = false;
        setInspection({ role: "MOVE POINTER TO INSPECT", x: 0, y: 0 });
      }}
      onClick={() => {
        if (!inspection.role.startsWith("MOVE")) onInspect(inspection.role.toLowerCase());
      }}
    >
      <canvas ref={canvasRef} aria-label="Interactive map of intelligence system relationships" />
      <div className="topology-field__scan" aria-hidden="true" />
      <div className="topology-field__readout" style={{ left: inspection.x, top: inspection.y }}>
        <span>TS-INT/{inspection.role.slice(0, 4)}</span>
        <strong>{inspection.role}</strong>
        {!inspection.role.startsWith("MOVE") && <small>STATE / ACTIVE</small>}
      </div>
      <div className="topology-field__legend" aria-hidden="true">
        <span>POINTER / SENSOR</span>
        <span>FIELD / LIVE</span>
      </div>
    </div>
  );
}
