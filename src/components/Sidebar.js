import React, { useState } from "react";
import Icon from "./Icon";

export default function Sidebar({ onDragStart }) {

  const [moveSteps, setMoveSteps] = useState(10);
  const [turnLeft, setTurnLeft] = useState(15);
  const [turnRight, setTurnRight] = useState(15);
  const [goToPosition, setGoToPosition] = useState({ x: 0, y: 0 });
  const [repeatCount, setRepeatCount] = useState(5);

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold"> {"Events"} </div>
      <div
        className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) => onDragStart(e, { type: "whenFlagClicked" })}
      >
        {"When "}
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
        {"clicked"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) => onDragStart(e, "whenSpriteClicked")}
      >
        {"When this sprite clicked"}
      </div>
      <div className="font-bold"> {"Motion"} </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) =>
          onDragStart(e, { type: "moveSteps", value: moveSteps })
        }
      >
        Move
        <input type="number" className="w-12 ml-2 text-black" defaultValue={moveSteps} onChange={(e) => setMoveSteps(e.target.value)} />
        steps
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) => onDragStart(e, { type: "turnLeft", value: turnLeft })}
      >
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        <input type="number" className="w-12 ml-2 text-black" defaultValue={turnLeft} onChange={(e) => setTurnLeft(e.target.value)} />
        {"degrees"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) => onDragStart(e, { type: "turnRight", value: turnRight })}
      >
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        <input type="number" className="w-12 ml-2 text-black" defaultValue={turnRight} onChange={(e) => setTurnRight(e.target.value)} />
        {"degrees"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(e) => onDragStart(e, { type: "goToPosition", value: goToPosition })}
      >
        {"Go to x:"}
        <input type="number" className="w-12 ml-2 text-black" defaultValue={goToPosition.x} onChange={(e) => setGoToPosition({...goToPosition,x:e.target.value})} />
        {"y:"}
        <input type="number" className="w-12 ml-2 text-black" defaultValue={goToPosition.y} onChange={(e) => setGoToPosition({...goToPosition,y:e.target.value})} />
      </div>
    </div>
  );
}
