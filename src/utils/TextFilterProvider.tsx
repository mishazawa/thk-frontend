import { createContext, useContext, type ReactNode } from "react";
import { Filter } from "bad-words";

const Context = createContext<Filter>(null!);

export function useTextFilter() {
  return useContext(Context);
}

export function TextFilterProvider({ children }: { children: ReactNode }) {
  const model = new Filter();

  return <Context.Provider value={model}>{children}</Context.Provider>;
}
