import { Word } from "../dictionary";
import { BackButton } from "./components/Buttons";
import { Page } from "./components/Container";
import { LargeText } from "./components/Text";

export function Done() {
  return (
    <Page>
      <LargeText>
        <Word t="SEND_SUCCESS" />
      </LargeText>
      <BackButton />
    </Page>
  );
}
