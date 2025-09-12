export const START_SCREEN = 0;
export const MESSAGE_SCREEN = "Message";
export const SEQUENCE = [
  "Start",
  "Manifest",
  MESSAGE_SCREEN,
  "Style",
  "Mood",
  "SendStatus",
  "Done",
] as const;

export const CIRCLE_RADIUS = 40;
export const POLLING_TIME = 5000;
export const KEYBOARD_LAYOUT = [
  // "1 2 3 4 5 6 7 8 9 0",
  "Q W E R T Y U I O P",
  "A S D F G H J K L",
  "Z X C V B N M {bksp}",
  "{space}",
];

export const MESSAGE_MAX_LENGTH = 27;
