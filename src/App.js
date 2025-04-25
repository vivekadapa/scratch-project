import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";
import Icon from "./components/Icon";

export default function App() {
  const [sprites, setSprites] = useState([
    { id: 1, name: 'Cat 1', type: 'cat', blocks: [], position: { x: 200, y: 200 } }
  ]);
  const [selectedSprite, setSelectedSprite] = useState(sprites[0]);

  useEffect(() => {
    const currentSprite = sprites.find(sprite => sprite.id === selectedSprite.id);
    if (currentSprite) {
      setSelectedSprite(currentSprite);
    }
  }, [sprites]);

  const [triggeredEvent, setTriggeredEvent] = useState(null);
  const [runSpriteTrigger, setRunSpriteTrigger] = useState(0);

  const handleDragStart = (e, block) => {
    e.dataTransfer.setData("blockData", JSON.stringify({
      ...block,
      id: Date.now(),
    }));
  };

  const handleBlocksUpdate = (newBlocks) => {
    setSprites(prevSprites =>
      prevSprites.map(sprite =>
        sprite.id === selectedSprite.id
          ? { ...sprite, blocks: newBlocks }
          : sprite
      )
    );
  };

  const updateSpriteBlocks = (spriteId, newBlocks) => {
    setSprites(prevSprites =>
      prevSprites.map(sprite =>
        sprite.id === spriteId
          ? { ...sprite, blocks: newBlocks }
          : sprite
      )
    );
  };

  const handleEventTrigger = (event) => {
    setTriggeredEvent(null);
    requestAnimationFrame(() => {
      setTriggeredEvent(event);
    });
  };

  const addNewSprite = () => {
    const newSprite = {
      id: Date.now(),
      name: `Cat ${sprites.length + 1}`,
      type: 'cat',
      blocks: [],
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 50 }
    };
    setSprites(prev => [...prev, newSprite]);
    setSelectedSprite(newSprite);
  };

  const selectSprite = (sprite) => {
    setSelectedSprite(sprite);
  };


  const handlePlay = () => {
    setRunSpriteTrigger(t => t + 1);
  };

  return (
    <div className="relative bg-blue-100 pt-1 font-sans">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleEventTrigger("whenFlagClicked")}
          className="text-white px-2 py-1 rounded flex items-center"
        >
          <Icon name="flag" size={15} className="text-green-600 mx-2" />
        </button>
        <button
          onClick={handlePlay}
          className="bg-[#fff8dc] bg-blue-500 text-white px-3 py-1 rounded text-sm flex items-center"
        >
          <Icon name="play" size={15} className="text-white mx-2" />
          Play
        </button>
      </div>
      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar onDragStart={handleDragStart} />
          <MidArea 
            blocks={selectedSprite.blocks} 
            setBlocks={handleBlocksUpdate}
          />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-col bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea 
            sprites={sprites} 
            triggeredEvent={triggeredEvent}
            onSpriteBlocksUpdate={updateSpriteBlocks}
            runSpriteId={selectedSprite.id}
            runSpriteTrigger={runSpriteTrigger}
          />
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Sprites</h3>
              <button 
                onClick={addNewSprite}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Add Sprite
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sprites.map(sprite => (
                <div 
                  key={sprite.id}
                  onClick={() => selectSprite(sprite)}
                  className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                    selectedSprite.id === sprite.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="w-16 h-16 relative">
                    <img src="/sprites/cat.svg" alt={sprite.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-center text-sm mt-1">{sprite.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
