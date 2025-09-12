import React, { useEffect, useRef } from "react";
import { useEngl } from "../../utils/EnlgProvider.js";
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
  const { e, pipe } = useEngl();

  const roRef = useRef<ResizeObserver | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!e) return;
    let cancelled = false;

    const container = mountRef?.current || localRef.current;
    if (!container) return;

    if (!container.style.position) container.style.position = "relative";

    if (cancelled) return;

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

    pipe.set_text(window.TEMP_TEXT || "THK");

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

    return () => {
      cancelled = true;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      roRef.current?.disconnect();
      roRef.current = null;
      if (e?.canvas?.parentNode) e.canvas.parentNode.removeChild(e.canvas);
    };
  }, [e, pipe]);

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
