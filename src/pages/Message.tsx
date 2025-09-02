import { useModel } from "../utils/ModelProvider";
import { isToxic } from "../utils";
import { useTextFilter } from "../utils/TextFilterProvider";
import { useStore } from "../utils/Store";

export function Message() {
  const model = useModel();
  const filter = useTextFilter();

  const { set, text, next } = useStore();

  async function submit() {
    const predictions = await model.classify(text);
    const isProfane = filter.isProfane(text);
    const isToxicPrediction = isToxic(predictions);
    if (!(isProfane || isToxicPrediction)) {
      return next();
    }
    alert("Profanity is banned");
  }

  return (
    <>
      <p>What do you want to contribute to this life?</p>
      <input value={text} onChange={(e) => set("text", e.target.value)}></input>
      <br />
      <button onClick={submit}>Done</button>
    </>
  );
}
