import type { ReactNode } from "react";

export function LargeText({ children }: { children: ReactNode }) {
  return <p className="text-start mfs_1">{children}</p>;
}

export function SpaceBetween({ children }: { children: ReactNode }) {
  return <div className="w-100 d-flex justify-content-between">{children}</div>;
}

export function RotatedText({
  children,
  cw = false,
}: {
  children: ReactNode;
  cw?: boolean;
}) {
  return (
    <div className="h-100 d-flex">
      <span className={`rotated-text-${cw ? "CW" : "CCW"}`}>{children}</span>
    </div>
  );
}
