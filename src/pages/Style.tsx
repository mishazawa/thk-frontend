import { Word } from "../dictionary";
import { Controls } from "./components/Buttons";
import { LargeText, SpaceBetween } from "./components/Text";
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
      <>
        <SpaceBetween>
          <Word t="STYLE_WORD_1" />
          <Word t="STYLE_WORD_3" />
        </SpaceBetween>
        <ShaderCanvas updateFn={update} value={style} />
        <SpaceBetween>
          <Word t="STYLE_WORD_4" />
          <Word t="STYLE_WORD_2" />
        </SpaceBetween>
      </>
      <Controls />
    </Page>
  );
}
