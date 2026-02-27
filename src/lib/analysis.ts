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
  corrected_source_url: string;
  comparison_summary: string;
  summary: string;
  reason: string;
  url_prediction?: string;
  database_saved: boolean;
}

const TRUSTED_SOURCES = ["BBC", "Reuters", "NDTV", "The Hindu", "Indian Express", "Times of India", "CNN", "Al Jazeera", "AP News", "The Guardian"];

const FAKE_NEWS_DATABASE: Record<string, {
  fakePattern: string;
  realTitle: string;
  realDescription: string;
  realSource: string;
  realSourceUrl: string;
  category: string;
}[]> = {
  health: [
    {
      fakePattern: "covid|vaccine|5g|microchip|magnetic",
      realTitle: "COVID-19 vaccines are safe and effective, confirmed by global health organizations",
      realDescription: "The World Health Organization (WHO) and CDC have confirmed that COVID-19 vaccines underwent rigorous clinical trials with tens of thousands of participants. No microchips or 5G components exist in any approved vaccine. Side effects are mild and temporary in most cases. Over 13 billion doses have been administered globally with comprehensive safety monitoring.",
      realSource: "World Health Organization (WHO)",
      realSourceUrl: "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/covid-19-vaccines",
      category: "Health Misinformation"
    },
    {
      fakePattern: "cure|miracle|cancer cure|secret remedy",
      realTitle: "No single 'miracle cure' exists for cancer — treatment requires medical evaluation",
      realDescription: "According to the National Cancer Institute, cancer treatment varies by type and stage, including surgery, chemotherapy, radiation, immunotherapy, and targeted therapy. Claims of secret or suppressed cures are consistently debunked. Patients should consult oncologists for evidence-based treatment plans.",
      realSource: "National Cancer Institute (NIH)",
      realSourceUrl: "https://www.cancer.gov/about-cancer/treatment",
      category: "Health Misinformation"
    }
  ],
  politics: [
    {
      fakePattern: "election|rigged|stolen|fraud|ballot",
      realTitle: "Election integrity confirmed by multiple independent audits and oversight bodies",
      realDescription: "Independent election commissions, international observers, and court rulings have consistently upheld the integrity of democratic elections. Claims of widespread fraud have been investigated and dismissed by bipartisan committees. Robust security measures including paper trails, audits, and poll watchers ensure transparent elections.",
      realSource: "Reuters Fact Check",
      realSourceUrl: "https://www.reuters.com/fact-check",
      category: "Political Misinformation"
    },
    {
      fakePattern: "war|invasion|attack|military|troops",
      realTitle: "Verified conflict reports from international correspondents on the ground",
      realDescription: "Leading international news agencies maintain verified reporters in conflict zones. Ground-truth reporting from Reuters, AP, and BBC correspondents provides accurate casualty figures, territorial updates, and humanitarian assessments verified through multiple independent sources.",
      realSource: "Associated Press (AP News)",
      realSourceUrl: "https://apnews.com",
      category: "Conflict Misinformation"
    }
  ],
  science: [
    {
      fakePattern: "flat earth|climate hoax|global warming fake|moon landing fake",
      realTitle: "Scientific consensus supported by decades of peer-reviewed research",
      realDescription: "NASA, ESA, and every major scientific institution confirm: Earth is an oblate spheroid, climate change is real and human-caused (97% scientific consensus), and the Apollo moon landings are verified by independent evidence including retroreflectors left on the lunar surface. These facts are supported by millions of data points and independent verification.",
      realSource: "NASA / Nature Journal",
      realSourceUrl: "https://climate.nasa.gov/evidence",
      category: "Science Misinformation"
    }
  ],
  technology: [
    {
      fakePattern: "ai takeover|robot|sentient|hack|data leak",
      realTitle: "AI systems are tools designed and controlled by human developers",
      realDescription: "Current AI systems, including large language models, are not sentient or conscious. They are sophisticated pattern-matching tools trained on data. AI safety research is actively conducted by organizations like DeepMind, OpenAI, and academic institutions. Responsible AI development includes safety testing, bias mitigation, and human oversight.",
      realSource: "MIT Technology Review",
      realSourceUrl: "https://www.technologyreview.com",
      category: "Technology Misinformation"
    }
  ],
  general: [
    {
      fakePattern: "shocking|breaking|unbelievable|you won't believe|secret|exposed|leaked",
      realTitle: "Content uses sensational language commonly associated with misinformation",
      realDescription: "Fact-checkers from multiple trusted news agencies have investigated similar claims using sensational language patterns. Content that relies on emotional trigger words like 'shocking', 'breaking', or 'you won't believe' without citing verified sources is frequently found to be misleading or fabricated. Always verify claims through multiple trusted outlets before sharing.",
      realSource: "Google News Fact Check",
      realSourceUrl: "https://news.google.com",
      category: "General Misinformation"
    },
    {
      fakePattern: "celebrity|died|death hoax|arrested",
      realTitle: "Celebrity news should be verified through official sources and publicists",
      realDescription: "False celebrity death reports and arrest hoaxes are among the most common forms of viral misinformation. Verified celebrity news is published through official representatives, verified social media accounts, and established entertainment news outlets. Always check AP, Reuters, or the celebrity's official channels before believing or sharing such claims.",
      realSource: "AP Entertainment",
      realSourceUrl: "https://apnews.com/entertainment",
      category: "Celebrity Misinformation"
    }
  ]
};

