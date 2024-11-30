import React, { useState } from "react";

export default function CalibrationSquare({ x, y, size, onClick }) {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    if (clickCount < 3) {
      setClickCount(clickCount + 1);
      onClick();
    }
  };

  const colors = [
    "rgb(255, 0, 0)", // Red
    "rgb(255, 140, 0)", // Darker Orange
    "rgb(255, 255, 0)", // Bright Yellow
    "rgb(0, 200, 0)", // Strong Green
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
        pointerEvents: clickCount >= 3 ? "none" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        color: "white",
      }}
    >
      {clickCount === 3 && "✓"}
    </div>
  );
}