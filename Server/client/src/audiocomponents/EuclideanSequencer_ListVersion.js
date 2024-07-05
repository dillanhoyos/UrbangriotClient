import React, { useState, useEffect, useRef } from "react";
import { Grid, Typography, Button, Select, MenuItem } from "@mui/material";
import { generator, rotatearray } from "../utils/euclidean"; // Import generator and rotatearray functions

const EuclideanSequencer_List = () => {
  const [sequence, setSequence] = useState([]); // State to store generated sequence
  const [isPlaying, setIsPlaying] = useState(false); // Sequencer play state
  const [intervalId, setIntervalId] = useState(null); // ID for interval to clear later
  const [audioBuffer, setaudiobuffer] = useState(null);
  const [bpm, setBpm] = useState(120); // Initial BPM
  const [selectedSequence, setSelectedSequence] = useState(0); // State to store the selected sequence index
  
  const lastElementRef = useRef(null);
  const imageRefs = useRef([]);
  const currentBeatRef = useRef(0); // Ref to hold the current beat value
  const audioCtxRef = useRef(null);

  const sequences = [
    {
      id: 'Colombia',
      name: 'Cumbia',
      pattern: [4, 3],
      bpm: 87,
      offset: 0,
      text: "Cumbia is a Colombian folk dance and music style. Its rhythm, characterized by a 4-beat and a 3-beat pattern, creates a lively and syncopated feel. With a BPM of 87, Cumbia is perfect for dancing and enjoying the vibrant culture of Colombia."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Persia',
      name: 'Khafif-e-ramal',
      pattern: [5, 2],
      bpm: 100,
      offset: 2,
      text: "Khafif-e-ramal is a Persian rhythm characterized by its 5-beat and 2-beat pattern. With a BPM of 100, it has a moderate pace, and its offset of 2 adds a unique syncopation to its feel."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Bulgaria',
      name: 'Ruchenitza',
      pattern: [7, 3],
      bpm: 100,
      offset: 0,
      text: "Ruchenitza is a Bulgarian folk dance rhythm with a lively and energetic feel. Its 7-beat and 3-beat pattern creates a unique syncopation, perfect for traditional Bulgarian dancing. With a BPM of 100, Ruchenitza is full of energy and excitement."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Bulgaria',
      name: 'Ruchenitza2',
      pattern: [7, 4],
      bpm: 100,
      offset: 0,
      text: "Ruchenitza2 is another variation of the traditional Bulgarian folk dance rhythm. With a 7-beat and 4-beat pattern, it offers a different feel while still maintaining the lively and energetic nature of the original Ruchenitza. With a BPM of 100, Ruchenitza2 is perfect for traditional Bulgarian dancing."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Turkey',
      name: 'Aksak',
      pattern: [9, 4],
      bpm: 100,
      offset: 0,
      text: "Aksak is a Turkish rhythm known for its asymmetrical time signature. With a 9-beat and 4-beat pattern, Aksak creates a unique and captivating feel. With a BPM of 100, Aksak is perfect for traditional Turkish music and dance."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Saudi Arabia',
      name: 'York-Samai',
      pattern: [6, 5],
      bpm: 100,
      offset: 2,
      text: "York-Samai is a Saudi Arabian rhythm characterized by its 6-beat and 5-beat pattern. With a BPM of 100 and an offset of 2, York-Samai has a moderate pace and a distinctive syncopated feel, perfect for traditional Saudi Arabia music and dance."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Saudi Arabia',
      name: 'Nawakhat',
      pattern: [7, 5],
      bpm: 100,
      offset: 0,
      text: "Nawakhat is a Saudi Arabian rhythm known for its lively and energetic feel. With a 7-beat and 5-beat pattern, Nawakhat creates a unique syncopation that is perfect for traditional Saudi Arabia music and dance. With a BPM of 100, Nawakhat is full of energy and excitement."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Saudi Arabia',
      name: 'Agsag-Samai',
      pattern: [9, 5],
      bpm: 100,
      offset: 0,
      text: "Agsag-Samai is a Saudi Arabian rhythm characterized by its 9-beat and 5-beat pattern. With a BPM of 100, Agsag-Samai has a moderate pace and a distinctive syncopated feel, perfect for traditional Saudi Arabia music and dance."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Cuba',
      name: 'Cuban Tresillo',
      pattern: [8, 3],
      bpm: 100,
      offset: 0,
      text: "Cuban Tresillo is a Cuban rhythm known for its infectious groove. With an 8-beat and 3-beat pattern, Cuban Tresillo creates a lively and syncopated feel that is perfect for dancing. With a BPM of 100, Cuban Tresillo is full of energy and excitement."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Cuba',
      name: 'Cuban Cinquillo',
      pattern: [8, 5],
      bpm: 100,
      offset: 0,
      text: "Cuban Cinquillo is another Cuban rhythm known for its lively and energetic feel. With an 8-beat and 5-beat pattern, Cuban Cinquillo creates a unique syncopation that is perfect for dancing. With a BPM of 100, Cuban Cinquillo is full of energy and excitement."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Spain',
      name: 'Spanish Tango',
      pattern: [8, 5],
      bpm: 80,
      offset: 2,
      text: "Spanish Tango is a rhythm known for its passionate and dramatic feel. With an 8-beat and 5-beat pattern, Spanish Tango creates a unique and captivating rhythm that is perfect for dancing. With a BPM of 80 and an offset of 2, Spanish Tango has a moderate pace and a distinctive syncopation."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Rusia',
      name: 'Pictures at an Exhibtion',
      pattern: [11, 5],
      bpm: 100,
      offset: 0,
      text: "Pictures at an Exhibition is a Russian rhythm known for its complex and dynamic feel. With an 11-beat and 5-beat pattern, Pictures at an Exhibition creates a unique and captivating rhythm that is perfect for classical music. With a BPM of 100, Pictures at an Exhibition is full of energy and excitement."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Africa',
      name: 'Venda',
      pattern: [12, 5],
      bpm: 100,
      offset: 0,
      text: "Venda is an African rhythm known for its lively and energetic feel. With a 12-beat and 5-beat pattern, Venda creates a unique syncopation that is perfect for traditional African music and dance. With a BPM of 100, Venda is full of energy and excitement."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Africa',
      name: 'MPre',
      pattern: [12, 7],
      bpm: 100,
      offset: 0,
      text: "MPre is an African rhythm known for its dynamic and complex feel. With a 12-beat and 7-beat pattern, MPre creates a unique and captivating rhythm that is perfect for traditional African music. With a BPM of 100, MPre is full of energy and excitement."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Ghana',
      name: 'Pygmies',
      pattern: [24, 11],
      bpm: 100,
      offset: 8,
      text: "Pygmies is an African rhythm known for its complex and dynamic feel. With a 24-beat and 11-beat pattern, Pygmies creates a unique and captivating rhythm that is perfect for traditional African music. With a BPM of 100 and an offset of 8, Pygmies has a moderate pace and a distinctive syncopation."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Ghana',
      name: 'Pygmies of upper Sangha',
      pattern: [24, 13],
      bpm: 100,
      offset: 0,
      text: "Pygmies of Upper Sangha is another African rhythm known for its dynamic and complex feel. With a 24-beat and 13-beat pattern, Pygmies of Upper Sangha creates a unique and captivating rhythm that is perfect for traditional African music. With a BPM of 100, Pygmies of Upper Sangha is full of energy and excitement."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Brazil',
      name: 'Bossa Nova',
      pattern: [16, 5],
      bpm: 90,
      offset: 6,
      text: "Bossa Nova is a Brazilian rhythm known for its smooth and laid-back feel. With a 16-beat and 5-beat pattern, Bossa Nova creates a relaxed and syncopated rhythm that is perfect for lounging and enjoying the vibrant culture of Brazil. With a BPM of 90 and an offset of 6, Bossa Nova has a moderate pace and a distinctive syncopation."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
    {
      id: 'Brazil',
      name: 'Samba',
      pattern: [16, 7],
      bpm: 160,
      offset: 9,
      text: "Samba is another Brazilian rhythm known for its lively and energetic feel. With a 16-beat and 7-beat pattern, Samba creates a unique and captivating rhythm that is perfect for dancing. With a BPM of 160 and an offset of 9, Samba is full of energy and excitement."
      ,
      image: "/images/prompting_stationn/flags/"   
    },
   
  ];

  const lookahead = 25.0;
  const scheduleAheadTime = 0.2;
  let nextNoteTime = 0.0;

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      clearTimeout(intervalId);
    };
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

  useEffect(() => {
    // Initialize the imageRefs array with null values for each sequence item
    imageRefs.current = new Array(4).fill(null);
  }, []);

  const scheduleNote = (beatNumber, time) => {
    if (sequence[beatNumber] === 1) {
      playSample(audioBuffer, time);
    }
    setTimeout(draw, audioCtxRef.current.currentTime - time);
  };

  const draw = () => {
    const element =
      imageRefs.current[
        (currentBeatRef.current - 1 + sequence.length) % sequence.length
      ];
    const lastElement = lastElementRef.current;

    if (lastElement) {
      lastElement.style.transition = "all 0.1s ease-in-out"; // Add transition
      lastElement.style.backgroundColor = "white"; // Reset background color
      lastElement.style.width = "80%"; // Reset size
      lastElement.style.height = "80%"; // Reset size
      lastElement.style.border = "none"; // Reset border
    }

    if (element) {
      if (sequence[currentBeatRef.current - 1] === 1) {
        element.style.transition = "all 0.05s ease-in-out"; // Add transition
        element.style.border = "2px blue"; // Reset border
        element.style.width = "180%"; // Enlarge size
        element.style.color = "yellow"; // Enlarge size
        element.style.height = "180%"; // Enlarge size
      } else {
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
    currentBeatRef.current = (currentBeatRef.current + 1) % sequences[selectedSequence].pattern[0];
  }

  const scheduler = () => {
    while (nextNoteTime < audioCtxRef.current.currentTime + scheduleAheadTime) {
      scheduleNote(currentBeatRef.current, nextNoteTime);
      nextNote();
    }
    clearInterval(intervalId);
    const newIntervalId = setTimeout(scheduler, lookahead);
    setIntervalId(newIntervalId);
  };

  const playSample = (audioBuffer, time) => {
    const sampleSource = new AudioBufferSourceNode(audioCtxRef.current, {
      buffer: audioBuffer,
    });
    sampleSource.connect(audioCtxRef.current.destination);
    sampleSource.start(time);
    return sampleSource;
  };

  const generateSequence = (pattern, offset) => {
    const generatedSequence = generator(pattern[0], pattern[1]); // Generate sequence based on pattern
    const rotatedSequence = rotatearray(generatedSequence, offset);
    setSequence(rotatedSequence);
  };
  useEffect(() => {
    if (isPlaying) {
      clearTimeout(intervalId);
      nextNoteTime = audioCtxRef.current.currentTime;
      scheduler();
    }
  }, [sequence]);

  useEffect(() => {
    if (isPlaying) {
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      clearTimeout(intervalId);
      generateSequence(
        sequences[selectedSequence].pattern,
        sequences[selectedSequence].offset
      );
      currentBeatRef.current = 0;
      nextNoteTime = audioCtxRef.current.currentTime + lookahead;
      scheduler();
    } else {
      clearTimeout(intervalId);
      setIntervalId(null);
    }
  }, [isPlaying]);

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

  const handleSequenceChange = (event) => {
    setSelectedSequence(event.target.value);
    generateSequence(
      sequences[event.target.value].pattern,
      sequences[event.target.value].offset
    );
    setBpm(sequences[event.target.value].bpm);
    setIsPlaying(false); // Stop playback when changing sequences
  };

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
      </Grid>
      <Grid item xs={12}>
        <Select
          value={selectedSequence}
          onChange={handleSequenceChange}
          style={{ minWidth: 150 }}
        >
          {sequences.map((seq, index) => (
            <MenuItem key={index} value={index}>
              {seq.name}
            </MenuItem>
          ))}
        </Select>
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
                ref={(el) => (imageRefs.current[index] = el)}
              />
            </div>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

export default EuclideanSequencer_List;
