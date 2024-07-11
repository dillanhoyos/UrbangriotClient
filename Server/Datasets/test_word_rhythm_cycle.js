const fetch = require('node-fetch');

async function wordToRhythm(word) {
  const response = await fetch(`http://localhost:5000/word-to-rhythm/${word}`);
  const data = await response.json();
  return data.rhythm;
}

async function rhythmToWords(rhythm) {
  const response = await fetch('http://localhost:5000/rhythm-to-words', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rhythm })
  });
  const data = await response.json();
  return data.words;
}

function rhythmToPattern(rhythm) {
  return rhythm.map(beat => ['S', 'T', 'P', 'B'][beat]).join('');
}

async function testWordRhythmCycle(word) {
  console.log(`Testing word-rhythm cycle for "${word}"...`);
  
  const rhythm = await wordToRhythm(word);
  console.log('Generated rhythm:', rhythm);
  console.log('Rhythm pattern:', rhythmToPattern(rhythm));
  
  // Count occurrences of each beat type
  const beatCounts = rhythm.reduce((counts, beat) => {
    counts[beat]++;
    return counts;
  }, [0, 0, 0, 0]);
  console.log('Beat counts [S, T, P, B]:', beatCounts);
  
  const words = await rhythmToWords(rhythm);
  console.log('Words found from rhythm:');
  words.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
  
  const originalWordIndex = words.indexOf(word);
  if (originalWordIndex !== -1) {
    console.log(`Success! Original word "${word}" found at index ${originalWordIndex}`);
  } else {
    console.log(`Original word "${word}" not found in the results`);
    console.log('Closest matches:', words.slice(0, 3));
  }
  
  console.log('\n');
}

async function runTests() {
  const testWords = ['with', 'hello', 'world', 'rhythm', 'music', 'dance', 'computer', 'algorithm'];
  for (const word of testWords) {
    await testWordRhythmCycle(word);
  }
}

runTests();