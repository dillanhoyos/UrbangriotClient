import React, { useState, useEffect, useRef } from "react";
import { Grid, Typography, Button, Select, MenuItem } from "@mui/material";
import { generator, rotatearray, Alphacode } from "../utils/euclidean";
import RhythmPlayback from "./RhythmicPlayback"; // Ensure you import the RhythmPlayback component correctly
import AlphariddimsVisualizerCircle from "../visualcomponents/AlphariddimsVisualizerCircle"; // Import the new component

const sequences = {
  A: {
    pattern: [7, 4],
    alphariddim: [1,2,3,3],
    offset: 0,
    bpm: 90,
  },
  E: {
    pattern: [7, 4],
    alphariddim: [1,3,3,3],
    offset: 0,
    bpm: 90,
  },
  I: {
    pattern: [7, 4],
    alphariddim: [1,1,3,3],
    offset: 0,
    bpm: 90,
  },
  O: {
    pattern: [7, 4],
    alphariddim: [2,2,2,3],
    offset: 0,
    bpm: 90,
  },
  U: {
    pattern: [7, 4],
    alphariddim: [1,1,2,3],
    offset: 0,
    bpm: 90,
  },

  B: {
    pattern: [9, 4],
    alphariddim: [2,1,1,1],
    offset: 0,
    bpm: 90,
  },
  C: {
    pattern: [9, 4],
    alphariddim: [2,1,2,1],
    offset: 0,
    bpm: 90,
  },
  D: {
    pattern: [9, 4],
    alphariddim: [2,1,1,3],
    offset: 0,
    bpm: 90,
  },
  F: {
    pattern: [9, 4],
    alphariddim: [1,1,2,1],
    offset: 0,
    bpm: 90,
  },
  G: {
    pattern: [9, 4],
    alphariddim: [2,2,1,3],
    offset: 0,
    bpm: 90,
  },
  H: {
    pattern: [9, 4],
    alphariddim: [1,1,1,1],
    offset: 0,
    bpm: 90,
  },
  J: {
    pattern: [9, 4],
    alphariddim: [1,2,2,2],
    offset: 0,
    bpm: 90,
  },
  K: {
    pattern: [9, 4],
    alphariddim: [2,1,2,3],
    offset: 0,
    bpm: 90,
  },
  L: {
    pattern: [9, 4],
    alphariddim: [1,2,1,1],
    offset: 0,
    bpm: 90,
  },
  M: {
    pattern: [9, 4],
    alphariddim: [2,2,3,3],
    offset: 0,
    bpm: 90,
  },
  N: {
    pattern: [9, 4],
    alphariddim: [2,1,3,3],
    offset: 0,
    bpm: 90,
  },
  P: {
    pattern: [9, 4],
    alphariddim: [1,2,1,2],
    offset: 0,
    bpm: 90,
  },
  Q: {
    pattern: [9, 4],
    alphariddim: [2,2,1,2],
    offset: 0,
    bpm: 90,
  },
  R: {
    pattern: [9, 4],
    alphariddim: [1,2,1,3],
    offset: 0,
    bpm: 90,
  },
  S: {
    pattern: [9, 4],
    alphariddim: [1,1,1,3],
    offset: 0,
    bpm: 90,
  },
  T: {
    pattern: [9, 4],
    alphariddim: [2,3,3,3],
    offset: 0,
    bpm: 90,
  },
  W: {
    pattern: [9, 4],
    alphariddim: [1,2,2,3],
    offset: 0,
    bpm: 90,
  },
  V: {
    pattern: [9, 4],
    alphariddim: [1,1,1,2],
    offset: 0,
    bpm: 90,
  },
  X: {
    pattern: [9, 4],
    alphariddim: [2,1,1,2],
    offset: 0,
    bpm: 90,
  },
  Y: {
    pattern: [9, 4],
    alphariddim: [2,1,2,2],
    offset: 0,
    bpm: 90,
  },
  Z: {
    pattern: [9, 4],
    alphariddim: [2,2,1,1],
    offset: 0,
    bpm: 90,
  },
 
  // Add more sequences as needed
};

const AlphariddimsSequencerButtons = () => {
  const [sequence, setSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [selectedSequence, setSelectedSequence] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [loop, setLoop] = useState([])
  const [letter, setLetter] = useState("")

  const currentBeatRef = useRef(0);

  const generateSequence = (pattern, offset, alphariddim) => {
    const generatedSequence = generator(pattern[0], pattern[1]);
    const rotatedSequence = rotatearray(generatedSequence, offset);
    const alphasequence = Alphacode(rotatedSequence, alphariddim);
    setSequence(alphasequence);
  };

  useEffect(() => {
    if (isPlaying) {
      generateSequence(
        sequences[selectedSequence].pattern,
        sequences[selectedSequence].offset,
        sequences[selectedSequence].alphariddim

      );
      currentBeatRef.current = 0;
    }
  }, [isPlaying, selectedSequence]);

  const handleSequenceChange = (value) => {
    const selectedKey = value;
    setSelectedSequence(selectedKey);
    generateSequence(
      sequences[selectedKey].pattern,
      sequences[selectedKey].offset,
      sequences[selectedKey].alphariddim
    );
    setBpm(sequences[selectedKey].bpm);
    setLetter(selectedKey)
    if(loop){
      setIsPlaying(false);
    }
    setIsPlaying(false);
  };
  

  const onCurrentBeatChange = (currentBeat) => {
    setCurrentBeat(currentBeat);
  };
  const onfinishsequence = () => {
    setIsPlaying(false)
  }
  const handleToggle = () => {
    setLoop((prev) => !prev);
  };
  // Initial generation of the default sequence when component mounts
  useEffect(() => {
    generateSequence(
      sequences["A"].pattern,
      sequences["A"].offset,
      sequences["A"].alphariddim
    );
    setBpm(sequences["A"].bpm);
    setLetter("A")
    setSelectedSequence("A")
  }, []); // Empty dependency array ensures this effect runs only once on mount
  useEffect(() => {
   console.log(loop)
   console.log(isPlaying)
  }, [isPlaying]); // Empty dependency array ensures this effect runs only once on mount


  return (
    <Grid container spacing={2} alignItems="center" width="100%">
      <Grid item xs={12}>
        <Typography variant="h6">Euclidean Rhythm Generator</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color={isPlaying ? "secondary" : "primary"}
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? "Stop Sequencer" : "Start Sequencer"}
        </Button>
        <Button
          variant="contained"
          color={isPlaying ? "secondary" : "primary"}
          onClick={handleToggle}
        >
          {loop ? "Loop" : "OneShot"}
        </Button>
      </Grid>
      <Grid item xs={12}>
        {Object.keys(sequences).map((key) => (
            <Button
              key={key}
              variant={selectedSequence === key ? "contained" : "outlined"}
              onClick={() => handleSequenceChange(key)}
            >
              {key}
            </Button>
          ))}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Generated Sequence:</Typography>
        <AlphariddimsVisualizerCircle sequence={sequence} letter={letter} currentBeat={currentBeat} />
      </Grid>
      <RhythmPlayback
        sequence={sequence}
        bpm={bpm}
        isPlaying={isPlaying}
        onCurrentBeatChange={onCurrentBeatChange}
        reset_playback={onfinishsequence}
        sampleUrls={[
          "/audio/Conga/SO_AFR_conga_high.wav",
          "/audio/Conga/SO_AFR_conga_slap_closed.wav",
          "/audio/Conga/SO_AFR_conga_low.wav",
        ]} // Pass the sample URL as a prop
        loop={loop}
      />
    </Grid>
  );
};

export default AlphariddimsSequencerButtons;
