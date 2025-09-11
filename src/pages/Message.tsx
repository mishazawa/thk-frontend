import { useModel } from "../utils/ModelProvider";
import { isToxic } from "../utils/index";
import { useTextFilter } from "../utils/TextFilterProvider";
import { useLoader, useStore } from "../utils/Store";
import { Word } from "../dictionary";
import { CustomButton } from "./components/Buttons";
import { LargeText } from "./components/Text";
import { Page } from "./components/Container";

export function Message() {
  const model = useModel();
  const filter = useTextFilter();

  const { set, text, next } = useStore();
  const { setLoading } = useLoader();

  async function submit() {
    setLoading(true);
    try {
      const predictions = await model.classify(text);
      const isProfane = filter.isProfane(text);
      const isToxicPrediction = isToxic(predictions);
      if (!(isProfane || isToxicPrediction)) {
        return next();
      }
      alert("Profanity is banned");
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <LargeText>
        <Word t="MESSAGE" />
      </LargeText>
      <input
        className="input_rounded w-100"
        value={text}
        onChange={(e) => {
          set("text", e.target.value);
          window.TEMP_TEXT = e.target.value;
        }}
      ></input>
      <br />
      <CustomButton onClick={submit}>
        <Word t="DONE" />
      </CustomButton>
    </Page>
  );
}
