import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import Icon from "./components/Icon";

export default function App() {
  const [droppedBlocks, setDroppedBlocks] = useState([]);
  const [triggeredEvent, setTriggeredEvent] = useState(null);

  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData("blockType", blockType);
  };

  const handleDrop = (blockType) => {
    setDroppedBlocks((prev) => [...prev, blockType]);
  };

  const handleEventTrigger = (event) => {
    console.log("event triggered", event);
    setTriggeredEvent(null);
    setTimeout(() => setTriggeredEvent(event), 0);
  };

  return (
    <div className="relative bg-blue-100 pt-1 font-sans">
      <div className="">
        <button
          onClick={() => handleEventTrigger("whenFlagClicked")}
        >
          <Icon name="flag" size={15} className="text-green-600 mx-2" />
        </button>
        {/* <button
          className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
          onClick={() => handleEventTrigger("whenSpriteClicked")}
        >
          Sprite Clicked
        </button> */}
      </div>
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar onDragStart={handleDragStart} />
          <MidArea onDrop={handleDrop} />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea droppedBlocks={droppedBlocks} triggeredEvent={triggeredEvent} />
        </div>
      </div>

    </div>
  );
}
