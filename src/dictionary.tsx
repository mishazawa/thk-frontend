export const START = "Start";
export const QUESTION = "What do you love about nature the most?";
export const MESSAGE = "What do you want to contribute to this life?";
export const MOOD = "How do you feel?";
export const DONE = "Done";
export const YES = "Yes";
export const NO = "No";
export const SEND = "Send";
export const ANOTHER_MESSAGE = "Another message";
export const SEND_SUCCESS = "Your message has been displayed";
export const WAITING_FOR_SERVER = "Waiting...";
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
  "In this fast-paced world, we witness imbalance — nature strained, greed rising, lives unsettled, harmony fading. Yet within us remains a spark of hope, a quiet will to restore balance. From once a symbol of harmony through light and reflection, The THK Tower now evolves — an interactive bridge between human and universe. Here, your thoughts and intentions are not small. They merge into a collective message. This moment reminds us: change begins within. By sharing what is true, by carrying value in each step, we bring balance once more.  Are you ready to step in?";
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
  YES,
  NO,
} as const;

export function Word<K extends keyof typeof DICT>({ t }: { t: K }) {
  return <span>{DICT[t]}</span>;
}
