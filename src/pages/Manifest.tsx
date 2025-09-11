import { Word } from "../dictionary";
import { NextStepButton } from "./components/Buttons";
import { Page } from "./components/Container";
import { LargeText } from "./components/Text";

export function Manifest() {
  return (
    <>
      <Page>
        <LargeText>
          <Word t="MESSAGE" />
        </LargeText>
        <Word t="MANIFEST" />

        <NextStepButton className="btn_hint_blue" />
      </Page>
    </>
  );
}
