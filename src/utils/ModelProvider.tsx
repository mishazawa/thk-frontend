import { createContext, useContext, type ReactNode } from "react";

import { load, ToxicityClassifier } from "@tensorflow-models/toxicity";

const THRESHOLD = 0.9;
const LABELS = [
  "identity_attack",
  "insult",
  "obscene",
  "severe_toxicity",
  "sexual_explicit",
  "threat",
  "toxicity",
];

const Context = createContext<ToxicityClassifier>(null!);

export function useModel() {
  return useContext(Context);
}

function createModelResource() {
  let status = "pending";
  let result: any;
  let suspender = load(THRESHOLD, LABELS).then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (import.meta.env.VITE_SKIP_TF_MODEL)
        return { classify: (..._args: any) => [] };
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result;
    },
  };
}

const modelResource = createModelResource();

export function ModelProvider({ children }: { children: ReactNode }) {
  const model = modelResource.read(); // will suspend until ready

  return <Context.Provider value={model}>{children}</Context.Provider>;
}
