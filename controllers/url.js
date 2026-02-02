const shortid = require("shortid");
const Url = require("../models/url");

/* ================= CREATE SHORT URL ================= */
async function handleGenerateShortURL(req, res) {
  try {
    const { url, customAlias, expiresAt } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // 🔐 userId optional
    const userId =
      typeof req.headers["x-user-id"] === "string"
        ? req.headers["x-user-id"]
        : null;

    // Check alias only if provided
    if (customAlias && customAlias.trim() !== "") {
      const exists = await Url.findOne({ customAlias: customAlias.trim() });
      if (exists) {
        return res
          .status(409)
          .json({ error: "Custom alias already taken" });
      }
    }

    // 🔥 IMPORTANT: build object dynamically
    const data = {
      shortId: shortid(),
      redirectURL: url,
      userId,
      expiresAt: expiresAt || null,
      isActive: true,
      visitHistory: [],
    };

    // Add customAlias ONLY if user entered it
    if (customAlias && customAlias.trim() !== "") {
      data.customAlias = customAlias.trim();
    }

    const newUrl = await Url.create(data);

    return res.status(201).json({
      shortId: newUrl.customAlias || newUrl.shortId,
    });
  } catch (err) {
    console.error("CREATE URL ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/* ================= REDIRECT ================= */
async function handleRedirect(req, res) {
  try {
    const { shortId } = req.params;

    const entry = await Url.findOne({
      $or: [{ shortId }, { customAlias: shortId }],
    });

    if (!entry) return res.status(404).send("Short URL not found");
    if (!entry.isActive) return res.status(410).send("Link disabled");
    if (entry.expiresAt && entry.expiresAt < Date.now())
      return res.status(410).send("Link expired");

    entry.visitHistory.push({ timestamp: Date.now() });
    await entry.save();

    return res.redirect(entry.redirectURL);
  } catch (err) {
    console.error("REDIRECT ERROR:", err);
    return res.status(500).send("Server Error");
  }
}

/* ================= DASHBOARD ================= */
async function handleGetUserUrls(req, res) {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.json({ urls: [] });

    const urls = await Url.find({ userId }).sort({ createdAt: -1 });
    return res.json({ urls });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return res.status(500).json({ error: "Server Error" });
  }
}

/* ================= TOGGLE ================= */
async function handleToggleActive(req, res) {
  try {
    const { id } = req.params;

    const url = await Url.findById(id);
    if (!url) return res.status(404).json({ error: "Not found" });

    url.isActive = !url.isActive;
    await url.save();

    return res.json({ isActive: url.isActive });
  } catch (err) {
    console.error("TOGGLE ERROR:", err);
    return res.status(500).json({ error: "Server Error" });
  }
}

module.exports = {
  handleGenerateShortURL,
  handleRedirect,
  handleGetUserUrls,
  handleToggleActive,
};
