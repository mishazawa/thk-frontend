import type { ToxicityClassifier } from "@tensorflow-models/toxicity";

type ClassificationResult = Awaited<
  ReturnType<ToxicityClassifier["classify"]>
>[number];

export function isToxic(predictions: ClassificationResult[]) {
  return predictions.some((p) => p.results.some((r) => r.match));
}
