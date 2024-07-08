const fetch = require("node-fetch");

async function testWordToRhythm(word) {
  console.log(`Testing word-to-rhythm for "${word}"...`);
  const response = await fetch(`http://localhost:5000/word-to-rhythm/${word}`);
  const data = await response.json();
  console.log(`Response for "${word}":`, data);
}

async function testRhythmToWords(rhythm) {
  console.log("Testing rhythm-to-words...");
  console.log("Input rhythm:", rhythm);
  const response = await fetch("http://localhost:5000/rhythm-to-words", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rhythm }),
  });
  const data = await response.json();
  console.log("Response:", data);
}

async function runTests() {
  const testWords = [
    "hello",
    "world",
    "rhythm",
    "music",
    "dance",
    "computer",
    "algorithm",
  ];
  for (const word of testWords) {
    await testWordToRhythm(word);
  }
  await testRhythmToWords([0, 1, 2, 3, 1, 1, 0, 2, 3, 0, 1, 2, 0, 3, 1, 0]);
}

runTests();
