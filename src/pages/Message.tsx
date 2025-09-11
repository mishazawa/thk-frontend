import { useModel } from "../utils/ModelProvider";
import { isToxic } from "../utils/index";
import { useTextFilter } from "../utils/TextFilterProvider";
import { useLoader, useStore } from "../utils/Store";
import { Word } from "../dictionary";
import { Controls } from "./components/Buttons";
import { LargeText } from "./components/Text";
import { Page } from "./components/Container";
import { CustomKeyboard } from "./components/Keyboard";
import { MESSAGE_MAX_LENGTH } from "../constants";

export function Message() {
  const model = useModel();
  const filter = useTextFilter();

  const { text, next } = useStore();
  const { setLoading } = useLoader();

  async function validate() {
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
      <div className="input_rounded w-100 text-break text-center justify-content-center d-flex align-items-center">
        {text}
      </div>
      <Controls callback={validate} />
      <CustomKeyboard max={MESSAGE_MAX_LENGTH} />
    </Page>
  );
}
