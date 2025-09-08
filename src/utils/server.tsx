import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLoader, useStore } from "./Store";
import { POLLING_TIME } from "../constants";

export function useServerCommunication() {
  const { set: _, currentScreen: _1, back: _2, next: _3, ...data } = useStore();
  const { setLoading } = useLoader();

  async function sendStart() {
    return Promise.resolve();
  }

  async function sendData() {
    try {
      setLoading(true);
      const { status } = await POST(data);
      return Promise.resolve(status);
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e);
        return Promise.resolve(e);
      }
      return Promise.reject(e);
    } finally {
      setLoading(false);
    }
  }

  return {
    sendStart,
    sendData,
  };
}

type CommunicatorContextType = {
  sendStart: () => Promise<void>;
  sendData: () => Promise<void>;
};

const CommunicatorContext = createContext<CommunicatorContextType | undefined>(
  undefined
);

export function CommunicatorProvider({ children }: { children: ReactNode }) {
  const senders = useServerCommunication();

  return (
    <CommunicatorContext.Provider value={senders}>
      {children}
    </CommunicatorContext.Provider>
  );
}

export function useCommunicator() {
  const ctx = useContext(CommunicatorContext);
  if (!ctx) {
    throw new Error(
      "useCommunicator must be used inside <CommunicatorProvider>"
    );
  }
  return ctx;
}

async function POST(data: any) {
  console.log(data);
  const res = await fetch(import.meta.env.VITE_SERVER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

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

export function useCheckServerStatus() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: any;
    const poll = async () => {
      const ok = await checkHealth();
      setReady(ok);
      timer = setTimeout(poll, POLLING_TIME);
    };
    poll();
    return () => clearTimeout(timer);
  }, []);

  return ready;
}
