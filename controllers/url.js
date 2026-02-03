const shortid = require("shortid");
const Url = require("../models/url");

async function handleGenerateShortURL(req, res) {
  const { url, customAlias } = req.body;
  const userId = req.headers["x-user-id"] || null;

  if (!url) return res.status(400).json({ error: "URL required" });

  const shortId = customAlias || shortid();

  await Url.create({
    shortId,
    redirectUrl: url,
    userId,
    visitHistory: [],
  });

  return res.json({ shortId });
}

async function handleRedirect(req, res) {
  const { shortId } = req.params;

  const entry = await Url.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );

  if (!entry) return res.status(404).send("Not found");

  res.redirect(entry.redirectUrl);
}

async function handleGetAnalytics(req, res) {
  const { shortId } = req.params;

  const url = await Url.findOne({ shortId });
  if (!url) return res.status(404).json({ error: "Not found" });

  res.json({
    totalClicks: url.visitHistory.length,
    history: url.visitHistory,
  });
}

async function getUserUrls(req, res) {
  const userId = req.headers["x-user-id"];
  if (!userId) return res.json([]);

  const urls = await Url.find({ userId }).sort({ createdAt: -1 });
  res.json(urls);
}

module.exports = {
  handleGenerateShortURL,
  handleRedirect,
  handleGetAnalytics,
  getUserUrls,
};
