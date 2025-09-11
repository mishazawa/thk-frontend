export const START = "Start";
export const QUESTION = "What do you love about nature the most?";
export const MESSAGE = "What do you want to contribute to this life?";
export const MOOD = "How do you feel?";
export const DONE = "Done";
export const SEND = "Send";
export const ANOTHER_MESSAGE = "Another message";
export const SEND_SUCCESS = "Your message has been displayed";
export const WAITING_FOR_SERVER = "Message is being displayed";
export const BACK = "Back";
export const NEXT = "Next";
export const STYLE_WORD_1 = "Forest";
export const STYLE_WORD_2 = "Dune";
export const STYLE_WORD_3 = "Ocean";
export const STYLE_WORD_4 = "Bloom";
export const MOOD_WORD_1 = "Exited";
export const MOOD_WORD_2 = "Calm";
export const MOOD_WORD_3 = "Active";
export const MOOD_WORD_4 = "Focused";

export const MANIFEST =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const DICT = {
  START,
  QUESTION,
  DONE,
  MESSAGE,
  MOOD,
  SEND,
  ANOTHER_MESSAGE,
  SEND_SUCCESS,
  WAITING_FOR_SERVER,
  BACK,
  NEXT,
  MANIFEST,
  STYLE_WORD_1,
  STYLE_WORD_2,
  STYLE_WORD_3,
  STYLE_WORD_4,
  MOOD_WORD_1,
  MOOD_WORD_2,
  MOOD_WORD_3,
  MOOD_WORD_4,
} as const;

export function Word<K extends keyof typeof DICT>({ t }: { t: K }) {
  return <span>{DICT[t]}</span>;
}
