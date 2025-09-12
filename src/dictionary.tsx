export const START = "Start";
export const QUESTION = "Which part of nature draws you most?";
export const MESSAGE_START = "THK Tower Interactive";
export const MESSAGE1 = "About THK Tower";
export const MESSAGE = "What do you want to contribute to this life?";
export const MOOD = "How do you feel right now?";
export const DONE = "Done";
export const YES = "Yes";
export const NO = "No";
export const SEND = "Send";
export const ANOTHER_MESSAGE = "Another message";
export const SEND_SUCCESS = "Your message is being displayed";
export const WAITING_FOR_SERVER = "After it appears on the THK Tower it will be included in the tapestry of thoughts from different people";
export const BACK = "Back";
export const NEXT = "Next";
export const LETSGO = "Yes! I'm ready!";
export const STYLE_WORD_1 = "Forest";
export const STYLE_WORD_2 = "Dune";
export const STYLE_WORD_3 = "Ocean";
export const STYLE_WORD_4 = "Bloom";
export const MOOD_WORD_1 = "Intense";
export const MOOD_WORD_2 = "Calm";
export const MOOD_WORD_3 = "Active";
export const MOOD_WORD_4 = "Focused";
export const SERVER_BUSY = "Currently showing message...";
export const MANIFEST = `In this fast-paced world, we witness imbalance — nature strained, greed rising, lives unsettled, harmony fading. Yet within us remains a spark of hope, a quiet will to restore balance.
From once a symbol of harmony through light and reflection, The THK Tower now evolves — an interactive bridge between human and universe. Here, your thoughts and intentions are not small. They merge into a collective message.
This moment reminds us: change begins within. By sharing what is true, by carrying value in each step, we bring balance once more.

Are you ready to step in?`;

export const QUESTION_1 ="What keeps your hope alive?";
export const QUESTION_2 = "What does your heart tell you now?";
export const QUESTION_3 = "What do you feel about this world? ";
export const QUESTION_4 = "What do you want to tell to someone you care?";
export const QUESTION_5 = "What are you grateful for?";

export const PROFANITY_DETECTED = "Profanity is banned.";
const DICT = {
  START,
  QUESTION,
  DONE,
  MESSAGE1,
  MESSAGE_START,
  MESSAGE,
  MOOD,
  SEND,
  ANOTHER_MESSAGE,
  SEND_SUCCESS,
  WAITING_FOR_SERVER,
  BACK,
  NEXT,
  LETSGO,
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
  SERVER_BUSY,
  PROFANITY_DETECTED,
  QUESTION_1,
  QUESTION_2,
  QUESTION_3,
  QUESTION_4,
  QUESTION_5,
  // Add more keys as needed for other
} as const;

export function Word<K extends keyof typeof DICT>({ t }: { t: K }) {
  return <span className="pre-line">{DICT[t]}</span>;
}
