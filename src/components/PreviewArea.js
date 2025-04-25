import React, { useEffect, useState, useRef } from "react";

export default function PreviewArea({ sprites, triggeredEvent, onSpriteBlocksUpdate, runSpriteId, runSpriteTrigger }) {
  const canvasRef = useRef(null);
  const spritesRef = useRef(new Map());
  const [collidedPairs, setCollidedPairs] = useState(new Set());
  const runningExecutions = useRef({});
  const runningAllSprites = useRef(false);

  const cancelExecution = (spriteId) => {
    if (runningExecutions.current[spriteId]) {
      runningExecutions.current[spriteId].cancelled = true;
    }
  };

  const runBlocksImmediate = async (spriteId, eventType) => {
    const spriteState = spritesRef.current.get(spriteId);
    if (!spriteState) return;
    cancelExecution(spriteId);
    const execToken = { cancelled: false };
    runningExecutions.current[spriteId] = execToken;
    const blocks = spriteState.previewBlocks || spriteState.blocks;
    const eventBlock = blocks.find(block => block.type === "event" && block.value === eventType);
    if (!eventBlock) return;
    const blockIndex = blocks.indexOf(eventBlock);
    const blocksToExecute = blocks.slice(blockIndex + 1);
    for (const block of blocksToExecute) {
      if (execToken.cancelled) return;
      if (block.type === "event") break;
      if (block.type === "control" && block.subtype === "repeat") {
        const count = Math.max(1, Number(block.value) || 0);
        for (let i = 0; i < count; i++) {
          if (Array.isArray(block.blocks)) {
            for (const nestedBlock of block.blocks) {
              if (execToken.cancelled) return;
              await executeBlock(nestedBlock, spriteState);
              await new Promise(res => setTimeout(res, 50));
            }
          }
          await new Promise(res => setTimeout(res, 100));
        }
      } else {
        await executeBlock(block, spriteState);
        await new Promise(res => setTimeout(res, 100));
      }
      drawCanvas();
    }
  };

  const swapAnimations = async (id1, id2) => {
    const spriteState1 = spritesRef.current.get(id1);
    const spriteState2 = spritesRef.current.get(id2);
    if (!spriteState1 || !spriteState2) return;

    cancelExecution(id1);
    cancelExecution(id2);

    const reverseStateBlocks = (blocks) =>
      blocks.map(block => {
        if (block.type === "motion") {
          if (block.subtype === "moveSteps") {
            return { ...block, value: -Number(block.value) };
          }
          if (block.subtype === "turnLeft") {
            return { ...block, subtype: "turnRight", value: Number(block.value) };
          }
          if (block.subtype === "turnRight") {
            return { ...block, subtype: "turnLeft", value: Number(block.value) };
          }
        }
        if (block.type === "control" && block.subtype === "repeat" && block.blocks) {
          return { ...block, blocks: reverseStateBlocks(block.blocks) };
        }
        return block;
      });

    spriteState1.previewBlocks = reverseStateBlocks(spriteState1.blocks || []);
    spriteState2.previewBlocks = reverseStateBlocks(spriteState2.blocks || []);

    // Execute reverse actions sequentially
    await runBlocksImmediate(id1, "whenFlagClicked");
    await runBlocksImmediate(id2, "whenFlagClicked");
  };

  const drawCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    spritesRef.current.forEach((spriteState, id) => {
      const { img, position, rotation, bubble } = spriteState;
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );
      ctx.restore();
      if (bubble) {
        ctx.fillStyle = "#8b5cf6";
        ctx.beginPath();
        ctx.roundRect(position.x + 60, position.y - 40, 150, 40, 10);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText(bubble.text, position.x + 70, position.y - 15);
      }
    });
    checkCollisions();
  };

  useEffect(() => {
    sprites.forEach(sprite => {
      if (!spritesRef.current.has(sprite.id)) {
        const img = new Image();
        img.src = '/sprites/cat.svg';
        img.onload = () => {
          spritesRef.current.set(sprite.id, {
            img,
            position: sprite.position,
            rotation: 0,
            bubble: null,
            id: sprite.id,
            blocks: JSON.parse(JSON.stringify(sprite.blocks)),
          });
          drawCanvas();
        };
      } else {
        const spriteState = spritesRef.current.get(sprite.id);
        spriteState.blocks = JSON.parse(JSON.stringify(sprite.blocks));
      }
    });
  }, [sprites]);

  const checkCollisions = () => {
    if (!runningAllSprites.current) return;
    const newCollidedPairs = new Set();
    Array.from(spritesRef.current.entries()).forEach(([id1, sprite1]) => {
      Array.from(spritesRef.current.entries()).forEach(([id2, sprite2]) => {
        if (id1 >= id2) return;
        const dx = sprite1.position.x - sprite2.position.x;
        const dy = sprite1.position.y - sprite2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const collisionThreshold = (sprite1.img.width + sprite2.img.width) / 4;
        if (distance < collisionThreshold) {
          const pairKey = `${id1},${id2}`;
          newCollidedPairs.add(pairKey);
          if (!collidedPairs.has(pairKey)) {
            swapAnimations(id1, id2);
          }
        }
      });
    });
    setCollidedPairs(newCollidedPairs);
  };

  useEffect(() => {
    if (!triggeredEvent) return;
    runningAllSprites.current = triggeredEvent === "whenFlagClicked";
    sprites.forEach(sprite => {
      const spriteState = spritesRef.current.get(sprite.id);
      if (spriteState) {
        spriteState.bubble = null;
      }
    });
    drawCanvas();
    const executeAll = async () => {
      await Promise.all(
        sprites.map(sprite => executeBlocks(sprite, triggeredEvent))
      );
      runningAllSprites.current = false;
    };
    executeAll();
  }, [triggeredEvent]);

  useEffect(() => {
    if (!runSpriteTrigger) return;
    if (!runSpriteId) return;
    const sprite = sprites.find(s => s.id === runSpriteId);
    if (!sprite) return;
    const spriteState = spritesRef.current.get(runSpriteId);
    if (spriteState) spriteState.bubble = null;
    drawCanvas();
    const executeAllBlocks = async () => {
      await executeBlocks(sprite, "whenFlagClicked");
    };
    executeAllBlocks();
  }, [runSpriteTrigger]);

  const executeBlocks = async (sprite, eventType) => {
    const spriteState = spritesRef.current.get(sprite.id);
    if (!spriteState) return;

    const blocks = spriteState.previewBlocks || sprite.blocks;
    const eventBlock = blocks.find(block => block.type === "event" && block.value === eventType);
    if (!eventBlock) return;

    const blockIndex = blocks.indexOf(eventBlock);
    const blocksToExecute = blocks.slice(blockIndex + 1);

    for (const block of blocksToExecute) {
      if (block.type === "event") {
        break;
      }

      if (block.type === "control" && block.subtype === "repeat") {
        const count = Math.max(1, Number(block.value) || 0);

        for (let i = 0; i < count; i++) {
          if (Array.isArray(block.blocks)) {
            for (const nestedBlock of block.blocks) {
              await executeBlock(nestedBlock, spriteState);
              await new Promise(res => setTimeout(res, 50));
            }
          }
          await new Promise(res => setTimeout(res, 100));
        }
      } else {
        await executeBlock(block, spriteState);
        await new Promise(res => setTimeout(res, 100));
      }
      drawCanvas();
    }
  };

  const executeBlock = async (block, spriteState) => {
    if (!block || !spriteState) return;

    switch (block.type) {
      case "motion":
        switch (block.subtype) {
          case "moveSteps":
            const radians = (spriteState.rotation * Math.PI) / 180;
            spriteState.position.x += Math.cos(radians) * Number(block.value);
            spriteState.position.y += Math.sin(radians) * Number(block.value);
            spriteState.position.x = Math.max(0, Math.min(canvasRef.current.width, spriteState.position.x));
            spriteState.position.y = Math.max(0, Math.min(canvasRef.current.height, spriteState.position.y));
            break;
          case "turnLeft":
            spriteState.rotation -= Number(block.value);
            break;
          case "turnRight":
            spriteState.rotation += Number(block.value);
            break;
          case "goToPosition":
            spriteState.position.x = Math.max(0, Math.min(canvasRef.current.width, Number(block.value.x)));
            spriteState.position.y = Math.max(0, Math.min(canvasRef.current.height, Number(block.value.y)));
            break;
        }
        break;
      case "looks":
        switch (block.subtype) {
          case "say":
            spriteState.bubble = { type: "say", text: block.value.text };
            drawCanvas();
            await new Promise((res) => setTimeout(res, Number(block.value.duration) * 1000));
            spriteState.bubble = null;
            break;
          case "think":
            spriteState.bubble = { type: "think", text: block.value.text };
            drawCanvas();
            await new Promise((res) => setTimeout(res, Number(block.value.duration) * 1000));
            spriteState.bubble = null;
            break;
        }
        break;
    }

    drawCanvas();
    await new Promise((res) => setTimeout(res, 100));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let draggedSpriteId = null;
    let offsetX = 0;
    let offsetY = 0;

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spritesRef.current.forEach((spriteState, id) => {
        const { img, position } = spriteState;
        const halfWidth = img.width / 2;
        const halfHeight = img.height / 2;
        if (
          x >= position.x - halfWidth &&
          x <= position.x + halfWidth &&
          y >= position.y - halfHeight &&
          y <= position.y + halfHeight
        ) {
          draggedSpriteId = id;
          offsetX = x - position.x;
          offsetY = y - position.y;
        }
      });
    };

    const handleMouseMove = (e) => {
      if (!draggedSpriteId) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const spriteState = spritesRef.current.get(draggedSpriteId);
      if (spriteState) {
        spriteState.position = {
          x: Math.max(0, Math.min(canvas.width, x - offsetX)),
          y: Math.max(0, Math.min(canvas.height, y - offsetY))
        };
        drawCanvas();
      }
    };

    const handleMouseUp = () => {
      draggedSpriteId = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [sprites]);

  const handleSpriteClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spritesRef.current.forEach((spriteState, id) => {
      const { img, position } = spriteState;
      const halfWidth = img.width / 2;
      const halfHeight = img.height / 2;

      if (
        x >= position.x - halfWidth &&
        x <= position.x + halfWidth &&
        y >= position.y - halfHeight &&
        y <= position.y + halfHeight
      ) {
        const clickedSprite = sprites.find(s => s.id === id);
        if (clickedSprite) {
          executeBlocks(clickedSprite, "whenSpriteClicked");
        }
      }
    });
  };

  return (
    <div className="flex-1 p-2">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-gray-300 rounded-lg cursor-grab active:cursor-grabbing"
        onClick={handleSpriteClick}
      />
    </div>
  );
}
