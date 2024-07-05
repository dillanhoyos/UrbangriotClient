import React, { useState, useEffect, useRef } from "react";
import { Grid, Slider, Typography, Button } from "@mui/material";
import { generator, rotatearray } from "../utils/euclidean"; // Import generator and rotatearray functions
import { blue } from "@mui/material/colors";

const EuclideanSequencer = () => {
  const [size, setSize] = useState(16); // Initial size for Euclidean rhythm
  const [elements, setElements] = useState(16); // Initial number of beats in Euclidean rhythm
  const [rotationSteps, setRotationSteps] = useState(0); // State to store rotation steps
  const [sequence, setSequence] = useState([]); // State to store generated sequence
  const [tempBPM, setTempBpm] = useState(120); // Initial BPM
  const [bpm, setBpm] = useState(120); // Initial BPM
  const [isPlaying, setIsPlaying] = useState(false); // Sequencer play state
  const [intervalId, setIntervalId] = useState(null); // ID for interval to clear later
  const [audioBuffer, setaudiobuffer] = useState(null);
  const lastElementRef = useRef(null);
  const imageRefs = useRef([]); 
  const currentBeatRef = useRef(0); // Ref to hold the current beat value
  const audioCtxRef = useRef(null);

  // Function to handle size change
  const handleSizeChange = (event, newSize) => {
    setSize(newSize);
    if (elements > newSize) {
      setElements(0); // Reset elements to 0 if it exceeds newSize
    }
  };
  const handleSizeChangeComitted = (event, newSize) => {
    setSize(newSize);
    if (elements > newSize) {
      setElements(0); // Reset elements to 0 if it exceeds newSize
    }
    generateSequence(newSize, elements, rotationSteps);
  };

  // Function to handle elements change
  const handleElementsChange = (event, newElements) => {
    if (newElements > size) {
      setElements(0); // Reset elements to 0 if it exceeds size
    } else {
      setElements(newElements);
    }
  };
  const handleElementsChangeCommitted = (event, newElements) => {
    if (newElements > size) {
      setElements(0); // Reset elements to 0 if it exceeds size
    } else {
      setElements(newElements);
    }
    generateSequence(size, newElements, rotationSteps);
  };

  // Function to handle rotation steps change
  const handleRotationStepsChange = (event, newRotationSteps) => {
    setRotationSteps(newRotationSteps);
  };

  const handleRotationStepsCommited = (event, newRotationSteps) => {
    setRotationSteps(newRotationSteps);
    generateSequence(size, elements, newRotationSteps);
  };

  useEffect(() => {
    if (isPlaying) {
      clearTimeout(intervalId);
      nextNoteTime = audioCtxRef.current.currentTime;
      scheduler();
    }
  }, [sequence]);

  // Function to handle BPM change
  const handleBpmChange = (event, newBpm) => {
    setTempBpm(newBpm);
  };
  const handleBpmChangeCommitted = (event, newBpm) => {
    setBpm(newBpm);
  };
  useEffect(() => {
    if (isPlaying) {
      clearTimeout(intervalId);
      nextNoteTime = audioCtxRef.current.currentTime;
      scheduler();
    }
  }, [bpm]);

  useEffect(() => {
    // Initialize the refs array with null values for each sequence item
    imageRefs.current = imageRefs.current.slice(0, size);
  }, [size]);

  const lookahead = 25.0;
  const scheduleAheadTime = 0.2;
  let nextNoteTime = 0.0;

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
  }, []);

  const loadSample = async (url) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    let tempbuff = await audioCtxRef.current.decodeAudioData(arrayBuffer);
    setaudiobuffer(tempbuff);
  };

  useEffect(() => {
    loadSample("/audio/Conga/FKI_percussion_clave_01.wav");
  }, []);

  function scheduleNote(beatNumber, time) {
    if (sequence[beatNumber] === 1) {
      playSample(audioBuffer, time);
    }
    setTimeout(draw, audioCtxRef.current.currentTime - time)
  
  }
  const draw = () => {
    const element = imageRefs.current[(currentBeatRef.current - 1 + sequence.length) % sequence.length];
    const lastElement = lastElementRef.current;

    if (lastElement) {
      lastElement.style.transition = "all 0.1s ease-in-out"; // Add transition
      lastElement.style.backgroundColor = "white"; // Reset background color
      lastElement.style.width = "80%"; // Reset size
      lastElement.style.height = "80%"; // Reset size
      lastElement.style.border = "none"; // Reset border
    }
    
    if (element) {
      if(sequence[currentBeatRef.current-1]=== 1){
          element.style.transition = "all 0.05s ease-in-out"; // Add transition
          element.style.border = "2px blue"; // Reset border
          element.style.width = "180%"; // Enlarge size
          element.style.color = "yellow"; // Enlarge size
          element.style.height = "180%"; // Enlarge size
          
          
        } else{
          
          element.style.transition = "all 0.05s ease-in-out"; // Add transition
          element.style.border = "none"; // Reset border
          element.style.width = "120%"; // Enlarge size
          element.style.height = "120%"; // Enlarge size
        }
      }
    
    

    // Update the last element reference
    lastElementRef.current = element;
  };

  function nextNote() {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime += secondsPerBeat / 4;
    currentBeatRef.current = (currentBeatRef.current + 1) % size;
  }

  const scheduler = () => {
    while (nextNoteTime < audioCtxRef.current.currentTime + scheduleAheadTime) {
      scheduleNote(currentBeatRef.current, nextNoteTime);
      nextNote();
    }
    clearInterval(intervalId)
    const newIntervalId = setTimeout(scheduler, lookahead);
    setIntervalId(newIntervalId);
  };

  // Function to play the sequence using Tone.js
  const playSample = (audioBuffer, time) => {
    const sampleSource = new AudioBufferSourceNode(audioCtxRef.current, {
      buffer: audioBuffer,
    });
    sampleSource.connect(audioCtxRef.current.destination);
    sampleSource.start(time);

    return sampleSource;
  };

  useEffect(() => {
    if (isPlaying) {
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      clearTimeout(intervalId);
      generateSequence(size, elements, rotationSteps);
      currentBeatRef.current = 0;
      nextNoteTime = audioCtxRef.current.currentTime + lookahead;
      scheduler();
    } else {
      clearTimeout(intervalId);
      setIntervalId(null);
    }
  }, [isPlaying]);

  // Function to generate the sequence based on current state values
  const generateSequence = (
    currentSize,
    currentElements,
    currentRotationSteps
  ) => {
    const generatedSequence = generator(currentSize, currentElements);
    const rotatedSequence = rotatearray(
      generatedSequence,
      currentRotationSteps
    );
    setSequence(rotatedSequence);
  };

  // Function to get the image URL based on the sequence value
  const getImageForSequence = (value) => {
    switch (value) {
      case 1:
        return "/musicalNotation/sixteenNote.jpg";
      case 0:
        return "/musicalNotation/sixteenNoteSilence.jpg";
      default:
        return "/path/to/default.png";
    }
  };
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      clearTimeout(intervalId);
      setIntervalId(null)
    };
  }, []);

  return (
    <Grid container spacing={2} alignItems="left" width="100%">
      <Grid item xs={12}>
        <Typography variant="h6">Euclidean Rhythm Generator</Typography>
      </Grid>
      <Grid item xs={12}>
        <Slider
          value={size}
          onChange={handleSizeChange}
          onChangeCommitted={handleSizeChangeComitted}
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
          onChangeCommitted={handleElementsChangeCommitted}
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
          onChangeCommitted={handleRotationStepsCommited}
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
          value={tempBPM}
          onChange={handleBpmChange}
          onChangeCommitted={handleBpmChangeCommitted}
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
          onClick={() => setIsPlaying((prev) => !prev)} // Toggle isPlaying state
        >
          {isPlaying ? "Stop Sequencer" : "Start Sequencer"}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Generated Sequence:</Typography>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {sequence.map((value, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "50px",
                height: "50px",
              }}
            >
              <img
                src={getImageForSequence(value)}
                alt={`sequence-${index}`}
                className={`image-class-${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                ref={el => (imageRefs.current[index] = el)}
              />
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

export default EuclideanSequencer;
