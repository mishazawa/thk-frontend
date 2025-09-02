import { useEffect, useRef, useState } from "react";
import { useStore } from "../utils/Store";
import { CIRCLE_RADIUS } from "../constants";

export function VisualVibe() {
  const { next } = useStore();

  return (
    <>
      <p>What do you love about nature the most</p>
      <CoordsPicker />
      <button onClick={() => next()}>Proceed</button>
    </>
  );
}

function CoordsPicker() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: 560,
    h: 360,
  });

  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const { set } = useStore();
  const [dragging, setDragging] = useState(false);

  const radius = CIRCLE_RADIUS;

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

  // ok for now
  useEffect(() => {
    let frameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
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
      ctx.strokeStyle = "#eeeeee"; // gray-300
      ctx.strokeRect(0.5, 0.5, size.w - 1, size.h - 1);

      ctx.strokeStyle = "#eeeeee"; // gray-400
      ctx.beginPath();
      ctx.moveTo(0, Math.floor(size.h / 2) + 0.5);
      ctx.lineTo(size.w, Math.floor(size.h / 2) + 0.5);
      ctx.moveTo(Math.floor(size.w / 2) + 0.5, 0);
      ctx.lineTo(Math.floor(size.w / 2) + 0.5, size.h);
      ctx.stroke();

      if (point) {
        ctx.fillStyle = "#333333"; // gray-900
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frameId);
  }, [size, dpr, point]);

  const toLocal = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    return {
      x: Math.max(0, Math.min(size.w, x)),
      y: Math.max(0, Math.min(size.h, y)),
    };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setPoint(toLocal(e));
    setDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = toLocal(e);
    if (dragging) {
      setPoint(pos);
    }
  };

  const onMouseUp = () => {
    setDragging(false);
    if (point) {
      set("style", toNormalized(point.x, point.y, canvasRef.current!));
    }
  };

  const onMouseLeave = () => {
    setDragging(false);
    if (point) {
      set("style", toNormalized(point.x, point.y, canvasRef.current!));
    }
  };

  function toNormalized(
    x: number,
    y: number,
    canvas: HTMLCanvasElement
  ): [number, number] {
    return [x / canvas.width, y / canvas.height];
  }

  return (
    <div ref={containerRef}>
      <canvas
        ref={canvasRef}
        width={size.w}
        height={size.h}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        className="block w-full h-auto cursor-crosshair"
      />
    </div>
  );
}
