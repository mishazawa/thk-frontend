import { Suspense, useState } from "react";
import "./App.css";

import { Done } from "./pages/Done";
import { Message } from "./pages/Message";
import { Mood } from "./pages/Mood";
import { StartPage } from "./pages/Start";
import { VisualVibe } from "./pages/VisualVibe";
import { ModelProvider } from "./utils/ModelProvider";
import { Loading } from "./utils/Loading";
import { TextFilterProvider } from "./utils/TextFilterProvider";

export type ProceedProps = {
  callback: () => void;
};

const SEQUENCE = ["Start", "VisualVibe", "Message", "Mood", "Done"] as const;

function App() {
  const [currentScreen, setScreen] = useState(2);

  function nextScreen() {
    setScreen(Math.min(currentScreen + 1, SEQUENCE.length - 1));
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <ModelProvider>
          <TextFilterProvider>
            <SelectScreen index={currentScreen} callback={nextScreen} />
          </TextFilterProvider>
        </ModelProvider>
      </Suspense>
    </>
  );
}

function SelectScreen({
  index,
  ...props
}: {
  index: number;
} & ProceedProps) {
  const screenName = SEQUENCE[index];
  if (!screenName) return <>Err</>;
  switch (screenName) {
    case "Start":
      return <StartPage {...props} />;
    case "VisualVibe":
      return <VisualVibe {...props} />;
    case "Message":
      return <Message {...props} />;
    case "Mood":
      return <Mood {...props} />;
    case "Done":
      return <Done />;
  }
}

export default App;
