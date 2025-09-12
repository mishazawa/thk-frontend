import { Word } from "../dictionary";
import { LetsgoButton } from "./components/Buttons";
import { Page } from "./components/Container";
import { LargeText } from "./components/Text";

export function Manifest() {
  return (
    <>
      <Page>
        <LargeText>
          <Word t="MESSAGE1" />
        </LargeText>
        <Word t="MANIFEST" />

        <LetsgoButton className="btn_hint_blue" />
      </Page>
    </>
  );
}
