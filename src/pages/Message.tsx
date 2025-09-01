import type { ProceedProps } from "../App";

import { useState } from "react";
import { useModel } from "../utils/ModelProvider";
import { isToxic } from "../utils";
import { useTextFilter } from "../utils/TextFilterProvider";

export function Message({ callback }: ProceedProps) {
  const [prompt, setPrompt] = useState("");

  const model = useModel();
  const filter = useTextFilter();

  async function submit() {
    const predictions = await model.classify(prompt);
    const isProfane = filter.isProfane(prompt);
    const isToxicPrediction = isToxic(predictions);
    if (!(isProfane || isToxicPrediction)) {
      return callback();
    }
    alert("Profanity is banned");
  }

  return (
    <>
      <p>What do you want to contribute to this life?</p>
      <input value={prompt} onChange={(e) => setPrompt(e.target.value)}></input>
      <br />
      <button onClick={submit}>Done</button>
    </>
  );
}
