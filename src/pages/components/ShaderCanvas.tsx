import { useRef, useState, useEffect } from "react";

import { CIRCLE_RADIUS } from "../../constants";
import EnglCanvas from "./EnglCanvas";

export function ShaderCanvas({
  value,
  updateFn,
}: {
  value: [number, number];
  updateFn: (x: number, y: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const englRef = useRef<any>(null);
  const pipeRef = useRef<any>(null);

  const [size, setSize] = useState<{ w: number; h: number }>({
    w: 128,
    h: 128,
  });

  const [point, setPoint] = useState<{ x: number; y: number }>({
    x: value[0] * size.w,
    y: value[1] * size.h,
  });

  const [dragging, setDragging] = useState(false);

  const radius = CIRCLE_RADIUS;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const resize = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(128, Math.round(rect.width));
      const h = Math.max(128, Math.round(rect.width));

      setSize({ w, h });
      setPoint({
        x: value[0] * w,
        y: value[1] * h,
      });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));

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

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size.w, size.h);

      // axes
      ctx.strokeStyle = "#eeeeee";
      ctx.beginPath();
      ctx.moveTo(0, Math.floor(size.h / 2) + 0.5);
      ctx.lineTo(size.w, Math.floor(size.h / 2) + 0.5);
      ctx.moveTo(Math.floor(size.w / 2) + 0.5, 0);
      ctx.lineTo(Math.floor(size.w / 2) + 0.5, size.h);
      ctx.stroke();

      const p = point;
      if (p) {
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff33";
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // per-frame pipe blit
      // if (pipeRef.current && englRef.current) {
      // pipeRef.current.update({ u_time: performance.now() * 0.001 }, false); // if needed
      // englRef.current.blit(pipeRef.current.pipe.get("out").tex);
      // }

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [size, dpr, radius, point]);

  useEffect(() => {
    setPoint({
      x: value[0] * size.w,
      y: value[1] * size.h,
    });
  }, []);

  const updateNormalized = (px: number, py: number) => {
    const nx = px / size.w;
    const ny = py / size.h;
    updateFn(nx, ny);
  };

  const onDown = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setPoint(toLocal(e, size));
    setDragging(true);
  };

  const onMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!dragging) return;
    setPoint(toLocal(e, size));
  };

  const onUpOrLeave = () => {
    setDragging(false);
  };

  useEffect(() => {
    updateNormalized(point.x, point.y);
  }, [point]);

  return (
    <div
      ref={containerRef}
      className="block w-100"
      style={{ position: "relative" }}
    >
      {/* BACKGROUND */}
      <EnglCanvas
        mountRef={containerRef}
        onReady={(engl, pipe) => {
          englRef.current = engl;
          pipeRef.current = pipe;
        }}
      />
      <canvas
        ref={canvasRef}
        width={size.w}
        height={size.h}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUpOrLeave}
        onMouseLeave={onUpOrLeave}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUpOrLeave}
        onTouchCancel={onUpOrLeave}
        style={{
          position: "relative",
          zIndex: 1,
          display: "block",
          width: `${size.w}px`,
          height: `${size.h}px`,
          touchAction: "none",
        }}
      />
    </div>
  );
}

function toLocal(
  e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  size: { w: number; h: number }
) {
  const rect = e.currentTarget.getBoundingClientRect();
  let clientX: number, clientY: number;
  if ("touches" in e) {
    const touch = e.touches[0] || e.changedTouches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = (e as React.MouseEvent).clientX;
    clientY = (e as React.MouseEvent).clientY;
  }
  const x = Math.round(clientX - rect.left);
  const y = Math.round(clientY - rect.top);
  return {
    x: Math.max(0, Math.min(size.w, x)),
    y: Math.max(0, Math.min(size.h, y)),
  };
}
