import type { ProceedProps } from "../App";

export function Mood({ callback }: ProceedProps) {
  return (
    <>
      <p>Mood</p>
      <button onClick={callback}>Send</button>
    </>
  );
}
