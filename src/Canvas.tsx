import React, { useEffect, useRef } from 'react';
import './Canvas.css';
import Visualizer from './Visualizer';

function drawBackground(
  background_image: HTMLImageElement,
  canvasContext: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
) {
  let xScale = canvasWidth / background_image.width;
  let yScale = canvasHeight / background_image.height;
  canvasContext.drawImage(
    background_image,
    0,
    0,
    xScale * background_image.width,
    yScale * background_image.height
  );
}

interface CanvasProps {
  visualizers: Map<string, Visualizer>;
}

function Canvas({ visualizers }:CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) { return undefined; }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const canvasContext = canvas.getContext('2d');
    if (canvasContext === null) { return undefined; }

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
      canvasContextInstance: CanvasRenderingContext2D,
    ) => {
      // eslint-disable-next-line no-param-reassign
      canvasContextInstance!.fillStyle = '#000000';
      const { width } = canvasContextInstance.canvas;
      const { height } = canvasContextInstance.canvas;
      canvasContextInstance.clearRect(0, 0, width, height);
      drawBackground(backgroundImage, canvasContextInstance, width, height);
      visualizers.forEach((visualizer) => {
        visualizer.drawSelf(canvasContextInstance);
      });
    };

    const render = () => {
      draw(canvasContext);
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
