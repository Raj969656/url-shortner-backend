const express = require("express");
const cors = require("cors");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");

const app = express();
const PORT = 8001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("Connected to MongoDB"));

app.use("/url", urlRoute);

app.listen(PORT, () =>
  console.log("Server Started at PORT", PORT)
);
