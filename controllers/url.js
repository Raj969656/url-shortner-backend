const shortid = require("shortid");
const Url = require("../models/url");

async function handleGenerateShortURL(req, res) {
  try {
    const { url, customAlias } = req.body;
    const userId = req.headers["x-user-id"] || null;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const shortId = customAlias || shortid.generate();

    const exists = await Url.findOne({ shortId });
    if (exists) {
      return res.status(409).json({ error: "Alias already exists" });
    }

    await Url.create({
      shortId,
      redirectUrl: url,
      userId,
      visitHistory: [],
    });

    return res.status(201).json({ shortId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function handleRedirect(req, res) {
  const { shortId } = req.params;

  const entry = await Url.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  return res.redirect(entry.redirectUrl);
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
  getUserUrls,
};
