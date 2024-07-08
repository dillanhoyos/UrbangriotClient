const fs = require("fs");
const crypto = require("crypto");
const {
  loadModel,
  getWordEmbedding,
  getAllWords,
} = require("../wordEmbeddings");

const SILENCE = 0,
  TONE = 1,
  SLAP = 2,
  BASS = 3;

function generateUniqueRhythm(word) {
  const hash = crypto.createHash("md5").update(word).digest("hex");
  const rhythm = [];
  for (let i = 0; i < 16; i++) {
    const value = parseInt(hash.substr(i * 2, 2), 16);
    rhythm.push(value % 4);
  }
  return rhythm;
}

function rhythmToPattern(rhythm) {
  return rhythm.map((beat) => ["S", "T", "P", "B"][beat]).join("");
}

async function processEntireDataset() {
  console.log("Loading word embeddings...");
  await loadModel();
  console.log("Word embeddings loaded.");

  const allWords = getAllWords();
  console.log(`Processing ${allWords.length} words...`);

  const wordRhythmMap = {};
  const rhythmWordMap = {};

  allWords.forEach((word, index) => {
    const rhythm = generateUniqueRhythm(word);
    const rhythmPattern = rhythmToPattern(rhythm);

    wordRhythmMap[word] = rhythmPattern;

    if (!rhythmWordMap[rhythmPattern]) {
      rhythmWordMap[rhythmPattern] = [];
    }
    rhythmWordMap[rhythmPattern].push(word);

    if (index % 10000 === 0) {
      console.log(`Processed ${index} words...`);
    }
  });

  console.log("Writing word-to-rhythm map to file...");
  fs.writeFileSync(
    "word_rhythm_map.json",
    JSON.stringify(wordRhythmMap, null, 2)
  );

  console.log("Writing rhythm-to-word map to file...");
  fs.writeFileSync(
    "rhythm_word_map.json",
    JSON.stringify(rhythmWordMap, null, 2)
  );

  console.log("Processing complete.");

  // Some statistics
  console.log(`Total unique words: ${Object.keys(wordRhythmMap).length}`);
  console.log(`Total unique rhythms: ${Object.keys(rhythmWordMap).length}`);

  // Sample output
  const sampleWords = ["the", "of", "and", "in", "to"];
  console.log("\nSample word-to-rhythm mappings:");
  sampleWords.forEach((word) => {
    console.log(`${word}: ${wordRhythmMap[word]}`);
  });

  console.log("\nSample rhythm-to-word mappings:");
  Object.entries(rhythmWordMap)
    .slice(0, 5)
    .forEach(([rhythm, words]) => {
      console.log(
        `${rhythm}: ${words.slice(0, 5).join(", ")}${
          words.length > 5 ? "..." : ""
        }`
      );
    });
}

processEntireDataset().catch((error) =>
  console.error("An error occurred:", error)
);
