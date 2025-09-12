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
import { useState } from "react";



export function Message() {
  const model = useModel();
  const filter = useTextFilter();

  const { text, next } = useStore();
  const { setLoading } = useLoader();
  const [isValid, setValid] = useState(true);

  async function validate() {
    setLoading(true);

    try {
      const predictions = await model.classify(text);
      const isProfane = filter.isProfane(text);
      const isToxicPrediction = isToxic(predictions);

      const isValid = !(isProfane || isToxicPrediction);
      setValid(isValid);
      if (isValid) {
        return next();
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  }

  const QUESTION_KEYS = [
    "QUESTION_1",
    "QUESTION_2",
    "QUESTION_3",
    "QUESTION_4",
    "QUESTION_5",
  ] as const;

  type QuestionKey = typeof QUESTION_KEYS[number];

  const [randomQuestionKey] = useState<QuestionKey>(
    () => QUESTION_KEYS[Math.floor(Math.random() * QUESTION_KEYS.length)]
  );

  return (
    <Page>
      <LargeText>
        <Word t={randomQuestionKey} />
      </LargeText>
      <div className="input_rounded w-100 text-break text-center justify-content-center d-flex align-items-center">
        {text}
      </div>
      <div
        className={isValid ? "visually-hidden" : "text-danger flex-shrink-1"}
      >
        <Word t="PROFANITY_DETECTED" />
      </div>
      <Controls callback={validate} />
      <CustomKeyboard max={MESSAGE_MAX_LENGTH} />
    </Page>
  );
}
