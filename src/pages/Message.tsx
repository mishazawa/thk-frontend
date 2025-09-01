import type { ProceedProps } from "../App";

export function Message({ callback }: ProceedProps) {
  return (
    <>
      <p>What do you want to contribute to this life?</p>
      <input></input>
      <br />
      <button onClick={callback}>Done</button>
    </>
  );
}
