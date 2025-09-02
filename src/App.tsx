import { Suspense } from "react";
import "./App.css";

import { Done } from "./pages/Done";
import { Message } from "./pages/Message";
import { Mood } from "./pages/Mood";
import { StartPage } from "./pages/Start";
import { VisualVibe } from "./pages/VisualVibe";
import { ModelProvider } from "./utils/ModelProvider";
import { Loading } from "./utils/Loading";
import { TextFilterProvider } from "./utils/TextFilterProvider";
import { CommunicatorProvider } from "./utils/server";
import { useStore } from "./utils/Store";

export const SEQUENCE = [
  "Start",
  "VisualVibe",
  "Message",
  "Mood",
  "Done",
] as const;

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <CommunicatorProvider>
          <ModelProvider>
            <TextFilterProvider>
              <SelectScreen />
            </TextFilterProvider>
          </ModelProvider>
        </CommunicatorProvider>
      </Suspense>
    </>
  );
}

function SelectScreen() {
  const { currentScreen } = useStore();
  const screenName = SEQUENCE[currentScreen];
  if (!screenName) return <>Err</>;
  switch (screenName) {
    case "Start":
      return <StartPage />;
    case "VisualVibe":
      return <VisualVibe />;
    case "Message":
      return <Message />;
    case "Mood":
      return <Mood />;
    case "Done":
      return <Done />;
  }
}

export default App;
