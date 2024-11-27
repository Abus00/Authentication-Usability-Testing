import React, { useState } from "react";

export default function CalibrationSquare({ x, y, size, onClick }) {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    if (clickCount < 3) {
      setClickCount(clickCount + 1);
      onClick();
    }
  };

  // Calculate the color transition from red to orange to yellow to green
  const colors = [
    "rgb(255, 0, 0)", // Red
    "rgb(255, 165, 0)", // Orange
    "rgb(255, 255, 0)", // Vibrant Yellow
    "rgb(0, 255, 0)", // Strong Green
  ];
  const color = colors[clickCount];

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: size,
        height: size,
        backgroundColor: color,
        border: "2px solid black",
        cursor: clickCount < 3 ? "pointer" : "default",
        pointerEvents: clickCount >= 3 ? "none" : "auto", // Disable clicking after 4 clicks
      }}
    />
  );
}