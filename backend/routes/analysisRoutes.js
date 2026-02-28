const express = require("express");

const router = express.Router();

const {

  analyzeURL

} = require("../controllers/analysisController");


router.post(
  "/url",
  analyzeURL
);

module.exports =
  router;