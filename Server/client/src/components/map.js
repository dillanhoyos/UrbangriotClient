import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Typography, Paper, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { redirect } from 'react-router-dom';

const jsonAPIData = {
  "data": [
    {
      "type": "category",
      "id": "IC",
      "attributes": {
        "name": "Identity Camp"
      },
      "relationships": {
        "activities": {
          "data": [
            { "type": "activity", "id": "IC-01", "levelname": "Spirit Animal Avatar Creation" },
            { "type": "activity", "id": "IC-02", "levelname": "Mask Construction" },
            { "type": "activity", "id": "IC-03", "levelname": "Drum Name Generation" }
          ]
        }
      }
    },
    {
      "type": "category",
      "id": "RD",
      "attributes": {
        "name": "Rhythm Camp"
      },
      "relationships": {
        "activities": {
          "data": [
            { "type": "activity", "id": "RD-01", "levelname": "Rhythm and Moves" },
            { "type": "activity", "id": "RD-02", "levelname": "Global Rhythm Explorer" },
            { "type": "activity", "id": "RD-03", "levelname": "Percussion Crafting" }
          ]
        }
      }
    },
    {
      "type": "category",
      "id": "PR",
      "attributes": {
        "name": "Proverbs Camp"
      },
      "relationships": {
        "activities": {
          "data": [
            { "type": "activity", "id": "PR-01", "levelname": "Animal Pantomime" },
            { "type": "activity", "id": "PR-02", "levelname": "Proverb Drummer" },
            { "type": "activity", "id": "PR-03", "levelname": "Proverb art" }
          ]
        }
      }
    },
    {
      "type": "category",
      "id": "N",
      "attributes": {
        "name": "Numbers Camp"
      },
      "relationships": {
        "activities": {
          "data": [
            { "type": "activity", "id": "N-01", "levelname": "Rhythm Arithmetics" },
            { "type": "activity", "id": "N-02", "levelname": "Beat Counter" },
            { "type": "activity", "id": "N-03", "levelname": "Beat Stepper" },
            { "type": "activity", "id": "N-04", "levelname": "Beat Reader" }
          ]
        }
      }
    },
    {
      "type": "category",
      "id": "A",
      "attributes": {
        "name": "Alphabet Camp"
      },
      "relationships": {
        "activities": {
          "data": [
            { "type": "activity", "id": "A-01", "levelname": "Letter Rhythm Explorer" },
            { "type": "activity", "id": "A-02", "levelname": "Name Letters Rhythm" },
            { "type": "activity", "id": "A-03", "levelname": "Digital Alphariddims" }
          ]
        }
      }
    },
    {
      "type": "category",
      "id": "V",
      "attributes": {
        "name": "Vocabulary Camp"
      },
      "relationships": {
        "activities": {
          "data": [
            { "type": "activity", "id": "V-01", "levelname": "Syllable Clapper" },
            { "type": "activity", "id": "V-02", "levelname": "Syllable Drummer" }
          ]
        }
      }
    }
  ]
};

const backgroundImages = {
  IC: 'url(campmapimages/identitycamp.png)',
  RD: 'url(campmapimages/rhythmcamp.png)',
  PR: 'url(campmapimages/proverbscamp.png)',
  N:  'url(campmapimages/numberscamp.png)',
  A:  'url(campmapimages/alphabetcamp.png)',
  V:  'url(campmapimages/vocabularycamp.png)',
};

const LevelMap = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // ... other state and functions

  const activity_redirect = (activity_id) => {
    // Redirect to another React Route:
    navigate(`/activities/${activity_id}`);
  };

  // Extract categories and activities from JSONAPI data
  const categories = jsonAPIData.data.map(cat => ({
    id: cat.id,
    name: cat.attributes.name,
    activities: cat.relationships.activities.data.map(activity => ({
      id: activity.id,
      levelname: activity.levelname,
    })),
  }));

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const renderActivityCircle = (activity, index, totalActivities) => {
    const circleSize = 100;
    const verticalSpacing = 120;
    const zigzagOffset = 120;
  
    const isEvenIndex = index % 2 === 0;
    const top = index * verticalSpacing;
    let left = isEvenIndex ? 0 : zigzagOffset;
  
    return (
      <Box
        key={activity.id}
        sx={{
          position: 'absolute',
          top: `${top}px`,
          left: `${left}px`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
        }}
        onClick={() => activity_redirect(activity.id)}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: theme.palette.primary.contrastText,
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              padding: '5px',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
            }}
          >
            {activity.levelname}
          </Typography>
        </Paper>
      </Box>
    );
  };
  

  const renderCategoryButtons = () => {
    return categories.map((category) => (
      <Grid item xs={6} sm={3} md={2} key={category.id}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: category.id === selectedCategory.id ? theme.palette.primary.main : theme.palette.background.default,
            color: theme.palette.primary.contrastText,
            fontWeight: 'bold',
            textTransform: 'none',
            width: '100%',
            height: '100%',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
          onClick={() => setSelectedCategory(category)}
          fullWidth
        >
          {category.name}
        </Button>
      </Grid>
    ));
  };

  const renderCategory = (category) => {
    const totalActivities = category.activities.length;
    const mapHeight = Math.ceil(totalActivities / 2) * 80 + 100; // Adjust based on vertical spacing

    return (
      <Grid container direction="column" alignItems="center" key={category.id} sx={{ mb: 4 }}>
        <Grid item xs={12}>
        <Typography
          variant="h3"
          sx={{
            color: theme.palette.primary.main,
            mb: 4,
            textTransform: 'uppercase',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} , ${theme.palette.primary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: '#D6EDF7',
            padding: '10px',
            borderRadius: '8px',
            display: 'inline-block',
          }}
        >
            {category.name}
          </Typography>
        </Grid>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: `${mapHeight}px`,
            maxWidth: '600px', // Adjust as needed
          }}
        >
          {category.activities.map((activity, index) => renderActivityCircle(activity, index, totalActivities))}
        </Box>
      </Grid>
    );
  };

  return (
    <Container sx={{ flexGrow: 1, p: 3 }}>
      <Box
      sx={{
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center 0px',
        height: '40%',
        minHeight: '800px',
        backgroundImage: backgroundImages[selectedCategory.id],
        position: 'relative',
        paddingTop: '20px',
      }}
    >
        <Grid container spacing={2} direction="column" alignItems="center">
          <Grid item container direction="row" justifyContent="center" spacing={2}>
            {renderCategoryButtons()}
          </Grid>
          <Grid item xs={12} md={30}>
            {renderCategory(selectedCategory)}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LevelMap;
