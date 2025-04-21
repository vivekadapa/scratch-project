import React from "react";

function getBlockColor(type) {
  switch (type) {
    case "event":
      return "bg-yellow-500";
    case "motion":
      return "bg-blue-500";
    case "looks":
      return "bg-purple-500";
    case "control":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getBlockContent(block) {
  switch (block.type) {
    case "event":
      return `When ${block.value}`;
    case "motion":
      switch (block.subtype) {
        case "moveSteps":
          return `Move ${block.value} steps`;
        case "turnLeft":
          return `Turn left ${block.value} degrees`;
        case "turnRight":
          return `Turn right ${block.value} degrees`;
        case "goToPosition":
          return `Go to x:${block.value.x} y:${block.value.y}`;
        default:
          return "Unknown motion";
      }
    case "looks":
      switch (block.subtype) {
        case "say":
          return `Say "${block.value.text}" for ${block.value.duration} seconds`;
        case "think":
          return `Think "${block.value.text}" for ${block.value.duration} seconds`;
        default:
          return "Unknown look";
      }
    case "control":
      if (block.subtype === "repeat") {
        return `Repeat ${block.value} times`;
      }
      return "Unknown control";
    default:
      return "Unknown block";
  }
}

export default function MidArea({ blocks, setBlocks }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropTarget = null) => {
    e.preventDefault();
    try {
      const blockData = JSON.parse(e.dataTransfer.getData("blockData"));
      if (!blockData) return;
      if (dropTarget && dropTarget.type === "control" && dropTarget.subtype === "repeat") {
        const updateBlocksRecursively = (blocksArray) => {
          return blocksArray.map(block => {
            if (block.id === dropTarget.id) {
              return {
                ...block,
                blocks: [...(block.blocks || []), { ...blockData }]
              };
            }
            if (block.type === "control" && block.subtype === "repeat" && block.blocks) {
              return {
                ...block,
                blocks: updateBlocksRecursively(block.blocks)
              };
            }
            return block;
          });
        };

        setBlocks(updateBlocksRecursively(blocks));
      } else {
        setBlocks([...blocks, blockData]);
      }
    } catch (error) {
      console.error("Error adding block:", error);
    }
  };

  const handleBlockDragStart = (e, block) => {
    e.dataTransfer.setData("blockData", JSON.stringify(block));
  };

  const handleBlockDelete = (blockToDelete, parentBlocks = blocks, parentSetBlocks = setBlocks) => {
    const removeBlock = (blocksArray) => {
      return blocksArray.filter(block => {
        if (block.id === blockToDelete.id) return false;
        if (block.type === "control" && block.subtype === "repeat" && block.blocks) {
          block.blocks = removeBlock(block.blocks);
        }
        return true;
      });
    };

    if (parentBlocks === blocks) {
      setBlocks(removeBlock(blocks));
    } else {
      parentSetBlocks(removeBlock(parentBlocks));
    }
  };

  const renderNestedBlocks = (block) => {
    if (!block.blocks || block.blocks.length === 0) {
      return (
        <div 
          className="pl-4 py-2 mt-1 border-l-2 border-white border-dashed min-h-[2rem] transition-all duration-200"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.add('bg-orange-400', 'bg-opacity-20');
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('bg-orange-400', 'bg-opacity-20');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.classList.remove('bg-orange-400', 'bg-opacity-20');
            handleDrop(e, block);
          }}
        >
          <div className="text-white text-opacity-50 text-sm">Drag blocks here</div>
        </div>
      );
    }

    return (
      <div 
        className="pl-4 py-2 mt-1 border-l-2 border-white"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDrop(e, block);
        }}
      >
        {block.blocks.map((nestedBlock, index) => (
          renderBlock(
            nestedBlock,
            index,
            block.blocks,
            (newBlocks) => {
              const updatedBlock = { ...block, blocks: newBlocks };
              setBlocks(blocks.map(b => 
                b.id === block.id ? updatedBlock : b
              ));
            }
          )
        ))}
      </div>
    );
  };

  const renderBlock = (block, index, parentBlocks = blocks, parentSetBlocks = setBlocks) => {
    return (
      <div
        key={block.id}
        className={`${getBlockColor(block.type)} text-white px-3 py-2 rounded-lg cursor-move mb-2 select-none relative group`}
        draggable
        onDragStart={(e) => handleBlockDragStart(e, block)}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between">
          <span>{getBlockContent(block)}</span>
          <button
            className="invisible group-hover:visible text-white hover:text-red-300 px-1"
            onClick={() => handleBlockDelete(block, parentBlocks, parentSetBlocks)}
          >
            ×
          </button>
        </div>
        {block.type === "control" && block.subtype === "repeat" && renderNestedBlocks(block)}
      </div>
    );
  };

  return (
    <div 
      className="flex-1 h-full overflow-auto p-4"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e)}
    >
      <div className="flex flex-col gap-2">
        {blocks.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  );
}
