import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { Engl, Pipeline } from "../../utils/framework";
import type { TextureObject } from "../../utils/framework/types";
import vertex_shader from "../../utils/framework/shaders/blitv.glsl?raw";
import fragment_shader from "../../utils/framework/shaders/stylef.glsl?raw";
import { useStore } from "../../utils/Store";
import { CIRCLE_RADIUS } from "../../constants";

const SHADER_NAME = "out";

export function Canvas() {
  const canvasRefForeground = useRef<HTMLCanvasElement>(null!);
  const canvasRefBackground = useRef<HTMLCanvasElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);
  const { style, size, setCanvas } = useStore();

  const engl = useRef<Engl>(null!);
  const pipeline = useRef<Pipeline>(null!);

  useEffect(() => {
    if (canvasRefBackground.current) {
      engl.current = new Engl(canvasRefBackground.current);
      pipeline.current = new Pipeline(engl.current);

      setCanvas("point", {
        x: style[0] * size.w,
        y: style[1] * size.h,
      });

      pipeline.current.add(SHADER_NAME, {
        vertex_shader,
        fragment_shader,
        width: 512,
        height: 512,
        format: "rgba8",
        filter: "linear",
        uniforms: {
          flipY: false,
        },
      });

      updateCallback();
    }
  }, []);

  function updateCallback(x = 0.5, y = 0.5) {
    pipeline.current.update({ u_xy: [x, y] });
    engl.current.blit(pipeline.current.shaders.get(SHADER_NAME)!.tex as any);
  }

  const canvasProps = useStyleCoordsPicker(
    canvasRefForeground,
    updateCallback,
    1
  );

  useResizeCanvas(containerRef);

  useEffect(() => {
    if (engl.current) {
      engl.current.resize(size.w, size.h, 1);
      updateCallback();
    }
  }, [size.w, size.h]);

  return (
    <div
      ref={containerRef}
      className="block w-100"
      style={{
        position: "relative",
        width: `${size.w}px`,
        height: `${size.h}px`,
      }}
    >
      <canvas
        ref={canvasRefBackground}
        width={size.w}
        height={size.h}
        style={{
          position: "absolute",
          zIndex: 1,
          display: "block",
          width: `${size.w}px`,
          height: `${size.h}px`,
          touchAction: "none",
        }}
      />
      {/* <canvas
        ref={canvasRefForeground}
        width={size.w}
        height={size.h}
        {...canvasProps}
        style={{
          position: "absolute",
          zIndex: 2,
          display: "block",
          width: `${size.w}px`,
          height: `${size.h}px`,
        }}
      /> */}
    </div>
  );
}

function useResizeCanvas(containerRef: RefObject<HTMLDivElement>) {
  const { style, setCanvas } = useStore();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resize = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(280, Math.round(rect.width));
      const h = Math.max(220, Math.round(rect.width * 0.64));

      setCanvas("size", { w, h });
      setCanvas("point", {
        x: style[0] * w,
        y: style[1] * h,
      });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
}

function useStyleCoordsPicker(
  canvas: RefObject<HTMLCanvasElement>,
  update: (x: number, y: number) => void,
  dpr: number = 1
) {
  const { set, size, point, setCanvas } = useStore();

  const [dragging, setDragging] = useState(false);
  const radius = CIRCLE_RADIUS;

  useEffect(() => {
    let frameId: number;

    const render = () => {
      if (!canvas.current) return;

      const ctx = canvas.current.getContext("2d");

      if (!ctx) return;

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

      if (point) {
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff33";
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      frameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(frameId);
  });

  function toLocal(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
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

  const updateNormalized = (px: number, py: number) => {
    const nx = px / size.w;
    const ny = py / size.h;
    setCanvas("point", { x: px, y: py });
    set("style", [nx, ny] as [number, number]);
    update(nx, ny);
  };

  function onDown(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) {
    const p = toLocal(e);
    setDragging(true);
    updateNormalized(p.x, p.y);
  }

  function onMove(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) {
    if (!dragging) return;
    const p = toLocal(e);
    updateNormalized(p.x, p.y);
  }

  function onUpOrLeave() {
    setDragging(false);
    if (point) updateNormalized(point.x, point.y);
  }

  return {
    onMouseDown: onDown,
    onMouseMove: onMove,
    onMouseUp: onUpOrLeave,
    onMouseLeave: onUpOrLeave,
    onTouchStart: onDown,
    onTouchMove: onMove,
    onTouchEnd: onUpOrLeave,
    onTouchCancel: onUpOrLeave,
  };
}
