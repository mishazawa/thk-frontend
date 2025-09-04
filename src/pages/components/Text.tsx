import type { ReactNode } from "react";

export function LargeText({ children }: { children: ReactNode }) {
  return <p className="text-start mfs_1 text-uppercase">{children}</p>;
}
