import React, { useEffect, useRef, useState } from 'react';
import { bounded, Engine, GridScene } from '@metal-pony/bucket-js';
import Page from '../page/Page';
import classNames from 'classnames';

const scene = new GridScene({
  name: 'main',
  dims: {
    cellSize: 12,
    width: 32,
    height: 32
  },
  bgColorCode: '#ffffff88',
  showGrid: true,
  gridProps: {
    colorCode: '#00ff00aa',
    sizeCells: 4
  }
});

const transparent = '#00000000';
const palette = [
  '#172038','#253a5e','#3c5e8b','#4f8fba','#73bed3','#a4dddb',
  '#19332d','#25562e','#468232','#75a743','#a8ca58','#d0da91',
  '#4d2b32','#7a4841','#ad7757','#c09473','#d7b594','#e7d5b3',
  '#341c27','#602c2c','#884b2b','#be772b','#de9e41','#e8c170',
  '#241527','#411d31','#752438','#a53030','#cf573c','#da863e',
  '#1e1d39','#402751','#7a367b','#a23e8c','#c65197','#df84a5',
  '#090a14','#10141f','#151d28','#202e37','#394a50','#577277',
  '#819796','#a8b5b2','#c7cfcc','#ebede9',transparent
];
const initialColor = palette[42];

const engine = new Engine();
engine.addScene(scene);

/**
 *
 * @param {React.RefObject<HTMLCanvasElement>} previewCanvasRef
 */
function drawPreview(previewCanvasRef) {
  if (previewCanvasRef.current) {
    // Draw each pixel of the preview canvas taken from the scene cell data
    const previewCanvas = previewCanvasRef.current;
    const previewCtx = previewCanvas.getContext('2d');
    previewCanvas.width = scene.cols;
    previewCanvas.height = scene.rows;
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    for (const cellRow of scene.cells) {
      for (const cell of cellRow) {
        previewCtx.fillStyle = cell.data.color;
        previewCtx.fillRect(cell.x, cell.y, 1, 1);
      }
    }
  }
}

/**
 *
 * @param {React.RefObject<HTMLCanvasElement>} previewCanvasRef
 * @param {number} x
 * @param {number} y
 * @param {string} color
 */
function drawPreviewPixel(previewCanvasRef, x, y, color) {
  if (previewCanvasRef.current) {
    const previewCanvas = previewCanvasRef.current;
    const previewCtx = previewCanvas.getContext('2d');
    previewCtx.clearRect(x, y, 1, 1);
    previewCtx.fillStyle = color;
    previewCtx.fillRect(x, y, 1, 1);
  }
}

/**
 *
 * @param {object} props
 */
