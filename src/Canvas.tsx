import React, { useEffect, useRef } from 'react';
import './Canvas.css';
import CharacterVisualizer from './CharacterVisualizer';
import DrawableCanvas from './DrawableCanvas';
import DrawableCanvasImpl from './DrawableCanvasImpl';
import HealthVisualizer from './HealthVisualizer';

const BACKGROUND_POSITION = {
  x: -70,
  y: -65
}
const BACKGROUND_DIMENSIONS = {
  width: 248.888888888,
  height: 140
}

const SCREEN_ASPECT_RATIO = 14/9;
const SCREEN_GAME_AREA = 120;

function drawBackground(
  backgroundImage: HTMLImageElement,
  canvas: DrawableCanvas
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
  characterVisualizers: Map<string, CharacterVisualizer>;
  healthVisualizers: Map<string, HealthVisualizer>;
}

function Canvas({
  characterVisualizers,
  healthVisualizers,
}:CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) { return undefined; }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const canvasContext = canvas.getContext('2d');
    if (canvasContext === null) { return undefined; }
    const drawableCanvas = new DrawableCanvasImpl(
      canvasContext,
      SCREEN_ASPECT_RATIO * SCREEN_GAME_AREA,
      SCREEN_GAME_AREA,
      { x: 0, y: -20}
    );

    let animationFrameId: number;

    const backgroundImage = new Image();
    backgroundImage.src = "../backgrounds/sf2-gif-1.gif";

    // const image = imageRef.current;
    const image = new Image();
    if (image === null) { return undefined; }
    image.onload = () => {
      // canvasContext.drawImage(image, 50, 20);
    };
    image.onerror = () => {
      // alert('no image found with that url.');
    };

    const draw = (
      canvas: DrawableCanvas,
    ) => {
      // eslint-disable-next-line no-param-reassign
      canvas.setFillStyle('#000000');
      canvas.clear();
      drawBackground(backgroundImage, canvas);
      characterVisualizers.forEach((visualizer) => {
        visualizer.drawSelf(canvas);
      });
      healthVisualizers.forEach((visualizer) => {
        // visualizer.drawSelf(canvas);
      });
      // Mark (0, 0) so I can easily tell where the camera is positioned.
      canvas.setFillStyle("red");
      canvas.fillRectangle(-10, -10, 20, 20);
    };

    const render = () => {
      draw(drawableCanvas);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  });

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default Canvas;
