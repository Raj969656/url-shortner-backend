const express = require("express");
const {
  handleGenerateShortURL,
  handleRedirect,
  handleGetUserUrls,
  handleToggleActive,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateShortURL);
router.get("/user/urls", handleGetUserUrls);
router.patch("/:id/toggle", handleToggleActive);
router.get("/:shortId", handleRedirect);

module.exports = router;
