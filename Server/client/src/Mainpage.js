import React, { useState } from 'react';
import { Container, Grid, Button, makeStyles, ThemeProvider } from '@mui/material';
import VideoCard from './videoCard';
import TextCard from './TextCard';
import ImageCard from './ImageCard';
import theme from './theme'; // Import your custom theme

const MainPage = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const cards = [
    <VideoCard
      key="video"
      title="Example Video"
      description="This is a sample video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
    />,
    <TextCard
      key="text"
      title="Example Text"
      description="This is a sampl e text description. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    />,
    <ImageCard
      key="image"
      imageUrl="/logo192.png"
      title="Example Image"
      description="This is a sample image description. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    />
  ];

  const handleNextCard = () => {
    setCurrentCard(currentCard + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {cards[currentCard]}
          </Grid>
          <Grid item xs={12}>
            {currentCard < cards.length - 1 && (
              <Button variant="contained" color="primary" onClick={handleNextCard}>Next</Button>
            )}
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default MainPage;
