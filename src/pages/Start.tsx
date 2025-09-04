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
      <button onClick={proceed}>
        <Word t="START" />
      </button>
    </>
  );
}
