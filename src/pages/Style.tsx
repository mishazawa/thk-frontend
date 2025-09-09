import { Word } from "../dictionary";
import { DoneButton } from "./components/Buttons";
import { LargeText } from "./components/Text";
import { Page } from "./components/Container";
import { Canvas } from "./components/EnglCanvas";

export function VisualVibe() {
  return (
    <Page>
      <LargeText>
        <Word t="QUESTION" />
      </LargeText>
      <Canvas />
      <DoneButton />
    </Page>
  );
}
