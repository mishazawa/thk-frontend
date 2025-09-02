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

export const useStore = create<
  ServerData & ServerDataSetter & ScreenData & ScreenSetter
>((set) => ({
  text: "",
  dynamics: 0,
  style: [0.5, 0.5],
  set: <K extends keyof ServerData>(step: K, value: ServerData[K]) =>
    set(() => ({ [step]: value })),
  //
  //
  // ............
  //
  //
  currentScreen: START_SCREEN,
  next: () =>
    set((s) => ({
      currentScreen: Math.min(s.currentScreen + 1, SEQUENCE.length - 1),
    })),
  back: () => set({ currentScreen: 0 }),
}));