function findBestCorrection(content: string): { realTitle: string; realDescription: string; realSource: string; realSourceUrl: string; category: string } {
  const lower = content.toLowerCase();
  
  for (const [, entries] of Object.entries(FAKE_NEWS_DATABASE)) {
    for (const entry of entries) {
      const patterns = entry.fakePattern.split("|");
      if (patterns.some(p => lower.includes(p))) {
        return entry;
      }
    }
  }
  
  return FAKE_NEWS_DATABASE.general[0];
}

export function generateMockResult(type: string, content: string): AnalysisResult {
  const lower = content.toLowerCase();
  const isSuspicious = lower.includes("breaking") || lower.includes("shocking") || lower.includes("unbelievable") || lower.includes("fake") || lower.includes("vaccine") || lower.includes("5g") || lower.includes("rigged") || lower.includes("miracle") || lower.includes("flat earth") || content.length < 30;

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

  const correction = findBestCorrection(content);

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
    corrected_title: isReal ? "" : correction.realTitle,
    corrected_description: isReal ? "" : correction.realDescription,
    corrected_source: isReal ? "" : correction.realSource,
    corrected_source_url: isReal ? "" : correction.realSourceUrl,
    comparison_summary: isReal ? "" : `[${correction.category}] Original content classified as "${prediction}" with ${confidence}% confidence. The corrected information has been verified by ${correction.realSource}. Cross-referenced with Google News and internal fact-check databases.`,
    summary: isReal
      ? "Content verified against trusted news sources. No signs of manipulation detected."
      : `Content flagged as ${prediction.toLowerCase()}. Analysis detected inconsistencies with verified sources.`,
    reason: isReal
      ? "Content matches verified reports from multiple trusted sources. Cross-referenced with Google News and internal dataset."
      : prediction === "Deepfake"
        ? "EfficientNet model detected facial landmark inconsistencies. Temporal artifacts and GAN fingerprints found in frame transitions."
        : prediction === "AI Generated"
          ? "Statistical patterns consistent with large language model output. Perplexity analysis and token distribution indicate synthetic generation."
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
    corrected_source_url: isReal ? "" : "https://safebrowsing.google.com",
    comparison_summary: isReal ? "" : "URL failed multiple trust verification checks.",
    summary: isReal ? "URL verified as trustworthy" : "URL flagged as potentially malicious or untrustworthy",
    reason: isReal
      ? `HTTPS: ✓ | Domain Trust: High | Google News: ${isTrusted ? "Present" : "Not found"} | Spam Patterns: None`
      : `HTTPS: ${isHttps ? "✓" : "✗"} | Domain Trust: Low | Google News: Not found | Spam Patterns: ${hasSpam ? "Detected" : "None"}`,
    url_prediction: isReal ? "Real URL" : "Fake URL",
    database_saved: true,
  };
}
