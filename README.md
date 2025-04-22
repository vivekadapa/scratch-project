# Scratch Starter Project

A React-based visual programming environment inspired by Scratch, allowing users to create interactive animations and programs using drag-and-drop blocks.

## Features

- **Visual Programming Interface**: Drag-and-drop block-based programming
- **Multiple Block Types**:
  - Event blocks (Flag click, Sprite click)
  - Motion blocks (Move, Turn, Go to position)
  - Looks blocks (Say, Think)
  - Control blocks (Repeat)
- **Multiple Sprite Support**: Add and manage multiple sprites
- **Interactive Preview Area**: Real-time visualization of your program
- **Sprite Collision Detection**: Automatic detection and handling of sprite collisions
- **Block Nesting**: Support for nested blocks in repeat loops


### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scratch-starter-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Creating Programs**:
   - Drag blocks from the left sidebar into the middle area
   - Blocks can be arranged in sequence
   - Use the repeat block to create loops

2. **Working with Sprites**:
   - Click "Add Sprite" to create new sprites
   - Select a sprite to edit its program
   - Each sprite can have its own set of blocks

3. **Running Programs**:
   - Click the green flag to run all sprite programs
   - Click on sprites to trigger their sprite-click events
   - Drag sprites in the preview area to reposition them

## Block Types

### Events
- **When Flag Clicked**: Triggers when the green flag is clicked
- **When Sprite Clicked**: Triggers when the sprite is clicked

### Motion
- **Move Steps**: Move sprite forward by specified steps
- **Turn Left/Right**: Rotate sprite by specified degrees
- **Go to Position**: Move sprite to specific x,y coordinates

### Looks
- **Say**: Display a speech bubble with text for specified duration
- **Think**: Display a thought bubble with text for specified duration

### Control
- **Repeat**: Execute contained blocks multiple times

## Technical Details

Built with:
- React
- TailwindCSS
- HTML5 Canvas
- Webpack

