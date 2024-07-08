const fs = require("fs");
const readline = require("readline");
const path = require("path");

const SILENCE = 0,
  TONE = 1,
  SLAP = 2,
  BASS = 3;

// Load CMU Dictionary
async function loadCMUDict() {
  const cmuDict = {};
  const fileStream = fs.createReadStream(path.join(__dirname, "cmudict-0.7b"));
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (line.startsWith(";;;")) continue; // Skip comments
    const [word, ...pronunciation] = line.split("  ");
    cmuDict[word.toLowerCase()] = pronunciation[0];
  }

  console.log(
    `Loaded ${Object.keys(cmuDict).length} words from CMU Dictionary`
  );
  return cmuDict;
}

// Generate rhythm based on pronunciation
function generateRhythm(pronunciation) {
  const rhythm = [];
  const syllables = pronunciation.split(" ");
  for (let syllable of syllables) {
    if (syllable.endsWith("1")) {
      rhythm.push(BASS); // Stressed syllable
    } else if (syllable.endsWith("2")) {
      rhythm.push(SLAP); // Secondary stress
    } else if (syllable.endsWith("0")){
      rhythm.push(TONE); // Unstressed syllable
    }
  }
  // Pad with SILENCE to get to 16 beats
  while (rhythm.length < 16) {
    rhythm.push(SILENCE);
  }
  // If more than 16 beats, truncate
  return rhythm.slice(0, 16);
}

function rhythmToPattern(rhythm) {
  return rhythm.map((beat) => ["S", "T", "P", "B"][beat]).join("");
}

async function processDataset() {
  const cmuDict = await loadCMUDict();
  const {
    getWordEmbedding,
    getAllWords,
    loadModel,
  } = require("../wordEmbeddings");

  console.log("Loading word embeddings...");
  await loadModel(); // Assuming this function exists in wordEmbeddings.js
  console.log("Word embeddings loaded.");

  const allWords = getAllWords();
  console.log(`Processing ${allWords.length} words...`);

  const wordDataStream = fs.createWriteStream("prosodic_word_data.jsonl");
  const rhythmWordStream = fs.createWriteStream(
    "prosodic_rhythm_word_map.jsonl"
  );

  let uniqueRhythms = new Set();
  let processedWords = 0;

  for (const word of allWords) {
    const embedding = getWordEmbedding(word);
    const pronunciation = cmuDict[word.toLowerCase()];
    if (embedding && pronunciation) {
      const rhythm = generateRhythm(pronunciation);
      const rhythmPattern = rhythmToPattern(rhythm);

      // Write word data
      wordDataStream.write(
        JSON.stringify({
          word: word,
          rhythm: rhythmPattern,
          embedding: embedding,
          pronunciation: pronunciation,
        }) + "\n"
      );

      // Write rhythm-word mapping
      rhythmWordStream.write(
        JSON.stringify({
          rhythm: rhythmPattern,
          word: word,
        }) + "\n"
      );

      uniqueRhythms.add(rhythmPattern);

      processedWords++;
      if (processedWords % 10000 === 0) {
        console.log(`Processed ${processedWords} words...`);
      }
    } else {
      console.log(`No data found for word: "${word}"`);
    }
  }

  wordDataStream.end();
  rhythmWordStream.end();

  console.log("Processing complete.");
  console.log(`Total processed words: ${processedWords}`);
  console.log(`Total unique rhythms: ${uniqueRhythms.size}`);

  // Sample output
  const sampleWords = [
    "rhythm",
    "algorithm",
    "syncopation",
    "melody",
    "harmony",
  ];
  console.log("\nSample word data:");
  for (const word of sampleWords) {
    const embedding = getWordEmbedding(word);
    const pronunciation = cmuDict[word.toLowerCase()];
    if (embedding && pronunciation) {
      const rhythm = rhythmToPattern(generateRhythm(pronunciation));
      console.log(`${word}:`);
      console.log(`  Pronunciation: ${pronunciation}`);
      console.log(`  Rhythm: ${rhythm}`);
      console.log(`  Embedding: [${embedding.slice(0, 5).join(", ")}...]`);
    } else {
      console.log(`${word}: No data available`);
    }
  }
}

processDataset().catch((error) => console.error("An error occurred:", error));
