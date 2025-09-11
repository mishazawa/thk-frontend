import type { ReactNode } from "react";

export function Page({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "p-5 container-fluid flex-column d-flex flex-grow-1 align-items-center justify-content-around " +
        className
      }
    >
      {children}
    </div>
  );
}
