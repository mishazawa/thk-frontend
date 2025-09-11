import KKK from "react-simple-keyboard";

import "react-simple-keyboard/build/css/index.css";
import { useStore } from "../../utils/Store";
import { KEYBOARD_LAYOUT } from "../../constants";

export function CustomKeyboard() {
  const { set } = useStore();

  function onChange(value: string) {
    set("text", value);
    window.TEMP_TEXT = value;
  }

  return (
    <KKK
      onChange={onChange}
      theme={"hg-theme-default hg-layout-default myTheme"}
      layout={{ default: KEYBOARD_LAYOUT }}
      autoUseTouchEvents
    />
  );
}
