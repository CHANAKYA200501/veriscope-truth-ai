const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema({

  input: String,

  prediction: String,

  confidence: Number,

  trust_score: Number,

  summary: String,

  createdAt: Date

});

module.exports =
  mongoose.model(
    "Analysis",
    AnalysisSchema
  );