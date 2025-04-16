import React, { useEffect, useState, useRef } from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ droppedBlocks, triggeredEvent }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const positionRef = useRef(position);
  const rotationRef = useRef(rotation);

  useEffect(() => {
    positionRef.current = position;
    rotationRef.current = rotation;
  }, [position, rotation]);

  useEffect(() => {
    if (!triggeredEvent) return;

    droppedBlocks.forEach((block) => {
      
      if (block === "whenFlagClicked" && triggeredEvent === "whenFlagClicked") {
        setPosition(positionRef.current);
        setRotation(rotationRef.current);
      } else if (block === "whenSpriteClicked" && triggeredEvent === "whenSpriteClicked") {
        setPosition((prev) => ({ ...prev, x: prev.x + 20 }));
      } else if (block === "move10Steps" && triggeredEvent === "whenFlagClicked") {
        setPosition((prev) => ({ ...prev, x: prev.x + 10 }));
      } else if (block === "turnLeft15" && triggeredEvent === "whenFlagClicked") {
        setRotation((prev) => prev - 15);
      } else if (block === "turnRight15" && triggeredEvent === "whenFlagClicked") {
        setRotation((prev) => prev + 15);
      }
    });
  }, [droppedBlocks, triggeredEvent]);

  useEffect(() => {
    console.log(position, rotation)
  }, [position, rotation])

  return (
    <div className="flex-none w-full h-full overflow-y-auto p-2">
      <div
        style={{
          width: 'fit-content',
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
          transformOrigin: "center center",
        }}
      >
        <CatSprite />
      </div>
    </div>
  );
}
