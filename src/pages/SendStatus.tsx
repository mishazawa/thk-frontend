import { useEffect } from "react";
import { Word } from "../dictionary";
import { useCheckServerStatus } from "../utils/server";
import { Page } from "./components/Container";
import { LargeText } from "./components/Text";
import { useStore } from "../utils/Store";

export function SendStatus() {
  const isReady = useCheckServerStatus();
  const { next } = useStore();
  useEffect(() => {
    if (isReady) return next();
  }, [isReady]);

  return (
    <Page>
      <LargeText>
        <Word t="SEND_SUCCESS" />
      </LargeText>
      <Word t="WAITING_FOR_SERVER" />
    </Page>
  );
}
