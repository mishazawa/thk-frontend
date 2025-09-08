import React, { useEffect, useRef } from "react";

type Props = {
  mountRef?: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
  onReady?: (engl: any, pipe: any) => void; // expose both
};

export function EnglCanvas({ mountRef, style, onReady }: Props) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const englRef = useRef<any>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const container = mountRef?.current || localRef.current;
      if (!container) return;

      if (!container.style.position) container.style.position = "relative";

      const mod = await import("../../engl.js");
      const pipes = await import("../../pipes.js");

      const e = mod.engl_init();
      if (cancelled) return;
      englRef.current = e;

      if (!container.querySelector("canvas[data-engl]")) {
        e.canvas.dataset.engl = "true";
        Object.assign(e.canvas.style, {
          position: "absolute",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%",
          zIndex: "0",
          pointerEvents: "none",
        });
        container.appendChild(e.canvas);
      }

      const resize = () => {
        const rect = container.getBoundingClientRect();
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));
        const dpr = window.devicePixelRatio || 1;
        e.resize(w, h, dpr);
        e.canvas.style.width = `${rect.width}px`;
        e.canvas.style.height = `${rect.height}px`;
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(container);
      roRef.current = ro;

      // pipeline
      const pipe = pipes.Style(e, {});
      pipe.update({ u_xy: [0.5, 0.5] }, true);
      e.blit(pipe.pipe.get("out").tex);

      // ✅ hand both back
      onReady?.(e, pipe);
    })();

    return () => {
      cancelled = true;
      roRef.current?.disconnect();
      const e = englRef.current;
      if (e?.canvas?.parentNode) e.canvas.parentNode.removeChild(e.canvas);
      englRef.current = null;
    };
  }, []);

  if (mountRef) return null;

  return (
    <div
      ref={localRef}
      style={{ width: "100%", height: 360, position: "relative", ...(style || {}) }}
    />
  );
}

export default EnglCanvas;