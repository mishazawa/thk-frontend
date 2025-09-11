import { useModel } from "../utils/ModelProvider";
import { isToxic } from "../utils/index";
import { useTextFilter } from "../utils/TextFilterProvider";
import { useStore } from "../utils/Store";
import { Word } from "../dictionary";
import { CustomButton } from "./components/Buttons";
import { LargeText } from "./components/Text";
import { Page } from "./components/Container";

export function Message() {
  const model = useModel();
  const filter = useTextFilter();

  const { set, text, next } = useStore();

  async function submit() {
    const predictions = await model.classify(text);
    const isProfane = filter.isProfane(text);
    const isToxicPrediction = isToxic(predictions);
    // const isToxicPrediction = true;
    if (!(isProfane || isToxicPrediction)) {
      return next();
    }
    alert("Profanity is banned");
  }

  return (
    <Page>
      <LargeText>
        <Word t="MESSAGE" />
      </LargeText>
      <input
        className="input_rounded w-100"
        value={text}
        onChange={(e) => set("text", e.target.value)}
      ></input>
      <br />
      <CustomButton onClick={submit}>
        <Word t="DONE" />
      </CustomButton>
    </Page>
  );
}
