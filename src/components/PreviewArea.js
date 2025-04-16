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
    console.log("Triggered Event:", triggeredEvent);
    console.log(droppedBlocks)
    droppedBlocks.forEach((block) => {

      if (block.type === "whenFlagClicked" && triggeredEvent === "whenFlagClicked") {
        setPosition(positionRef.current);
        setRotation(rotationRef.current);
      } else if (block.type === "whenSpriteClicked" && triggeredEvent === "whenSpriteClicked") {
        setPosition((prev) => ({ ...prev, x: prev.x + 20 }));
      } else if (block.type === "moveSteps" && triggeredEvent === "whenFlagClicked") {
        setPosition((prev) => ({ ...prev, x: prev.x + Number(block.value) }));
      } else if (block.type === "turnLeft" && triggeredEvent === "whenFlagClicked") {
        setRotation((prev) => prev - Number(block.value));
      } else if (block.type === "turnRight" && triggeredEvent === "whenFlagClicked") {
        setRotation((prev) => prev + Number(block.value));
      }
      else if (block.type === "goToPosition" && triggeredEvent === "whenFlagClicked") {
        setPosition({ x: Number(block.value.x), y: Number(block.value.y) });
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
