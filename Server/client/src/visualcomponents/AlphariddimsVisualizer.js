import React, { useRef, useEffect } from "react";

const AlphariddimsVisualizer = ({ sequence, currentBeat }) => {
  const imageRefs = useRef([]);
  const lastElementRef = useRef(null);

  useEffect(() => {
    imageRefs.current = new Array(sequence.length).fill(null);
  }, [sequence.length]);

  useEffect(() => {
    const element = imageRefs.current[
      (currentBeat - 1 + sequence.length) % sequence.length
    ];
    const lastElement = lastElementRef.current;

    if (lastElement) {
      lastElement.style.transition = "all 0.1s ease-in-out";
      lastElement.style.backgroundColor = "white";
      lastElement.style.width = "80%";
      lastElement.style.height = "80%";
      lastElement.style.border = "none";
    }

    if (element) {
      if (sequence[currentBeat - 1] === 1) {
        element.style.transition = "all 0.05s ease-in-out";
        element.style.border = "2px blue";
        element.style.width = "180%";
        element.style.color = "yellow";
        element.style.height = "180%";
      } else {
        element.style.transition = "all 0.05s ease-in-out";
        element.style.border = "none";
        element.style.width = "120%";
        element.style.height = "120%";
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
        return "/musicalNotation/sixteenNoteSilence.jpg";
      default:
        return "/path/to/default.png";
    }
  };

  return (
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
  );
};

export default AlphariddimsVisualizer;
