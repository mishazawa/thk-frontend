import { Word } from "../dictionary";
import { useCommunicator } from "../utils/server";
import { useStore } from "../utils/Store";

export function DoneButton() {
  const { next } = useStore();

  return (
    <button onClick={() => next()}>
      <Word t="DONE" />
    </button>
  );
}

export function SendButton() {
  const { next } = useStore();
  const { sendData } = useCommunicator();

  function send() {
    sendData()
      .then(() => next())
      .catch((err) => alert(err));
  }
  return (
    <button onClick={() => send()}>
      <Word t="SEND" />
    </button>
  );
}

export function BackButton() {
  const { back } = useStore();

  return (
    <button onClick={back}>
      <Word t="ANOTHER_MESSAGE" />
    </button>
  );
}
