import { Word } from "../dictionary";
import { useStore } from "../utils/Store";
import { CustomButton } from "./components/Buttons";
import { Page } from "./components/Container";
import { LargeText } from "./components/Text";

export function ReturnScreen() {
  const { back } = useStore();

  return (
    <Page>
      <LargeText>
        <Word t="ANOTHER_MESSAGE" />
      </LargeText>
      <div className="d-flex flex-grow-1 w-100 justify-content-center align-items-center">
        <div className="d-flex flex-column gap-5">
          <CustomButton onClick={() => back(false)} className="btn_hint_blue">
            <Word t="YES_1" />
          </CustomButton>

          <CustomButton onClick={() => window.location.reload()}>
            <Word t="NO_1" />
          </CustomButton>
        </div>
      </div>
    </Page>
  );
}
