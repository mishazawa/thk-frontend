import type { ReactNode } from "react";
import { Word } from "../../dictionary";
import { useCommunicator } from "../../utils/server";
import { useStore } from "../../utils/Store";

export function DoneButton() {
  const { next } = useStore();

  return (
    <CustomButton onClick={() => next()}>
      <Word t="DONE" />
    </CustomButton>
  );
}

export function CustomButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="btn btn_rounded btn_large fs-1 text-uppercase"
    >
      {children}
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
    <CustomButton onClick={() => send()}>
      <Word t="SEND" />
    </CustomButton>
  );
}

export function BackButton() {
  const { back } = useStore();

  return (
    <CustomButton onClick={back}>
      <Word t="ANOTHER_MESSAGE" />
    </CustomButton>
  );
}
