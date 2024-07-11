const fetch = require("node-fetch");
const fs = require("fs");
const readline = require("readline");
const path = require("path");

let wordVectors = {};

function loadModel() {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "glove.6B.100d.txt");
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;

    rl.on("line", (line) => {
      lineCount++;
      const [word, ...vector] = line.split(" ");
      wordVectors[word] = vector.map(Number);

      if (lineCount % 100000 === 0) {
        console.log(`Processed ${lineCount} words...`);
      }
    });

    rl.on("close", () => {
      console.log(`Loaded ${Object.keys(wordVectors).length} word embeddings`);
      console.log("Sample words:", Object.keys(wordVectors).slice(0, 10));
      resolve();
    });

    rl.on("error", (err) => {
      console.error("Error reading file:", err);
      reject(err);
    });
  });
}
function getWordEmbedding(word) {
  return wordVectors[word.toLowerCase()] || null;
}
function getAllWords() {
  return Object.keys(wordVectors);
}

function cosineSimilarity(vec1, vec2) {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

function findSimilarWords(embedding, topN = 10) {
  const words = Object.keys(wordVectors);
  const similarities = words.map((word) => ({
    word,
    similarity: cosineSimilarity(embedding, wordVectors[word]),
  }));
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN)
    .map((item) => item.word);
}

function sentenceToEmbedding(sentence) {
  const tokens = tokenizer.tokenize(sentence.toLowerCase());
  const vectors = tokens
    .map((token) => getWordEmbedding(token))
    .filter((v) => v);
  if (vectors.length === 0) return null;
  const sum = vectors.reduce((acc, vec) => acc.map((v, i) => v + vec[i]));
  return sum.map((v) => v / vectors.length);
}

module.exports = {
  loadModel,
  getWordEmbedding,
  findSimilarWords,
  sentenceToEmbedding,
  getAllWords
};
