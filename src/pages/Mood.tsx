import { Word } from "../dictionary";
import { useStore } from "../utils/Store";
import { SendButton } from "./components/Buttons";
import { Page } from "./components/Container";
import { LargeText } from "./components/Text";

export function Mood() {
  const { set, dynamics } = useStore();

  return (
    <Page>
      <LargeText>
        <Word t="MOOD" />
      </LargeText>
      <div className="d-flex align-items-end w-100 mood_container">
        <div className="canvas_MOCK"></div>
        <input
          className="form-range vertical-range-rotate flex-grow-1 h-100"
          min={0}
          max={1}
          step={0.001}
          type="range"
          value={dynamics}
          onChange={(e) => set("dynamics", +e.target.value)}
        />
      </div>
      <br />
      <SendButton />
    </Page>
  );
}
