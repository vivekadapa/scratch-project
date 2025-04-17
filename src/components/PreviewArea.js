import React, { useEffect, useState, useRef } from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ droppedBlocks, triggeredEvent }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const positionRef = useRef(position);
  const rotationRef = useRef(rotation);
  const [bubble, setBubble] = useState(null);


  useEffect(() => {
    positionRef.current = position;
    rotationRef.current = rotation;
  }, [position, rotation]);

  useEffect(() => {
    if (!triggeredEvent) return;

    const runBlocks = async () => {
      let repeatCount = 1;
      for (let i = 0; i < droppedBlocks.length; i++) {
        const block = droppedBlocks[i];

        if (block.type === "repeat" && triggeredEvent === "whenFlagClicked") {
          repeatCount = Number(block.value);
          continue;
        }

        for (let r = 0; r < repeatCount; r++) {
          if (block.type === "moveSteps" && triggeredEvent === "whenFlagClicked") {
            setPosition((prev) => ({ ...prev, x: prev.x + Number(block.value) }));
          } else if (block.type === "turnLeft" && triggeredEvent === "whenFlagClicked") {
            setRotation((prev) => prev - Number(block.value));
          } else if (block.type === "turnRight" && triggeredEvent === "whenFlagClicked") {
            setRotation((prev) => prev + Number(block.value));
          } else if (block.type === "goToPosition" && triggeredEvent === "whenFlagClicked") {
            setPosition({ x: Number(block.value.x), y: Number(block.value.y) });
          } else if (block.type === "say" && triggeredEvent === "whenFlagClicked") {
            setBubble({ type: "say", text: block.value.text });
            await new Promise((res) => setTimeout(res, Number(block.value.duration) * 1000));
            setBubble(null);
          } else if (block.type === "think" && triggeredEvent === "whenFlagClicked") {
            setBubble({ type: "think", text: block.value.text });
            await new Promise((res) => setTimeout(res, Number(block.value.duration) * 1000));
            setBubble(null);
          }

          await new Promise((res) => setTimeout(res, 100));
        }

        repeatCount = 1;
      }
    };

    runBlocks();
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
        <div className="relative">
          <CatSprite />
          {bubble && (
            <div
              className={`absolute left-[60px] top-[10px] px-3 py-2 rounded-xl text-white text-sm ${bubble.type === "say" ? "bg-pink-500" : "bg-pink-300"
                }`}
            >
              {bubble.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
