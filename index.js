const express = require("express");
const cors = require("cors");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

connectToMongoDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

app.use("/url", urlRoute);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log("Server Started at PORT", PORT);
});
