import { Suspense } from "react";

import { Done } from "./pages/Done";
import { Message } from "./pages/Message";

import { StartPage } from "./pages/Start";
import { VisualVibe } from "./pages/Style";
import { ModelProvider } from "./utils/ModelProvider";
import { Loading, Loader } from "./pages/components/Loader";
import { TextFilterProvider } from "./utils/TextFilterProvider";
import { CommunicatorProvider } from "./utils/server";
import { useStore } from "./utils/Store";
import { SEQUENCE } from "./constants";
import { EnglProvider } from "./utils/EnlgProvider";
import { Mood } from "./pages/Mood";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <CommunicatorProvider>
        <ModelProvider>
          <TextFilterProvider>
            <EnglProvider>
              <SelectScreen />
            </EnglProvider>
          </TextFilterProvider>
        </ModelProvider>
      </CommunicatorProvider>

      <Loader />
    </Suspense>
  );
}

function SelectScreen() {
  const { currentScreen } = useStore();
  const screenName = SEQUENCE[currentScreen];
  if (!screenName) return <>Err</>;
  switch (screenName) {
    // case "Start":
    //   return <StartPage />;
    case "Style":
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
