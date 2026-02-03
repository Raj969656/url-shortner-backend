const express = require("express");
const {
  handleGenerateShortURL,
  handleRedirect,
  handleGetAnalytics,
  getUserUrls,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateShortURL);
router.get("/user/urls", getUserUrls);
router.get("/analytics/:shortId", handleGetAnalytics);
router.get("/:shortId", handleRedirect);

module.exports = router;
