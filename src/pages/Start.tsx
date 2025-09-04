import { Word } from "../dictionary";
import { useCommunicator } from "../utils/server";
import { useStore } from "../utils/Store";

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
        <button className="btn btn_start fs-1 text-uppercase" onClick={proceed}>
          <Word t="START" />
        </button>
      </div>
    </>
  );
}
