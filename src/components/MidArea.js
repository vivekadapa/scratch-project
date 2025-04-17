import React, { useEffect, useState } from "react";
import Icon from "./Icon";

const blockStyles = {
  whenFlagClicked: "flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  whenSpriteClicked: "flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  moveSteps: "flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  turnLeft: "flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  turnRight: "flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  goToPosition: "flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  repeat: "flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  say: "flex flex-row flex-wrap bg-pink-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  think: "flex flex-row flex-wrap bg-pink-300 text-white px-2 py-1 my-2 text-sm cursor-pointer",

};

export default function MidArea({ onDrop }) {
  const [blocks, setBlocks] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    console.log(e.dataTransfer.getData("blockData"));
    const blockData = JSON.parse(e.dataTransfer.getData("blockData"));
    setBlocks((prevBlocks) => [...prevBlocks, blockData]);
    onDrop(blockData);
  };
  console.log(blocks)

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log(blocks)
  }, [blocks])

  return (
    <div
      className="flex-1 h-full overflow-auto border border-gray-300"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {blocks.map((block, index) => (
        <div key={index} className={blockStyles[block.type]}>
          {block.type === "whenFlagClicked" && (
            <>
              {"When "}
              <Icon name="flag" size={15} className="text-green-600 mx-2" />
              {"clicked"}
            </>
          )}
          {block.type === "whenSpriteClicked" && "When this sprite clicked"}
          {block.type === "moveSteps" && `Move ${block.value} steps`}
          {block.type === "turnLeft" && (
            <>
              {"Turn "}
              <span className="text-white mx-2">↺</span>
              {`${block.value} degrees`}
            </>
          )}
          {block.type === "turnRight" && (
            <>
              {"Turn "}
              <span className="text-white mx-2">↻</span>
              {`${block.value} degrees`}
            </>
          )}
          {block.type === "goToPosition" && (
            <>
              {"Go to x:"}
              `{block.value.x}`
              {"y:"}
              `{block.value.y}`
            </>
          )}
          {block.type === "repeat" && `Repeat ${block.value} times`}
          {block.type === "say" && `Say "${block.value.text}" for ${block.value.duration} sec`}
          {block.type === "think" && `Think "${block.value.text}" for ${block.value.duration} sec`}
        </div>
      ))}
    </div>
  );
}
