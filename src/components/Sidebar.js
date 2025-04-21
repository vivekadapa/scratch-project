import React, { useState } from "react";
import Icon from "./Icon";

export default function Sidebar({ onDragStart }) {
  const [moveSteps, setMoveSteps] = useState(10);
  const [turnLeft, setTurnLeft] = useState(15);
  const [turnRight, setTurnRight] = useState(15);
  const [goToPosition, setGoToPosition] = useState({ x: 0, y: 0 });
  const [repeatCount, setRepeatCount] = useState(5);
  const [think, setThink] = useState({ text: "Hmm...", duration: 2 });
  const [say, setSay] = useState({ text: "Hi!", duration: 2 });

  const handleBlockDragStart = (e, blockData) => {
    const block = {
      ...blockData,
      id: Date.now(),
      type: blockData.type || 'event',
      subtype: blockData.subtype,
      value: blockData.value
    };

    onDragStart(e, block);
  };

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold"> {"Events"} </div>
      <div
        className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) => handleBlockDragStart(e, { type: "event", value: "whenFlagClicked" })}
      >
        {"When "}
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
        {"clicked"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) => handleBlockDragStart(e, { type: "event", value: "whenSpriteClicked" })}
      >
        {"When this sprite clicked"}
      </div>

      <div className="font-bold"> {"Motion"} </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) =>
          handleBlockDragStart(e, { type: "motion", subtype: "moveSteps", value: moveSteps })
        }
      >
        Move
        <input 
          type="number" 
          className="w-12 mx-2 text-black px-1" 
          value={moveSteps}
          onChange={(e) => setMoveSteps(parseInt(e.target.value))}
          onDragStart={(e) => e.stopPropagation()}
        />
        steps
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) => handleBlockDragStart(e, { type: "motion", subtype: "turnLeft", value: turnLeft })}
      >
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        <input 
          type="number" 
          className="w-12 mx-2 text-black px-1" 
          value={turnLeft}
          onChange={(e) => setTurnLeft(parseInt(e.target.value))}
          onDragStart={(e) => e.stopPropagation()}
        />
        {"degrees"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) => handleBlockDragStart(e, { type: "motion", subtype: "turnRight", value: turnRight })}
      >
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        <input 
          type="number" 
          className="w-12 mx-2 text-black px-1" 
          value={turnRight}
          onChange={(e) => setTurnRight(parseInt(e.target.value))}
          onDragStart={(e) => e.stopPropagation()}
        />
        {"degrees"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) => handleBlockDragStart(e, { type: "motion", subtype: "goToPosition", value: goToPosition })}
      >
        {"Go to x:"}
        <input 
          type="number" 
          className="w-12 mx-1 text-black px-1" 
          value={goToPosition.x}
          onChange={(e) => setGoToPosition({ ...goToPosition, x: parseInt(e.target.value) })}
          onDragStart={(e) => e.stopPropagation()}
        />
        {"y:"}
        <input 
          type="number" 
          className="w-12 mx-1 text-black px-1" 
          value={goToPosition.y}
          onChange={(e) => setGoToPosition({ ...goToPosition, y: parseInt(e.target.value) })}
          onDragStart={(e) => e.stopPropagation()}
        />
      </div>

      <div className="font-bold"> {"Control"} </div>
      <div
        className="flex flex-row flex-wrap bg-red-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) =>
          handleBlockDragStart(e, { 
            type: "control", 
            subtype: "repeat",
            value: repeatCount,
            blocks: []
          })
        }
      >
        <div className="flex items-center">
          <span>Repeat</span>
          <input
            type="number"
            min="1"
            className="w-12 mx-2 text-black px-1"
            value={repeatCount}
            onChange={(e) => setRepeatCount(Math.max(1, parseInt(e.target.value) || 1))}
            onDragStart={(e) => e.stopPropagation()}
          />
          <span>times</span>
        </div>
      </div>

      <div className="font-bold mt-2"> {"Looks"} </div>
      <div
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) =>
          handleBlockDragStart(e, {
            type: "looks",
            subtype: "say",
            value: { text: say.text, duration: say.duration }
          })
        }
      >
        Say
        <input
          type="text"
          className="mx-1 text-black px-1 w-20"
          value={say.text}
          onChange={(e) => setSay({...say, text: e.target.value})}
          onDragStart={(e) => e.stopPropagation()}
        />
        for
        <input
          type="number"
          className="mx-1 w-10 text-black px-1"
          value={say.duration}
          onChange={(e) => setSay({...say, duration: parseInt(e.target.value)})}
          onDragStart={(e) => e.stopPropagation()}
        />
        secs
      </div>
      <div
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) =>
          handleBlockDragStart(e, {
            type: "looks",
            subtype: "think",
            value: { text: think.text, duration: think.duration }
          })
        }
      >
        Think
        <input
          type="text"
          className="mx-1 text-black px-1 w-20"
          value={think.text}
          onChange={(e) => setThink({...think, text: e.target.value})}
          onDragStart={(e) => e.stopPropagation()}
        />
        for
        <input
          type="number"
          className="mx-1 w-10 text-black px-1"
          value={think.duration}
          onChange={(e) => setThink({...think, duration: parseInt(e.target.value)})}
          onDragStart={(e) => e.stopPropagation()}
        />
        secs
      </div>
    </div>
  );
}
