import { create } from "zustand";
import { SEQUENCE, START_SCREEN } from "../constants";

type ServerData = {
  text: string;
  dynamics: number;
  style: [number, number];
};

type ScreenData = {
  currentScreen: number;
};

type ScreenSetter = {
  next: () => void;
  back: () => void;
};

type ServerDataSetter = {
  set: <K extends keyof ServerData>(step: K, value: ServerData[K]) => void;
};
type CanvasDataSetter = {
  setCanvas: <K extends keyof CanvasData>(key: K, value: CanvasData[K]) => void;
};

type LoaderData = {
  isLoading: boolean;
};
type LoaderDataSetter = {
  setLoading: (isLoading: boolean) => void;
};

type CanvasData = {
  size: { w: number; h: number };
  point: { x: number; y: number };
};

const INITIAL_STATE: ServerData & ScreenData & CanvasData = {
  text: "",
  dynamics: 0.5,
  style: [0.5, 0.5],
  currentScreen: START_SCREEN,
  // ... canvas
  point: { x: 0, y: 0 },
  size: { w: 560, h: 360 },
};

export const useStore = create<
  ServerData &
    ServerDataSetter &
    ScreenData &
    ScreenSetter &
    CanvasData &
    CanvasDataSetter
>((set) => ({
  set: <K extends keyof ServerData>(step: K, value: ServerData[K]) =>
    set(() => ({ [step]: value })),
  setCanvas: <K extends keyof CanvasData>(key: K, value: CanvasData[K]) =>
    set(() => ({ [key]: value })),
  next: () =>
    set((s) => ({
      currentScreen: Math.min(s.currentScreen + 1, SEQUENCE.length - 1),
    })),
  back: () => set(INITIAL_STATE),
  ...INITIAL_STATE,
}));

export const useLoader = create<LoaderData & LoaderDataSetter>((set) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set(() => ({ isLoading })),
}));
