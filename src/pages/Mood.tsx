import Slider from "@mui/material/Slider";
import { Word } from "../dictionary";
import { useStore } from "../utils/Store";
import { SendButton } from "./components/Buttons";
import { Page } from "./components/Container";
import { LargeText } from "./components/Text";
import Stack from "@mui/material/Stack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
export function Mood() {
  const { set, dynamics } = useStore();
  const theme = createTheme({
    palette: {
      primary: {
        light: "#ffffff",
        main: "#ffffff",
        dark: "#ffffff",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
  });
  return (
    <Page>
      <LargeText>
        <Word t="MOOD" />
      </LargeText>
      <div className="d-flex align-items-end w-100 mood_container">
        <div className="canvas_MOCK"></div>
        <div className="d-flex flex-grow-1 h-100 align-self-end">
          <ThemeProvider theme={theme}>
            <Stack spacing={1} direction="row">
              <Slider
                orientation="vertical"
                valueLabelDisplay="off"
                value={dynamics}
                step={0.01}
                min={0}
                max={1}
                onChange={(_, v) => set("dynamics", v)}
              />
            </Stack>
          </ThemeProvider>
        </div>
      </div>
      <br />
      <SendButton />
    </Page>
  );
}
