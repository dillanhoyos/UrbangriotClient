import React, { useState, useEffect, useRef } from 'react';
import { Grid, Slider, Typography, Button } from '@mui/material';
import { generator, rotatearray } from '../utils/euclidean'; // Import generator and rotatearray functions
import * as Tone from 'tone'; // Import Tone.js library

const EuclideanSequencer = () => {
  const [size, setSize] = useState(16); // Initial size for Euclidean rhythm
  const [elements, setElements] = useState(16); // Initial number of beats in Euclidean rhythm
  const [sequence, setSequence] = useState([]); // State to store generated sequence
  const [rotationSteps, setRotationSteps] = useState(0); // State to store rotation steps
  const [bpm, setBpm] = useState(120); // Initial BPM
  const [isPlaying, setIsPlaying] = useState(false); // Sequencer play state
  const [intervalId, setIntervalId] = useState(null); // ID for interval to clear later
  const [conga, setConga] = useState(null); // State to hold the conga sampler
  const currentBeatRef = useRef(0); // Ref to hold the current beat value

   // Initialize conga sampler
   useEffect(() => {
    const congaSampler = new Tone.Sampler({
      urls: {
        C1: "FKI_percussion_clave_01.wav",
        A1: "FKI_percussion_clave_01.wav",
        B1: "FKI_percussion_clave_01.wav"
      },
      release: 0.1,
      baseUrl: "/audio/Conga/"
    }).toDestination();

    setConga(congaSampler);

    // Cleanup function
    return () => {
      congaSampler.dispose(); // Dispose the sampler when component unmounts
    };
  }, []); // Empty dependency array ensures this effect runs only once

  // Function to handle size change
  const handleSizeChange = (event, newSize) => {
    setSize(newSize);
    if (elements > newSize) {
      setElements(0); // Reset elements to 0 if it exceeds newSize
    }
    generateSequence(newSize, elements, rotationSteps);
    if (isPlaying) {
      stopSequencer();
      startSequencer(bpm);
    }
  };

  // Function to handle elements change
  const handleElementsChange = (event, newElements) => {
    if (newElements > size) {
      setElements(0); // Reset elements to 0 if it exceeds size
    } else {
      setElements(newElements);
    }
    generateSequence(size, newElements, rotationSteps);
    if (isPlaying) {
      stopSequencer();
      startSequencer(bpm);
    }
  };

  // Function to handle rotation steps change
  const handleRotationStepsChange = (event, newRotationSteps) => {
    setRotationSteps(newRotationSteps);
    generateSequence(size, elements, newRotationSteps);
    if (isPlaying) {
      stopSequencer();
      startSequencer(bpm);
    }
  };

  // Function to handle BPM change
  const handleBpmChange = (event, newBpm) => {
    setBpm(newBpm);
    if (isPlaying) {
      stopSequencer();
      startSequencer(newBpm);
    }
  };

  // Function to start the sequencer
  const startSequencer = (currentBpm) => {
    const generatedSequence = generator(size, elements);
    const intervalMs = calculateIntervalMs(currentBpm, size);
    const rotatedSequence = rotatearray(generatedSequence, rotationSteps);
    setSequence(rotatedSequence);

    const id = setInterval(() => {
      playSequence(rotatedSequence, currentBeatRef.current); // Use currentBeatRef.current
      currentBeatRef.current = (currentBeatRef.current + 1) % size; // Update currentBeatRef.current
    }, intervalMs);
  
    setIntervalId(id);
    setIsPlaying(true);
  };

  // Function to stop the sequencer
  const stopSequencer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
    setIsPlaying(false);
  };

  // Function to play the sequence using Tone.js
  const playSequence = (sequence, beatIndex) => {
    if (sequence[beatIndex] === 1) {
      conga.triggerAttack("A1"); // Example trigger, replace with your own logic
    }
    // Add more conditions for different steps if needed
  };

  // Function to generate the sequence based on current state values
  const generateSequence = (currentSize, currentElements, currentRotationSteps) => {
    const generatedSequence = generator(currentSize, currentElements);
    const rotatedSequence = rotatearray(generatedSequence, currentRotationSteps);
    setSequence(rotatedSequence);
  };

  // Function to calculate interval in milliseconds based on BPM and sequence size
  const calculateIntervalMs = (bpm, sequenceSize) => {
    const durationOfOneBeatMs = 60000 / bpm;
    const durationOfSubdivisionMs = durationOfOneBeatMs / 4 ;
    console.log(durationOfSubdivisionMs)
    return durationOfSubdivisionMs;
  };

  // useEffect hook to handle cleanup and start/stop sequencer
  useEffect(() => {
    if (isPlaying) {
      startSequencer(bpm);
      return () => stopSequencer(); // Cleanup function to stop sequencer
    } else {
      stopSequencer(); // Ensure sequencer is stopped if not playing
    }
  }, [isPlaying]);
  

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h6">Euclidean Rhythm Generator</Typography>
      </Grid>
      <Grid item xs={12}>
        <Slider
          value={size}
          onChange={handleSizeChange}
          min={1}
          max={16}
          step={1}
          valueLabelDisplay="auto"
          aria-labelledby="size-slider"
        />
        <Typography>Size: {size}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Slider
          value={elements}
          onChange={handleElementsChange}
          min={0}
          max={size}
          step={1}
          valueLabelDisplay="auto"
          aria-labelledby="elements-slider"
        />
        <Typography>Elements: {elements}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Slider
          value={rotationSteps}
          onChange={handleRotationStepsChange}
          min={0}
          max={size - 1}
          step={1}
          valueLabelDisplay="auto"
          aria-labelledby="rotation-steps-slider"
        />
        <Typography>Rotation Steps: {rotationSteps}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Slider
          value={bpm}
          onChange={handleBpmChange}
          min={60}
          max={240}
          step={1}
          valueLabelDisplay="auto"
          aria-labelledby="bpm-slider"
        />
        <Typography>BPM: {bpm}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color={isPlaying ? "secondary" : "primary"}
          onClick={() => setIsPlaying(prev => !prev)} // Toggle isPlaying state
        >
          {isPlaying ? "Stop Sequencer" : "Start Sequencer"}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Generated Sequence:</Typography>
        <Typography variant="body2">{JSON.stringify(sequence)}</Typography>
      </Grid>
    </Grid>
  );
};

export default EuclideanSequencer;
