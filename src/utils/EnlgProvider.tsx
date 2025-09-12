import { createContext, useContext, useMemo, type ReactNode } from "react";

//@ts-expect-error
import * as mod from "../engl.js";
//@ts-expect-error
import * as pipes from "../pipes.js";

const Context = createContext<{ e: any; pipe: any }>(null!);

export function useEngl() {
  return useContext(Context);
}

export function EnglProvider({ children }: { children: ReactNode }) {
  const e = useMemo(() => mod.engl_init(1024, 1024), []);
  const pipe = useMemo(
    () =>
      pipes.Style(e, {
        width: e.canvas.width,
        height: e.canvas.height,
        u_xy: [0.5, 0.5],
        u_zw: [0.5, 0.5],
      }),
    [e]
  );

  return <Context.Provider value={{ e, pipe }}>{children}</Context.Provider>;
}
