import React, { useRef, useEffect } from "react";
import { Typography } from "@mui/material"; // Import Typography from Material-UI

const AlphariddimsVisualizerCircle = ({ sequence, letter, currentBeat }) => {
  const imageRefs = useRef([]);
  const lastElementRef = useRef(null);

  useEffect(() => {
    imageRefs.current = new Array(sequence.length).fill(null);
  }, [sequence.length]);

  useEffect(() => {
    const element =
      imageRefs.current[(currentBeat - 1 + sequence.length) % sequence.length];
    const lastElement = lastElementRef.current;

    if (lastElement) {
      lastElement.style.transition = "all 0.1s ease-in-out";
      lastElement.style.backgroundColor = "transparent";
      lastElement.style.transform = "scale(1)";
      lastElement.style.border = "none";
    }

    if (element) {
      if ([1, 2, 3].includes(sequence[currentBeat - 1])) {
        element.style.transition = "all 0.05s ease-in-out";
        element.style.border = "2px solid yellow";
        element.style.transform = "scale(1.4)";
        element.style.color = "yellow";
      } else {
        element.style.transition = "all 0.05s ease-in-out";
        element.style.border = "none";
        element.style.transform = "scale(1.2)";
      }
    }

    lastElementRef.current = element;
  }, [currentBeat, sequence]);

  const getImageForSequence = (value) => {
    switch (value) {
      case 3:
        return "/alphariddims/np-bass-2.png";
      case 2:
        return "/alphariddims/np-slap-2.png";
      case 1:
        return "/alphariddims/np-tone-2.png";
      case 0:
        return "/alphariddims/transparent2.svg";
      default:
        return "/path/to/default.png";
    }
  };

  const radius = 175; // Radius of the circle

  return (
    <div
      style={{
        position: "relative",
        width: `${2 * radius}px`,
        height: `${2 * radius}px`,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "whitesmoke", // Path to your background image
        backgroundSize: "cover", // Ensures the image covers the entire circle
        margin: "0 auto",
      }}
    >
      {sequence.map((value, index) => {
        const angle = (index / sequence.length) * 2 * Math.PI - Math.PI / 2;
        const x = radius + (radius - 25) * Math.cos(angle); // Adjust for centering
        const y = radius + (radius - 25) * Math.sin(angle); // Adjust for centering

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${y - 32}px`,
              left: `${x - 40}px`,
              width: "75px",
              height: "75px",
              transition: "all 0.05s ease-in-out",
              transformOrigin: "left left",
            }}
            ref={(el) => (imageRefs.current[index] = el)}
          >
            <img
              src={getImageForSequence(value)}
              alt={`sequence-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                backgroundColor: "transparent", // Ensure the background color is transparent
                border: "none", // Optionally remove any border
              }}
            />
          </div>
        );
      })}
      <Typography
        variant="h1"
        style={{
          color: "white",
          position: "absolute",
          zIndex: 10,
          textShadow: "2px 2px 4px #000000", // Adding text shadow for visibility
        }}
      >
        {letter}
      </Typography>
    </div>
  );
};

export default AlphariddimsVisualizerCircle;
