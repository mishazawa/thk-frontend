import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLoader, useStore } from "./Store";
import { MESSAGE_WRITE_PATH } from "../constants";
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
};

const app = initializeApp(firebaseConfig);

if (import.meta.env.DEV) {
  //@ts-ignore
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_CAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
});

const db = getFirestore(app);

export function useServerCommunication() {
  const { text, dynamics, style } = useStore();
  const { setLoading } = useLoader();

  async function sendStart() {
    return Promise.resolve(); // ok.
  }

  async function sendData() {
    try {
      setLoading(true);
      const currentRef = doc(db, ...MESSAGE_WRITE_PATH);
      const data = {
        text,
        style,
        dynamics: remapDynamics(dynamics),
      };

      await setDoc(currentRef, data);
      console.log("Data sent:", data);
      return Promise.resolve();
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
  sendData: () => Promise<any>;
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

export function useCheckServerStatus() {
  const [ready, setReady] = useState(false);

  // Subscribe to /v1/status
  useEffect(() => {
    const docRef = doc(db, "v1", "status");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setReady(docSnap.data().ready);
      } else {
        setReady(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return ready;
}

function remapDynamics(a: [number, number]) {
  return [a[0], 1.0 - a[1]];
}
