import { useCommunicator } from "../utils/server";
import { useStore } from "../utils/Store";

export function Mood() {
  const { set, dynamics, next } = useStore();
  const { sendData } = useCommunicator();

  function send() {
    sendData()
      .then(() => next())
      .catch((err) => alert(err));
  }

  return (
    <>
      <p>Mood</p>
      <input
        min={0}
        max={1}
        step={0.001}
        type="range"
        value={dynamics}
        onChange={(e) => set("dynamics", +e.target.value)}
      />
      <br />
      <button onClick={send}>Send</button>
    </>
  );
}
