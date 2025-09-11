import React, { useEffect, useRef } from "react";
declare global {
  interface Window {
    TEMP_TEXT?: string;
  }
}
type Props = {
  mountRef?: React.RefObject<HTMLDivElement | null>;
  style?: React.CSSProperties;
  onReady?: (engl: any, pipe: any) => void;
};

export function EnglCanvas({ mountRef, style, onReady }: Props) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const englRef = useRef<any>(null);
  const pipeRef = useRef<any>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const container = mountRef?.current || localRef.current;
      if (!container) return;

      if (!container.style.position) container.style.position = "relative";

      //@ts-expect-error
      const mod = await import("../../engl.js");
      //@ts-expect-error
      const pipes = await import("../../pipes.js");

      const e = mod.engl_init(1024, 1024);
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
        } as CSSStyleDeclaration);
        container.appendChild(e.canvas);
      }

      // const resize = () => {
      //   const rect = container.getBoundingClientRect();
      //   const w = Math.max(1, Math.round(rect.width));
      //   const h = Math.max(1, Math.round(rect.height));
      //   const dpr = window.devicePixelRatio || 1;
      //   e.resize(w, h, dpr);
      //   e.canvas.style.width = `${rect.width}px`;
      //   e.canvas.style.height = `${rect.height}px`;
      // };
      // resize();

      // const ro = new ResizeObserver(resize);
      // ro.observe(container);
      // roRef.current = ro;

      const pipe = pipes.Style(e, {
        width: e.canvas.width,
        height: e.canvas.height,
        u_xy: [0.5, 0.5],
      });
      pipeRef.current = pipe;
      //#@ts-expect-error
      pipe.set_text(window.TEMP_TEXT || "NO TEXT");

      // first blit (optional)
      // e.blit(pipe.pipe.get("out").tex);

      onReady?.(e, pipe);

      // --- continuous render loop (30 fps) ---
      let last = 0;
      const loop = (t: number) => {
        if (cancelled) return;

        // only render if 33ms have passed (~30fps)
        if (t - last >= 1000 / 30) {
          last = t;
          pipe.update({ u_time: t * 0.001 }, false);
          e.blit(pipe.pipe.get("out").tex);
        }

        rafIdRef.current = requestAnimationFrame(loop);
      };
      rafIdRef.current = requestAnimationFrame(loop);
    })();

    return () => {
      cancelled = true;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      roRef.current?.disconnect();
      roRef.current = null;
      const e = englRef.current;
      if (e?.canvas?.parentNode) e.canvas.parentNode.removeChild(e.canvas);
      englRef.current = null;
      pipeRef.current = null;
    };
  }, []);

  if (mountRef) return null;

  return (
    <div
      ref={localRef}
      style={{
        width: "100%",
        height: 360,
        position: "relative",
        ...(style || {}),
      }}
    />
  );
}

export default EnglCanvas;
