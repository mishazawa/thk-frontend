import { Word } from "../dictionary";
import { Controls } from "./components/Buttons";
import { LargeText, RotatedText, SpaceBetween } from "./components/Text";
import { Page } from "./components/Container";
import { ShaderCanvas } from "./components/ShaderCanvas";
import { useEngl } from "../utils/EnlgProvider";
import { useStore } from "../utils/Store";

export function VisualVibe() {
  const { pipe } = useEngl();
  const { set, style } = useStore();

  function update(nx: number, ny: number) {
    set("style", [nx, ny] as [number, number]);
    // if (pipeRef.current && englRef.current) {
    pipe.update_params({ u_xy: [nx, ny] }, false);
    //   englRef.current.blit(pipeRef.current.pipe.get("out").tex);
    // }
  }
  return (
    <Page>
      <LargeText>
        <Word t="QUESTION" />
      </LargeText>

      <div className="w-100 text-center">
        <SpaceBetween>
          <Word t="STYLE_WORD_1" />
          <Word t="STYLE_WORD_3" />
        </SpaceBetween>
      </div>
      <div className="d-flex flex-row w-100 align-items-center">
        <RotatedText invisible>
          <Word t="MOOD_WORD_2" />
        </RotatedText>
        <ShaderCanvas updateFn={update} value={style} />
        <RotatedText cw invisible>
          <Word t="MOOD_WORD_3" />
        </RotatedText>
      </div>
      <div className="w-100 text-center">
        <SpaceBetween>
          <Word t="STYLE_WORD_4" />
          <Word t="STYLE_WORD_2" />
        </SpaceBetween>
      </div>

      <Controls />
    </Page>
  );
}
