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
      <div className="d-flex flex-grow-1 flex-column w-50 justify-content-around">
        <CustomButton onClick={() => back(false)} className="btn_hint_blue">
          <Word t="YES" />
        </CustomButton>

        <CustomButton onClick={() => window.location.reload()}>
          <Word t="NO" />
        </CustomButton>
      </div>
    </Page>
  );
}
