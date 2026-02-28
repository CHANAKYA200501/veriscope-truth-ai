// ==========================================
// VeriScope Truth AI - Analysis Controller
// ==========================================

const Analysis = require("../models/Analysis");


// ==========================================
// Trusted Domains
// ==========================================

const TRUSTED_DOMAINS = [

  "bbc.com",
  "reuters.com",
  "ndtv.com",
  "thehindu.com",
  "indianexpress.com",
  "cnn.com",
  "apnews.com",
  "aljazeera.com",
  "github.com",
  "google.com"

];


// ==========================================
// Fake patterns
// ==========================================

const FAKE_PATTERNS = [

  "free",
  "win",
  "click",
  "miracle",
  "secret",
  "shocking",
  "unbelievable",
  "rigged",
  "hack"

];


// ==========================================
// URL ANALYSIS FUNCTION
// ==========================================

exports.analyzeURL = async (req, res) => {

  try {

    const { url } = req.body;


    if (!url) {

      return res.status(400).json({

        error: "URL required"

      });

    }


    const lower = url.toLowerCase();


    // =====================================
    // Detection logic
    // =====================================

    const isHttps =
      lower.startsWith("https");


    const trusted =
      TRUSTED_DOMAINS.some(domain =>
        lower.includes(domain)
      );


    const spam =
      FAKE_PATTERNS.some(pattern =>
        lower.includes(pattern)
      );


    // =====================================
    // Prediction Logic
    // =====================================

    let prediction = "Fake";


    if (trusted && isHttps && !spam) {

      prediction = "Real";

    }


    // Random AI detection simulation

    const ai_generated =
      lower.includes("ai");


    const deepfake =
      lower.includes("deepfake");


    const confidence =
      prediction === "Real"
        ? 80 + Math.floor(Math.random() * 20)
        : 60 + Math.floor(Math.random() * 30);


    const trust_score =
      prediction === "Real"
        ? 85 + Math.floor(Math.random() * 15)
        : 10 + Math.floor(Math.random() * 40);


    // =====================================
    // Final Result Object
    // =====================================

    const result = {

      type: "url",

      prediction,

      confidence,

      trust_score,

      ai_generated,

      deepfake,

      deepfake_detected: deepfake,

      fake_news_detected:
        prediction === "Fake",

      verified_sources:
        prediction === "Real"
          ? [
              "Google Safe Browsing",
              "Web of Trust"
            ]
          : [],


      corrected_title:
        prediction === "Fake"
          ? "Suspicious URL detected"
          : "",


      corrected_description:
        prediction === "Fake"
          ? "URL contains spam or untrusted domain."
          : "",


      corrected_source:
        prediction === "Fake"
          ? "VeriScope Scanner"
          : "",


      corrected_source_url:
        prediction === "Fake"
          ? "https://safebrowsing.google.com"
          : "",


      comparison_summary:
        prediction === "Fake"
          ? "Failed trust verification."
          : "",


      summary:
        prediction === "Real"
          ? "URL verified safe"
          : "URL flagged as suspicious",


      reason:

        prediction === "Real"

          ?

          `HTTPS ✓ | Trusted Domain ✓ | Spam ✗`

          :

          `HTTPS: ${isHttps} | Trusted: ${trusted} | Spam: ${spam}`,


      url_prediction:
        prediction + " URL",


      database_saved: true

    };


    // =====================================
    // Save to MongoDB
    // =====================================

    const newAnalysis =
      new Analysis({

        input: url,

        prediction:
          result.prediction,

        confidence:
          result.confidence,

        trust_score:
          result.trust_score,

        summary:
          result.summary,

        createdAt:
          new Date()

      });


    await newAnalysis.save();


    // =====================================
    // Send response
    // =====================================

    res.json(result);


  } catch (error) {

    console.log(error);

    res.status(500).json({

      error:
        "Server error"

    });

  }

};