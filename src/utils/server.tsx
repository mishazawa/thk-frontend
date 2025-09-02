import { createContext, useContext, type ReactNode } from "react";
import { useStore } from "./Store";

export function useServerCommunication() {
  const { set: _, ...data } = useStore();

  async function sendStart() {
    return Promise.resolve();
  }

  async function sendData() {
    try {
      const { status } = await POST(data);
      return Promise.resolve(status);
    } catch (e) {
      return Promise.reject(e);
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
  console.log(import.meta.env.VITE_SERVER);
  const res = await fetch(import.meta.env.VITE_SERVER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}
