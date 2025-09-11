import { Word } from "../dictionary";
import { useStore } from "../utils/Store";
import { Controls } from "./components/Buttons";
import { Page } from "./components/Container";
import { LargeText, RotatedText } from "./components/Text";

import { ShaderCanvas } from "./components/ShaderCanvas";
import { useEngl } from "../utils/EnlgProvider";

export function Mood() {
  const { pipe } = useEngl();
  const { set, dynamics } = useStore();

  function update(nx: number, ny: number) {
    set("dynamics", [nx, ny] as [number, number]);
    // if (pipeRef.current && englRef.current) {
    pipe.update_params({ u_xy: [nx, ny] }, false);
    //   englRef.current.blit(pipeRef.current.pipe.get("out").tex);
    // }
  }

  return (
    <Page>
      <LargeText>
        <Word t="MOOD" />
      </LargeText>
      <div className="w-100 text-center">
        <Word t="MOOD_WORD_1" />
      </div>
      <div className="d-flex flex-row w-100 align-items-center">
        <RotatedText>
          <Word t="MOOD_WORD_2" />
        </RotatedText>
        <ShaderCanvas updateFn={update} value={dynamics} />
        <RotatedText cw>
          <Word t="MOOD_WORD_3" />
        </RotatedText>
      </div>
      <div className="w-100 text-center">
        <Word t="MOOD_WORD_4" />
      </div>
      <Controls />
    </Page>
  );
}
