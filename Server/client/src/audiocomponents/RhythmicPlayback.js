import React, { useState, useEffect, useRef } from "react";

const RhythmPlayback = ({
  sequence,
  bpm,
  isPlaying,
  sampleUrls,
  onCurrentBeatChange,
  reset_playback=null,
  loop=true,
}) => {
  const [audioBuffers, setAudioBuffers] = useState([]);
  const [buffersLoaded, setBuffersLoaded] = useState(false);
  const audioCtxRef = useRef(null);
  const currentBeatRef = useRef(0);
  const [intervalId, setIntervalId] = useState(null);
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
  useEffect(() => {
    loadSamples(sampleUrls);
  }, []);

  const loadSamples = async (urls) => {
    try {
      const buffers = await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          return await audioCtxRef.current.decodeAudioData(arrayBuffer);
        })
      );
      setAudioBuffers((prev) => [0, ...prev, ...buffers]);
      setBuffersLoaded(true); // Mark buffers as loaded
    } catch (error) {
      console.error("Error loading audio buffers:", error);
      // Handle error loading buffers
    }
  };
  const scheduleNote = (beatNumber, time) => {
    if (!buffersLoaded) return;
    const sampleIndex = sequence[beatNumber];
    if (sampleIndex !== 0) {
      playSample(audioBuffers[sampleIndex], time);
    }

    setTimeout(
      onCurrentBeatChange(currentBeatRef.current),
      audioCtxRef.current.currentTime - time * 2
    );
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime += secondsPerBeat / 4;
    if (currentBeatRef.current + 1 >= sequence.length) {
      if (!loop) {
        // Stop playback
        clearTimeout(intervalId);
        reset_playback()
        setIntervalId(null);
        return;
      } else {
        // Loop the sequence
        currentBeatRef.current = 0;
      }
    } else {
      currentBeatRef.current = (currentBeatRef.current + 1) % sequence.length;
    }
  };

  const scheduler = () => {
    while (nextNoteTime < audioCtxRef.current.currentTime + scheduleAheadTime) {
      scheduleNote(currentBeatRef.current, nextNoteTime);
      nextNote();
    }
    clearInterval(intervalId);
    const timeoutId = setTimeout(scheduler, lookahead);
    setIntervalId(timeoutId);
  };

  const playSample = (audioBuffer, time) => {
    const sampleSource = new AudioBufferSourceNode(audioCtxRef.current, {
      buffer: audioBuffer,
    });
    sampleSource.connect(audioCtxRef.current.destination);
    sampleSource.start(time);
    sampleSource.onended = () => {
      sampleSource.disconnect();
    };
    return sampleSource;
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
      if (audioCtxRef.current.state == "suspended") {
        audioCtxRef.resume();
      }
      clearTimeout(intervalId);
      currentBeatRef.current = 0;
      nextNoteTime = audioCtxRef.current.currentTime + lookahead;
      scheduler();
    } else {
      clearTimeout(intervalId);
      setIntervalId(null);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      clearTimeout(intervalId);
      setIntervalId(null);
    };
  }, []);
};

export default RhythmPlayback;
