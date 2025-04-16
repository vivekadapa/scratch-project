import React, { useState } from "react";
import Icon from "./Icon";

const blockStyles = {
  whenFlagClicked: "flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  whenSpriteClicked: "flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  move10Steps: "flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  turnLeft15: "flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
  turnRight15: "flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer",
};

export default function MidArea({ onDrop }) {
  const [blocks, setBlocks] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData("blockType");
    setBlocks((prevBlocks) => [...prevBlocks, blockType]);
    onDrop(blockType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="flex-1 h-full overflow-auto border border-gray-300"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {blocks.map((block, index) => (
        <div key={index} className={blockStyles[block]}>
          {block === "whenFlagClicked" && (
            <>
              {"When "}
              <Icon name="flag" size={15} className="text-green-600 mx-2" />
              {"clicked"}
            </>
          )}
          {block === "whenSpriteClicked" && "When this sprite clicked"}
          {block === "move10Steps" && "Move 10 steps"}
          {block === "turnLeft15" && (
            <>
              {"Turn "}
              <span className="text-white mx-2">↺</span>
              {"15 degrees"}
            </>
          )}
          {block === "turnRight15" && (
            <>
              {"Turn "}
              <span className="text-white mx-2">↻</span>
              {"15 degrees"}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
