const express = require("express");
const {
  handleGenerateShortURL,
  handleRedirect,
  getUserUrls,
} = require("../controllers/url");

const router = express.Router();

// create short url
router.post("/", handleGenerateShortURL);

// get user urls (dashboard)
router.get("/user/urls", getUserUrls);

// redirect short url
router.get("/:shortId", handleRedirect);

module.exports = router;
