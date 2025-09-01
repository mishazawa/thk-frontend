import { useEffect, useRef, useState } from "react";
import type { ProceedProps } from "../App";

export function VisualVibe({ callback }: ProceedProps) {
  return (
    <>
      <p>What do you love about nature the most</p>
      <CoordsPicker />
      <button onClick={callback}>Proceed</button>
    </>
  );
}

function CoordsPicker() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [_point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const [_hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: 560,
    h: 360,
  });

  // Resize observer to make the canvas responsive
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resize = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(280, Math.round(rect.width));
      const h = Math.max(220, Math.round(rect.width * 0.64));
      setSize({ w, h });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    canvas.style.width = `${size.w}px`;
    canvas.style.height = `${size.h}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size.w, size.h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size.w, size.h);

    // Border
    ctx.strokeStyle = "#d1d5db"; // gray-300
    ctx.strokeRect(0.5, 0.5, size.w - 1, size.h - 1);

    ctx.strokeStyle = "#9ca3af"; // gray-400
    ctx.beginPath();
    ctx.moveTo(0, Math.floor(size.h / 2) + 0.5);
    ctx.lineTo(size.w, Math.floor(size.h / 2) + 0.5);
    ctx.moveTo(Math.floor(size.w / 2) + 0.5, 0);
    ctx.lineTo(Math.floor(size.w / 2) + 0.5, size.h);
    ctx.stroke();
  }, [size, dpr]);

  const toLocal = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    return {
      x: Math.max(0, Math.min(size.w, x)),
      y: Math.max(0, Math.min(size.h, y)),
    };
  };

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const p = toLocal(e);
    setPoint(p);
  };

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setHover(toLocal(e));
  };

  const onLeave = () => setHover(null);
  return (
    <div ref={containerRef}>
      <canvas
        ref={canvasRef}
        width={size.w}
        height={size.h}
        onClick={onClick}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="block w-full h-auto cursor-crosshair"
        aria-label="X/Y coordinate picker canvas"
      />
    </div>
  );
}
