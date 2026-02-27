export interface AnalysisResult {
  type: string;
  prediction: "Real" | "Fake" | "AI Generated" | "Deepfake";
  confidence: number;
  trust_score: number;
  ai_generated: boolean;
  deepfake: boolean;
  deepfake_detected: boolean;
  fake_news_detected: boolean;
  verified_sources: string[];
  corrected_title: string;
  corrected_description: string;
  corrected_source: string;
  comparison_summary: string;
  summary: string;
  reason: string;
  url_prediction?: string;
  database_saved: boolean;
}

const TRUSTED_SOURCES = ["BBC", "Reuters", "NDTV", "The Hindu", "Indian Express", "Times of India", "CNN", "Al Jazeera", "AP News", "The Guardian"];

const FAKE_NEWS_CORRECTIONS: Record<string, { title: string; description: string; source: string }> = {
  "shocking": {
    title: "Verified: No evidence supports this sensational claim",
    description: "Fact-checkers from multiple trusted news agencies have investigated similar claims and found no credible evidence. The original content appears to use sensational language designed to mislead readers.",
    source: "Reuters Fact Check"
  },
  "breaking": {
    title: "Verified: Official sources report different information",
    description: "According to verified reports from major news agencies, the actual events differ significantly from what was claimed. Multiple independent sources have confirmed the correct version of events.",
    source: "BBC News Verification"
  },
  "unbelievable": {
    title: "Verified: Claim debunked by scientific evidence",
    description: "Scientific consensus and peer-reviewed research contradict the claims made in this content. Leading experts have provided evidence-based rebuttals.",
    source: "AP News Fact Check"
  },
  "default": {
    title: "Verified: Content does not match trusted source reports",
    description: "Cross-referencing with major news databases reveals discrepancies. The verified version of this story has been confirmed by multiple independent journalists.",
    source: "Google News Verification"
  }
};

export function generateMockResult(type: string, content: string): AnalysisResult {
  const lower = content.toLowerCase();
  const isSuspicious = lower.includes("breaking") || lower.includes("shocking") || lower.includes("unbelievable") || lower.includes("fake") || content.length < 30;

  const predictions: AnalysisResult["prediction"][] = ["Real", "Fake", "AI Generated", "Deepfake"];
  const prediction = isSuspicious
    ? predictions[Math.floor(Math.random() * 3) + 1]
    : Math.random() > 0.3 ? "Real" : predictions[Math.floor(Math.random() * 4)];

  const isReal = prediction === "Real";
  const isFake = prediction === "Fake";
  const confidence = isReal ? 75 + Math.floor(Math.random() * 25) : 60 + Math.floor(Math.random() * 35);
  const trust_score = isReal ? 80 + Math.floor(Math.random() * 20) : 10 + Math.floor(Math.random() * 40);

  const sources = isReal
    ? TRUSTED_SOURCES.sort(() => 0.5 - Math.random()).slice(0, 2 + Math.floor(Math.random() * 3))
    : [];

  const correctionKey = lower.includes("shocking") ? "shocking" : lower.includes("breaking") ? "breaking" : lower.includes("unbelievable") ? "unbelievable" : "default";
  const correction = FAKE_NEWS_CORRECTIONS[correctionKey];

  return {
    type,
    prediction,
    confidence,
    trust_score,
    ai_generated: prediction === "AI Generated",
    deepfake: prediction === "Deepfake",
    deepfake_detected: prediction === "Deepfake",
    fake_news_detected: !isReal,
    verified_sources: sources,
    corrected_title: isReal ? "" : correction.title,
    corrected_description: isReal ? "" : correction.description,
    corrected_source: isReal ? "" : correction.source,
    comparison_summary: isReal ? "" : `Original content classified as "${prediction}" with ${confidence}% confidence. The corrected information has been verified by ${correction.source}.`,
    summary: isReal
      ? "Content verified against trusted news sources. No signs of manipulation detected."
      : `Content flagged as ${prediction.toLowerCase()}. Analysis detected inconsistencies with verified sources.`,
    reason: isReal
      ? "Content matches verified reports from multiple trusted sources. Cross-referenced with Google News and internal dataset."
      : prediction === "Deepfake"
        ? "EfficientNet model detected facial landmark inconsistencies. Temporal artifacts and GAN fingerprints found in frame transitions. Confidence exceeds detection threshold."
        : prediction === "AI Generated"
          ? "Statistical patterns consistent with large language model output. Perplexity analysis and token distribution indicate synthetic generation. GAN signature detected."
          : "No matching reports found in trusted news databases. Linguistic analysis shows manipulation markers. Content flagged by internal dataset comparison.",
    url_prediction: type === "url" ? (isReal ? "Real URL" : "Fake URL") : undefined,
    database_saved: true,
  };
}

export function generateUrlResult(url: string): AnalysisResult {
  const isTrusted = url.includes("bbc") || url.includes("reuters") || url.includes("cnn") || url.includes("ndtv") || url.includes("google") || url.includes("github");
  const isHttps = url.startsWith("https");
  const hasSpam = url.includes("free") || url.includes("win") || url.includes("click") || url.length > 100;

  const isReal = isTrusted && isHttps && !hasSpam;
  const trust_score = isReal ? 85 + Math.floor(Math.random() * 15) : 5 + Math.floor(Math.random() * 35);
  const confidence = isReal ? 80 + Math.floor(Math.random() * 20) : 65 + Math.floor(Math.random() * 30);

  return {
    type: "url",
    prediction: isReal ? "Real" : "Fake",
    confidence,
    trust_score,
    ai_generated: false,
    deepfake: false,
    deepfake_detected: false,
    fake_news_detected: !isReal,
    verified_sources: isReal ? ["Google Safe Browsing", "Web of Trust"] : [],
    corrected_title: isReal ? "" : "Warning: Suspicious URL detected",
    corrected_description: isReal ? "" : `The URL "${url}" shows indicators of being untrustworthy. ${!isHttps ? "Missing HTTPS security. " : ""}${hasSpam ? "Contains spam patterns. " : ""}${!isTrusted ? "Domain not recognized in trusted sources." : ""}`,
    corrected_source: isReal ? "" : "VeriScope URL Scanner",
    comparison_summary: isReal ? "" : "URL failed multiple trust verification checks.",
    summary: isReal ? "URL verified as trustworthy" : "URL flagged as potentially malicious or untrustworthy",
    reason: isReal
      ? `HTTPS: ✓ | Domain Trust: High | Google News: ${isTrusted ? "Present" : "Not found"} | Spam Patterns: None`
      : `HTTPS: ${isHttps ? "✓" : "✗"} | Domain Trust: Low | Google News: Not found | Spam Patterns: ${hasSpam ? "Detected" : "None"}`,
    url_prediction: isReal ? "Real URL" : "Fake URL",
    database_saved: true,
  };
}
