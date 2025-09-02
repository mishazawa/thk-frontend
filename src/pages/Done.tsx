import { useStore } from "../utils/Store";

export function Done() {
  const { back } = useStore();
  return (
    <>
      <p>Done</p>
      <button onClick={back}>Another message</button>
    </>
  );
}
