import type { ReactNode } from "react";

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="p-5 container-fluid flex-column d-flex flex-grow-1 align-items-center justify-content-around">
      {children}
    </div>
  );
}
