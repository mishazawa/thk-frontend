import { Word } from "../dictionary";
import { useCheckServerStatus, useCommunicator } from "../utils/server";
import { useStore } from "../utils/Store";
import { CustomButton } from "./components/Buttons";
import { Page } from "./components/Container";
import { LargeText } from "./components/Text";

export function StartPage() {
  const isReady = useCheckServerStatus();
  const { sendStart } = useCommunicator();
  const { next } = useStore();

  function proceed() {
    sendStart()
      .then(() => next())
      .catch((err) => alert(err));
  }
  return (
    <>
      <Page>
      <LargeText>
        <Word t="MESSAGE_START" />
      </LargeText>
      <div className="container-fluid d-flex flex-grow-1 align-items-center justify-content-center">
        {isReady ? (
          <CustomButton onClick={proceed} className="btn_hint_blue">
            <Word t="START" />
          </CustomButton>
        ) : (
          <LargeText>
            <Word t="SERVER_BUSY" />
          </LargeText>
        )}
      </div>
      </Page>
    </>
  );
}
