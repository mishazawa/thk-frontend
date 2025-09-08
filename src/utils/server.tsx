import { createContext, useContext, type ReactNode } from "react";
import { useLoader, useStore } from "./Store";

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

async function checkServerReady(
  url: string,
  interval = 1000,
  maxAttempts = 30
): Promise<boolean> {
  return new Promise((resolve) => {
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(url, { method: "GET" });
        if (res.ok) {
          clearInterval(timer);
          resolve(true);
        }
      } catch (e) {
        // server not ready yet
      }
      if (attempts >= maxAttempts) {
        clearInterval(timer);
        resolve(false);
      }
    }, interval);
  });
}

// (async () => {
//   const ready = await checkServerReady(`${import.meta.env.VITE_SERVER}/health`);
//   if (ready) {
//     console.log("Server is ready, now send main request...");
//     const data = await POST({ some: "payload" });
//     console.log(data);
//   } else {
//     console.error("Server did not become ready in time");
//   }
// })();