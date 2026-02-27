export interface AnalysisResult {
  type: string;
  prediction: "Real" | "Fake" | "AI Generated" | "Deepfake";
  confidence: number;
  trust_score: number;
  ai_generated: boolean;
  deepfake: boolean;
  verified_sources: string[];
  corrected_title: string;
  corrected_content: string;
  summary: string;
  reason: string;
}

export function generateMockResult(type: string, content: string): AnalysisResult {
  const isSuspicious = content.toLowerCase().includes("breaking") ||
    content.toLowerCase().includes("shocking") ||
    content.toLowerCase().includes("unbelievable") ||
    content.length < 30;

  const predictions: AnalysisResult["prediction"][] = ["Real", "Fake", "AI Generated", "Deepfake"];
  const prediction = isSuspicious
    ? predictions[Math.floor(Math.random() * 3) + 1]
    : Math.random() > 0.3 ? "Real" : predictions[Math.floor(Math.random() * 4)];

  const isReal = prediction === "Real";
  const confidence = isReal
    ? 75 + Math.floor(Math.random() * 25)
    : 60 + Math.floor(Math.random() * 35);

  const trust_score = isReal
    ? 80 + Math.floor(Math.random() * 20)
    : 10 + Math.floor(Math.random() * 40);

  const sources = isReal
    ? ["BBC", "Reuters", "NDTV", "The Hindu"].slice(0, 2 + Math.floor(Math.random() * 2))
    : [];

  return {
    type,
    prediction,
    confidence,
    trust_score,
    ai_generated: prediction === "AI Generated",
    deepfake: prediction === "Deepfake",
    verified_sources: sources,
    corrected_title: isReal ? "" : "Corrected: Verified information from trusted sources",
    corrected_content: isReal ? "" : "The original claim could not be verified by trusted news sources. The actual information differs from what was presented.",
    summary: isReal
      ? "Content verified against trusted news sources. No signs of manipulation detected."
      : `Content flagged as ${prediction.toLowerCase()}. Analysis detected inconsistencies with verified sources.`,
    reason: isReal
      ? "Content matches verified reports from multiple trusted sources."
      : prediction === "Deepfake"
        ? "Facial landmarks show inconsistencies. Temporal artifacts detected in frame transitions."
        : prediction === "AI Generated"
          ? "Statistical patterns consistent with large language model output. Perplexity analysis indicates synthetic generation."
          : "No matching reports found in trusted news databases. Linguistic analysis shows manipulation markers.",
  };
}
