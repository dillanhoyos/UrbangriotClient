import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as Tone from 'tone';
import { Container, Typography, Button, Grid, Box  } from '@mui/material';
import { PlayCircleFilled } from '@mui/icons-material'; // Import icon for button

function Home() {
    const [info, setInfo] = useState({ url: '', text: '' });
    const [synth, setSynth] = useState(null);
    const canvasRef = useRef(null); // Reference for canvas element
    const analyzerRef = useRef(null); // Reference for analyzer

    useEffect(() => {
        console.log("Making API request to /api/info");
        axios.get('/api/info')
            .then(res => {
                console.log("API response:", res.data);
                setInfo(res.data);
            })
            .catch(err => {
                console.error("API request error:", err);
            });

        // Initialize the synthesizer
        const synth = new Tone.Synth().toDestination();
        setSynth(synth);
        // Setup analyzer after synthesizer is initialized
        setupAnalyzer(synth);

        // Cleanup function
        return () => {
            // Dispose of synth and analyzer to prevent memory leaks
            synth.dispose();
            if (analyzerRef.current) {
                analyzerRef.current.dispose();
            }
        };
    }, []);

    const playNote = (note) => {
        if (synth) {
            synth.triggerAttackRelease(note, "8n");
        }
    };

    // Notes in C major scale
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

    // Colors for buttons (example)
    const buttonColors = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#673ab7', '#ffc107'];
    const setupAnalyzer = (synth) => {
        const analyzer = new Tone.Analyser("fft", 1024);
        analyzerRef.current = analyzer;

        // Connect synth to analyzer and to destination
        if (synth) {
            synth.connect(analyzer).toDestination();
        } else {
            console.error("Synth is not initialized.");
            return;
        }

        // Start drawing waveform
        drawWaveform();
    };

    const drawWaveform = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        const containerWidth = canvas.parentElement.clientWidth; // Get parent container width
        const containerHeight = canvas.parentElement.clientHeight; // Get parent container width
        canvas.width = containerWidth; // Set canvas width to match container width
    
        const ctx = canvas.getContext('2d');
        const bufferLength = analyzerRef.current.size;
        const dataArray = analyzerRef.current.getValue();
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#333";
        ctx.beginPath();
    
        let x = 0;
        let base = 256
    
        // container width 827 
        const initialContainerWidth = 800; // Replace with your initial container width
        const initialScaleFactor = 3.5; // Replace with the scale factor that worked well

        // Calculate scaleFactor dynamically based on current containerWidth
        const scaleFactor = initialScaleFactor * ( initialContainerWidth/ containerWidth);
        console.log(scaleFactor)
        
        for (let i = 0; i < bufferLength; i++) {
            const v = (dataArray[i]/- containerHeight) ; // Scale to fit canvas height
            // Calculate slice width using logarithmic scale

            const invertedFraction = 1 - (i / bufferLength);  // Inverted fraction
            const sliceWidth = invertedFraction * Math.log(containerWidth)/scaleFactor;
            
            const out = sliceWidth;
            const y = containerHeight - (containerHeight * (1- v))
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
    
            x += sliceWidth;
        }
    
        ctx.lineTo(containerWidth, containerHeight / 2);
    
        const gradient = ctx.createLinearGradient(0, 0, containerWidth, containerHeight);
        gradient.addColorStop(0, "#ff0000");
        gradient.addColorStop(1, "#f0f0f0");
    
        ctx.strokeStyle = gradient;
        ctx.stroke();
    
        // Request next frame
        requestAnimationFrame(drawWaveform);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h2">C Major Scale</Typography>
            <Grid container spacing={2}>
                {notes.map((note, index) => (
                    <Grid item xs={6} sm={4} md={2} key={note}>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: buttonColors[index], color: 'white' }}
                            fullWidth
                            onClick={() => playNote(note)}
                            startIcon={<PlayCircleFilled />}
                        >
                            {note}
                        </Button>
                    </Grid>
                ))}
            </Grid>
            <Box mt={2} mb={4} bgcolor="#f0f0f0" borderRadius="8px" display="flex" justifyContent="center">
                <canvas ref={canvasRef} width={600} height={150} style={{ borderRadius: '8px' }} />
            </Box>
        </Container>
    );
}

export default Home;
