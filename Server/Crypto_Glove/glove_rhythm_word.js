const fs = require('fs');
const crypto = require('crypto');
const { loadModel, getWordEmbedding, getAllWords } = require("../wordEmbeddings");

const SILENCE = 0, TONE = 1, SLAP = 2, BASS = 3;

function generateUniqueRhythm(word) {
  const hash = crypto.createHash('md5').update(word).digest('hex');
  const rhythm = [];
  for (let i = 0; i < 16; i++) {
    const value = parseInt(hash.substr(i * 2, 2), 16);
    rhythm.push(value % 4);
  }
  return rhythm;
}

function rhythmToPattern(rhythm) {
  return rhythm.map(beat => ['S', 'T', 'P', 'B'][beat]).join('');
}

async function processEntireDataset() {
  console.log("Loading word embeddings...");
  await loadModel();
  console.log("Word embeddings loaded.");

  const allWords = getAllWords();
  console.log(`Processing ${allWords.length} words...`);

  const wordDataStream = fs.createWriteStream('word_data.jsonl');
  const rhythmWordStream = fs.createWriteStream('rhythm_word_map.jsonl');

  let uniqueRhythms = new Set();
  let processedWords = 0;

  for (const word of allWords) {
    const embedding = getWordEmbedding(word);
    if (embedding) {
      const rhythm = generateUniqueRhythm(word);
      const rhythmPattern = rhythmToPattern(rhythm);
      
      // Write word data
      wordDataStream.write(JSON.stringify({
        word: word,
        rhythm: rhythmPattern,
        embedding: embedding
      }) + '\n');

      // Write rhythm-word mapping
      rhythmWordStream.write(JSON.stringify({
        rhythm: rhythmPattern,
        word: word
      }) + '\n');

      uniqueRhythms.add(rhythmPattern);

      processedWords++;
      if (processedWords % 10000 === 0) {
        console.log(`Processed ${processedWords} words...`);
      }
    } else {
      console.log(`No embedding found for word: "${word}"`);
    }
  }

  wordDataStream.end();
  rhythmWordStream.end();

  console.log("Processing complete.");

  // Some statistics
  console.log(`Total processed words: ${processedWords}`);
  console.log(`Total unique rhythms: ${uniqueRhythms.size}`);

  // Sample output
  const sampleWords = ['the', 'of', 'and', 'in', 'to'];
  console.log("\nSample word data:");
  for (const word of sampleWords) {
    const embedding = getWordEmbedding(word);
    if (embedding) {
      const rhythm = rhythmToPattern(generateUniqueRhythm(word));
      console.log(`${word}:`);
      console.log(`  Rhythm: ${rhythm}`);
      console.log(`  Embedding: [${embedding.slice(0, 5).join(', ')}...]`);
    } else {
      console.log(`${word}: No data available`);
    }
  }
}

processEntireDataset().catch(error => console.error("An error occurred:", error));