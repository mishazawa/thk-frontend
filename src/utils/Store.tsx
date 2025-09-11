import { create } from "zustand";
import { MESSAGE_SCREEN, SEQUENCE, START_SCREEN } from "../constants";

type ServerData = {
  text: string;
  dynamics: [number, number];
  style: [number, number];
};

type ScreenData = {
  currentScreen: number;
};

type ScreenSetter = {
  next: (value?: number) => void;
  back: (readManifest?: boolean) => void;
};

type ServerDataSetter = {
  set: <K extends keyof ServerData>(step: K, value: ServerData[K]) => void;
};

type LoaderData = {
  isLoading: boolean;
};
type LoaderDataSetter = {
  setLoading: (isLoading: boolean) => void;
};

const INITIAL_STATE: ServerData & ScreenData = {
  text: "",
  dynamics: [0.5, 0.5],
  style: [0.5, 0.5],
  currentScreen: START_SCREEN,
};

const MESSAGE_AGAIN_STATE = {
  currentScreen: SEQUENCE.indexOf(MESSAGE_SCREEN),
};

export const useStore = create<
  ServerData & ServerDataSetter & ScreenData & ScreenSetter
>((set) => ({
  set: <K extends keyof ServerData>(step: K, value: ServerData[K]) =>
    set(() => ({ [step]: value })),
  next: (value: number = 1) =>
    set((s) => ({
      currentScreen: Math.max(
        0,
        Math.min(s.currentScreen + value, SEQUENCE.length - 1)
      ),
    })),

  back: (readManifest = true) =>
    readManifest
      ? set(INITIAL_STATE)
      : set({ ...INITIAL_STATE, ...MESSAGE_AGAIN_STATE }),
  ...INITIAL_STATE,
}));

export const useLoader = create<LoaderData & LoaderDataSetter>((set) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set(() => ({ isLoading })),
}));
