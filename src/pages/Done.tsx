import { Word } from "../dictionary";
import { BackButton } from "./Buttons";

export function Done() {
  return (
    <>
      <p>
        <Word t="SEND_SUCCESS" />
      </p>
      <BackButton />
    </>
  );
}