export function Game({}) {
  /** @type {React.RefObject<HTMLCanvasElement>}*/
  const canvasRef = useRef(null);
  /** @type {React.RefObject<HTMLCanvasElement>}*/
  const previewCanvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [cellSize, setCellSize] = useState(scene.cellSize);
  const [gridWidth, setGridWidth] = useState(scene.cols);
  const [gridHeight, setGridHeight] = useState(scene.rows);
  const [showGrid, setShowGrid] = useState(scene.showGrid);
  const [tool, setTool] = useState('pencil');

  useEffect(() => {
    const canvas = canvasRef?.current;
    let isDragging = false;

    canvas.onclick = (ev) => {
      // When SHIFT is held, restart the scene
      if (ev.shiftKey) {
        console.log('Restarting scene');
        engine.resetScene();
      } else {
        // Get the cell that was clicked
        const rect = canvas.getBoundingClientRect();
        let x = bounded(Math.floor((ev.clientX - rect.left) / scene.cellSize), 0, scene.cols - 1);
        let y = bounded(Math.floor((ev.clientY - rect.top) / scene.cellSize), 0, scene.rows - 1);

        if (tool === 'fill') {
          const prevColor = scene.cellData(x, y).color;
          if (prevColor === selectedColor) return;

          const queue = [{x,y}];
          let count = 0;
          let max = scene.cols * scene.rows;
          while (queue.length > 0 && count < max) {
            ({ x, y } = queue.shift());
            if (x < 0 || y < 0 || x >= scene.cols || y >= scene.rows) continue;

            const cd = scene.cellData(x, y);
            const c = cd.color;
            if (c !== prevColor) continue;

            count++;
            cd.color = selectedColor;
            drawPreviewPixel(previewCanvasRef, x, y, selectedColor);

            queue.push({ x, y: y - 1 });
            queue.push({ y, x: x - 1 });
            queue.push({ x, y: y + 1 });
            queue.push({ y, x: x + 1 });
          }
        } else if (tool === 'pencil') {
          scene.cellData(x, y).color = selectedColor;
          drawPreviewPixel(previewCanvasRef, x, y, selectedColor);
        } else if (tool === 'eraser') {
          scene.cellData(x, y).color = transparent;
        }

        engine.render();
      }
    }

    // Used during mouse movent to determine if repainting is necessary
    const lastCoord = { x: 0, y: -1 };
    window.onmousedown = (ev) => {
      if (ev.button === 0) isDragging = true;
    }
    // Stop dragging when the mouse is released outside the canvas
    window.onmouseup = (ev) => {
      if (ev.button === 0) {
        isDragging = false;
        lastCoord.x = 0;
        lastCoord.y = -1;
      }
    }

    // When the mouse moves, if dragging, set the color of the cell that is hovered over
    canvas.onmousemove = (ev) => {
      if (tool === 'fill') return;
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = bounded(Math.floor((ev.clientX - rect.left) / scene.cellSize), 0, scene.cols - 1);
        const y = bounded(Math.floor((ev.clientY - rect.top) / scene.cellSize), 0, scene.rows - 1);

        // Prevent drag on same cell from rapidly rerendering unneccessarily
        if (x === lastCoord.x && y === lastCoord.y) {
          return;
        }
        lastCoord.x = x;
        lastCoord.y = y;

        let newColor = selectedColor;
        if (tool === 'eraser') {
          newColor = transparent;
        }

        scene.cellData(x, y).color = newColor;
        drawPreviewPixel(previewCanvasRef, x, y, newColor);
        engine.render();
      }
    }

    // Prevent context menu from appearing
    canvas.oncontextmenu = (ev) => {
      ev.preventDefault();
    };

    engine.connect(canvas);
    engine.switchToScene('main');
    engine.start();

    return () => {
      engine.stop();
      engine.shutdown();
    };
  }, [selectedColor, tool]);

  const paletteColorsPerRow = 6;
  const paletteRows = palette.reduce((acc, color, i) => {
    if (i % paletteColorsPerRow === 0) {
      acc.push([]);
    }
    acc[acc.length - 1].push(color);
    return acc;
  }, []);

  window.onload = () => {
    console.log('Window loaded');
    drawPreview(previewCanvasRef);
  };


  /**
   * @param {string} toolName
   * @param {string} iconClasses
   */
  const createToolButton = (toolName, iconClasses) => (
    <div
      className={
        classNames('center border-2 items-center', {
          'border-primary': tool === toolName,
          'bg-primary': tool === toolName,
          'bg-light': tool !== toolName
        })
      }
      style={{ width: '32px', height: '32px' }}
      onClick={() => { setTool(toolName); }}
    >
      <i className={iconClasses} style={{color: 'black'}}></i>
    </div>
  );

  return (
    <Page includeGoats={false} includeNav={false}>
      <div className='pt----- flex-horizontal col-gap--'>
        {/* Left-side controls panel */}
        <div className='flex-vertical row-gap--'>
          {/* Grid Size */}
          <div className='flex-horizontal right'>
            <label htmlFor='cellSize'>Cell Size: </label>
            <input
              type='number'
              id='cellSize'
              value={cellSize}
              min={8} max={64} step={1}
              onChange={(ev) => {
                const size = parseInt(ev.target.value);
                setCellSize(size);
                scene.cellSize = size;
                engine.renderWithResize();
              }}
            />
          </div>
          <div className='flex-horizontal right'>
            <label htmlFor='gridWidth'>Width: </label>
            <input
              type='number'
              id='gridWidth'
              value={gridWidth}
              min={1} max={256} step={1}
              onChange={(ev) => {
                const size = parseInt(ev.target.value);
                setGridWidth(size);
                scene.cols = size;
                engine.renderWithResize();
                drawPreview(previewCanvasRef);
              }}
            />
          </div>
          <div className='flex-horizontal right'>
            <label htmlFor='gridHeight'>Height: </label>
            <input
              type='number'
              id='gridHeight'
              value={gridHeight}
              min={1} max={256} step={1}
              onChange={(ev) => {
                const size = parseInt(ev.target.value);
                setGridHeight(size);
                scene.rows = size;
                engine.renderWithResize();
                drawPreview(previewCanvasRef);
              }}
            />
          </div>
          <div className='flex-horizontal right'>
            <label htmlFor='showGrid'>Show Grid:</label>
            <input
              type='checkbox'
              id='showGrid'
              checked={showGrid}
              onChange={(ev) => {
                const shouldShowGrid = Boolean(ev.target.checked);
                setShowGrid(shouldShowGrid);
                scene.showGrid = shouldShowGrid;
                engine.render();
              }}
            />
          </div>

          {/* Tools */}
          <div className='flex-horizontal right col-gap'>
            { createToolButton('pencil', 'fa-solid fa-pencil fa-xl') }
            { createToolButton('eraser', 'fa-solid fa-eraser fa-xl') }
            { createToolButton('fill', 'fa-solid fa-fill-drip fa-flip-horizontal fa-xl') }
          </div>

          {/* Color Palette */}
          <div className='flex-vertical right'>
            {
              paletteRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex-horizontal">
                  {row.map((color, colIndex) => (
                    <div
                      key={`palette-color-${colIndex}`}
                      style={{
                        backgroundColor: color,
                        width: '24px',
                        height: '24px',
                        border: '1px solid black',
                      }}
                      onClick={() => {
                        console.log('Selected color:', color);
                        // selectedColor = (color);
                        setSelectedColor(color);
                      }}
                    />
                  ))}
                </div>
              ))
            }
          </div>
        </div>

        {/* Right-side canvas and stuff */}
        <div>
          <div>
            <canvas
              id="engine-canvas"
              ref={canvasRef}
              className='pb--'
              width="100"
              height="100"
            />

            {/* Preview image at actual size */}
            <div>
              <p className='pb-'>
                Preview<br/>
                <span className='sm'>
                  ([non-Safari users:] Right-click to save image)
                </span>
              </p>
              <canvas
                id="preview-canvas"
                ref={previewCanvasRef}
                className='p- border-2 border-rounded-2 border-grey'
                width="32"
                height="32"
              />
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default Game;
