import { Word } from "../dictionary";
import { useStore } from "../utils/Store";
import { SendButton } from "./Buttons";

export function Mood() {
  const { set, dynamics } = useStore();

  return (
    <>
      <p>
        <Word t="MOOD" />
      </p>
      <input
        min={0}
        max={1}
        step={0.001}
        type="range"
        value={dynamics}
        onChange={(e) => set("dynamics", +e.target.value)}
      />
      <br />
      <SendButton />
    </>
  );
}
