const {
    getWordEmbedding,
    getAllWords,
    findSimilarWords,
  } = require("./wordEmbeddings");
  
  const SILENCE = 0, TONE = 1, SLAP = 2, BASS = 3;
  
  function embeddinToRhythm(embedding) {
    // Normalize the embedding to range [0, 1]
    const normalizedEmbedding = normalize(embedding, 0, 1);
  
    // Convert to rhythm
    let rhythm = [];
    for (let i = 0; i < 16; i++) {
      const start = i * 6;
      const chunk = normalizedEmbedding.slice(start, start + 6);
      const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
  
      if (avg < 0.25) rhythm.push(SILENCE);
      else if (avg < 0.5) rhythm.push(TONE);
      else if (avg < 0.75) rhythm.push(SLAP);
      else rhythm.push(BASS);
    }
  
    return rhythm;
  }
  
  function getRhythmForWord(word) {
    const embedding = getWordEmbedding(word);
    if (!embedding) {
      console.log(`No embedding found for word: ${word}`);
      return null;
    }
    return embeddinToRhythm(embedding);
  }
  
  function rhythmToEmbedding(rhythm) {
    const embedding = new Array(100).fill(0);
    
    for (let i = 0; i < rhythm.length; i++) {
      const beat = rhythm[i];
      const position = i / 15; // Normalized position
      
      // Spread each beat information across 6 dimensions
      const start = i * 6;
      embedding[start] = beat / 3; // Beat type (normalized)
      embedding[start + 1] = position; // Position
      embedding[start + 2] = Math.sin(position * Math.PI * 2); // Sine of position
      embedding[start + 3] = Math.cos(position * Math.PI * 2); // Cosine of position
      embedding[start + 4] = beat === SILENCE || beat === TONE ? 0 : 1; // Is percussive
      embedding[start + 5] = beat === BASS ? 1 : 0; // Is bass
    }
  
    // Use the remaining 4 dimensions for global rhythm features
    embedding[96] = rhythm.filter(b => b === SILENCE).length / 16; // Silence ratio
    embedding[97] = rhythm.filter(b => b === BASS).length / 16; // Bass ratio
    embedding[98] = rhythm.filter(b => b === SLAP).length / 16; // Slap ratio
    embedding[99] = rhythm.filter(b => b === TONE).length / 16; // Tone ratio
  
    return normalize(embedding, 0, 1);
  }
  
  function getWordsForRhythm(rhythm) {
    const rhythmEmbedding = rhythmToEmbedding(rhythm);
    const allWords = getAllWords();
    const wordDistances = allWords.map((word) => {
      const wordEmbedding = getWordEmbedding(word);
      const distance = cosineSimilarity(rhythmEmbedding, wordEmbedding);
      return { word, distance };
    });
  
    return wordDistances
      .sort((a, b) => b.distance - a.distance) // Higher cosine similarity is better
      .slice(0, 10)
      .map((item) => item.word);
  }
  
  function cosineSimilarity(vec1, vec2) {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (mag1 * mag2);
  }
  
  function normalize(vector, minRange, maxRange) {
    const min = Math.min(...vector);
    const max = Math.max(...vector);
    return vector.map(
      (val) => ((val - min) / (max - min)) * (maxRange - minRange) + minRange
    );
  }
  
  module.exports = { getRhythmForWord, getWordsForRhythm };