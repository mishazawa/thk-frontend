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


import { useEffect, useState } from "react";

async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER}health`);
    if (!res.ok) return false;
    const json = await res.json();
    return json.status === "ready";
  } catch {
    return false;
  }
}

export function BackButton() {
  const { back } = useStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: any;
    const poll = async () => {
      const ok = await checkHealth();
      setReady(ok);
      timer = setTimeout(poll, 1000); // check every 1s
    };
    poll();
    return () => clearTimeout(timer);
  }, []);

  return (
    <CustomButton onClick={back}>
      {ready ? <Word t="ANOTHER_MESSAGE" /> : <Word t="WAITING_FOR_SERVER" />}
    </CustomButton>
  );
}