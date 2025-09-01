import type { ProceedProps } from "../App";

export function StartPage({ callback }: ProceedProps) {
  return (
    <>
      <button onClick={callback}>Start</button>
    </>
  );
}
