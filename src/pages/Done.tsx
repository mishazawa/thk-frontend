import { Word } from "../dictionary";
import { useCheckServerStatus } from "../utils/server";
import { BackButton } from "./components/Buttons";
import { Page } from "./components/Container";
import { LargeText } from "./components/Text";

export function Done() {
  const isReady = useCheckServerStatus();

  return (
    <Page>
      <LargeText>
        <Word t="SEND_SUCCESS" />
      </LargeText>
      <BackButton isReady={isReady} />
    </Page>
  );
}
