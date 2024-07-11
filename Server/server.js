const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API route that returns a URL and some text
app.get("/api/info", (req, res) => {
  // fetch other data
  res.json({
    url: "https://example.com",
    text: "This is some sample text.",
  });
});

app.get("/api/mocks/alphariddims", (req, res) => {
  fs.readFile("Mocks/alphariddims.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading data");
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.get("/word-to-rhythm/:word", async (req, res) => {
  const rhythm = await getRhythmForWord(req.params.word);
  res.json({ rhythm });
});

app.post("/rhythm-to-words", async (req, res) => {
  const words = await getWordsForRhythm(req.body.rhythm);
  res.json({ words });
});

// Serve static assets if in production (from React build)

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// Start server

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
