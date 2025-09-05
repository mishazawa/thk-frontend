export const START = "Start";
export const QUESTION = "What do you love about nature the most?";
export const MESSAGE = "What do you want to contribute to this life?";
export const MOOD = "How do you feel?";
export const DONE = "Done";
export const SEND = "Send";
export const ANOTHER_MESSAGE = "Another message";
export const SEND_SUCCESS = "Your message has been sent";

const DICT = {
  START,
  QUESTION,
  DONE,
  MESSAGE,
  MOOD,
  SEND,
  ANOTHER_MESSAGE,
  SEND_SUCCESS,
} as const;

export function Word<K extends keyof typeof DICT>({ t }: { t: K }) {
  return <span>{DICT[t]}</span>;
}
