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

    // 🔴 duplicate alias check
    const exists = await Url.findOne({ shortId });
    if (exists) {
      return res.status(409).json({ error: "Alias already exists" });
    }

    const newUrl = await Url.create({
      shortId,
      redirectUrl: url,
      userId,
      visitHistory: [],
    });

    return res.status(201).json({ shortId: newUrl.shortId });
  } catch (err) {
    console.error("CREATE URL ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}

async function handleRedirect(req, res) {
  try {
    const { shortId } = req.params;

    const entry = await Url.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    // ✅ YAHI REAL REDIRECT HOGA
    return res.redirect(entry.redirectUrl);
  } catch (err) {
    console.error("REDIRECT ERROR:", err);
    res.status(500).send("Redirect failed");
  }
}

async function getUserUrls(req, res) {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.json([]);

    const urls = await Url.find({ userId }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
}
module.exports = {
  handleGenerateShortURL,
  handleRedirect,
  getUserUrls,
};

