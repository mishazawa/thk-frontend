import { type ReactNode } from "react";
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
  className,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "btn btn_rounded btn_large fs-1 text-uppercase " + (className ?? "")
      }
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

export function BackToStartButton({ isReady }: { isReady: boolean }) {
  const { back } = useStore();
  return (
    <CustomButton onClick={back}>
      {isReady ? <Word t="ANOTHER_MESSAGE" /> : <Word t="WAITING_FOR_SERVER" />}
    </CustomButton>
  );
}

export function BackStepButton(props: any) {
  const { next } = useStore();

  return (
    <CustomButton onClick={() => next(-1)} {...props}>
      <Word t="BACK" />
    </CustomButton>
  );
}

export function NextStepButton(props: any) {
  const { next } = useStore();

  return (
    <CustomButton onClick={() => next()} {...props}>
      <Word t="NEXT" />
    </CustomButton>
  );
}

export function Controls() {
  return (
    <div className="w-100 d-flex justify-content-between gap-5">
      <BackStepButton className="flex-fill" />
      <NextStepButton className="flex-fill" />
    </div>
  );
}
