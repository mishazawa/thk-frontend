import { Word } from "../dictionary";
import { useCommunicator } from "../utils/server";
import { useStore } from "../utils/Store";
import { CustomButton } from "./components/Buttons";

export function StartPage() {
  const { sendStart } = useCommunicator();
  const { next } = useStore();
  function proceed() {
    sendStart()
      .then(() => next())
      .catch((err) => alert(err));
  }
  return (
    <>
      <div className="container-fluid d-flex flex-grow-1 align-items-center justify-content-center">
        <CustomButton onClick={proceed} className="btn_hint_blue">
          <Word t="START" />
        </CustomButton>
      </div>
    </>
  );
}
