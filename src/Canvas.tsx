import React, { useEffect, useRef } from 'react';
import './Canvas.css';
import CharacterVisualizer from './CharacterVisualizer';
import DrawableGameCanvas from './DrawableGameCanvas';
import DrawableGameCanvasImpl from './DrawableGameCanvasImpl';
import HealthVisualizerTray from './HealthVisualizerTray';
import { CharacterStatus, HealthInfo } from './InterfaceUtils';

const BACKGROUND_POSITION = {
  x: -170,
  y: -145
};

const BACKGROUND_DIMENSIONS = {
  width: 546,
  height: 280
};

const VIEWPORT_DIMENSIONS = {
  aspectRatio: 14/9,
  gameWidth: 360
};

const VIEWPORT_OFFSET = {
  x: -50,
  y: -110
};

function drawBackground(
  backgroundImage: HTMLImageElement,
  canvas: DrawableGameCanvas
) {
  canvas.drawImage(
    backgroundImage,
    0,
    0,
    backgroundImage.width,
    backgroundImage.height,
    BACKGROUND_POSITION.x,
    BACKGROUND_POSITION.y,
    BACKGROUND_DIMENSIONS.width,
    BACKGROUND_DIMENSIONS.height
  );
}

interface CanvasProps {
  characterVisualizer?:CharacterVisualizer;
  characters:Map<string, CharacterStatus>;
  gameWinner?:string|undefined;
  gameStartTime?: Date;
}

function Canvas({
  characterVisualizer = new CharacterVisualizer(),
  characters,
  gameWinner,
  gameStartTime,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const healthVisualizerTray = new HealthVisualizerTray(); // Ideally should be injected.


  console.log(`Game start time: ${gameStartTime}`)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) { return undefined; }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const canvasContext = canvas.getContext('2d');
    if (canvasContext === null) { return undefined; }
    const drawableCanvas = new DrawableGameCanvasImpl(
      canvasContext,
      VIEWPORT_DIMENSIONS.gameWidth,
      VIEWPORT_DIMENSIONS.gameWidth / VIEWPORT_DIMENSIONS.aspectRatio,
      VIEWPORT_OFFSET
    );
    const guiCanvas = new DrawableGameCanvasImpl(
      canvasContext,
      1,
      1,
      { x: 0, y : 0}
    );

    let animationFrameId: number;
    
    const loadingScreenImage = new Image();
    loadingScreenImage.src = '/gui/loading_screen_placeholder.webp';

    const backgroundImage = new Image();
    backgroundImage.src = "/backgrounds/sf2-gif-1.gif";

    // const image = imageRef.current;
    const image = new Image();
    if (image === null) { return undefined; }
    image.onload = () => {
      // canvasContext.drawImage(image, 50, 20);
    };
    image.onerror = () => {
      // alert('no image found with that url.');
    };

    const drawLoadingScreen = (guiCanvas: DrawableGameCanvas) => {
      guiCanvas.drawImage(
        loadingScreenImage,
        0,
        0,
        1000,
        800,
        0,
        0,
        0.5,
        0.8,
      );
    }

    const draw = (
      canvas: DrawableGameCanvas,
      guiCanvas: DrawableGameCanvas
    ) => {
      if (!gameStartTime) {
        drawLoadingScreen(guiCanvas);
        return;
      }
      // eslint-disable-next-line no-param-reassign
      drawBackground(backgroundImage, canvas);

      characters.forEach((characterStatus) => {
        characterVisualizer.drawCharacter(canvas, characterStatus);
      });

      const characterHealths: Map<string, HealthInfo> = new Map();
      characters.forEach((characterStatus, characterID) => {
        characterHealths.set(characterID, characterStatus.healthInfo);
      });
      
      healthVisualizerTray.drawSelf(guiCanvas, characterHealths);

      const timeUntilGameStart = gameStartTime && (new Date(gameStartTime).getTime() - new Date().getTime());

      // Mark (0, 0) so I can easily tell where the camera is positioned.
      canvas.setFillStyle("red");
      canvas.fillRectangle(-5, -5, 10, 10);
      if (gameWinner) {
        guiCanvas.drawText(`Player ${gameWinner} wins!`, 0.15, 0.5, 50, 'red', 'black');
      } else if (timeUntilGameStart && timeUntilGameStart > 0) {
        guiCanvas.drawText(`${timeUntilGameStart / 1000} seconds`, 0.15, 0.5, 100, 'red', 'black');
      }
    };

    const render = () => {
      drawableCanvas.clear();
      draw(drawableCanvas, guiCanvas);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  });

  return (
    <canvas ref={canvasRef} />
  );
}

export default Canvas;
