import { useEffect, useRef } from "react";
import DrawableGameCanvasImpl from "../DrawableGameCanvasImpl";
import DrawableGameCanvas from "../DrawableGameCanvas";
import CharacterVisualizer from "../CharacterVisualizer";
import { AnimationDescription, Direction } from "../InterfaceUtils";

const VIEWPORT_DIMENSIONS = {
    aspectRatio: 1,
    gameWidth: 130
};

const VIEWPORT_OFFSET = {
  x: -30,
  y: -10
};

const CANVAS_WIDTH = 300

interface AnimationTesterCanvasProps {
    characterVisualizer?: CharacterVisualizer;
    characterAnimationData: AnimationDescription[];
    stateId?: string;
    stateFrameIndex: number;
}

function AnimationTesterCanvas({
    characterVisualizer = new CharacterVisualizer(),
    stateId,
    stateFrameIndex
}: AnimationTesterCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        const draw = (
            canvas: DrawableGameCanvas,
        ) => {
            const characterStatus = {
                id: "0",
                position: { x: 0, y: 0},
                state: `${stateId}${stateFrameIndex}`,
                direction: Direction.RIGHT,
                healthInfo: { health: 0, maxHealth: 0 },
                collisionInfo: []
            }
            characterVisualizer.drawCharacter(canvas, characterStatus);
        };
    
        let animationFrameId: number;
        const render = () => {
          drawableCanvas.clear();
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
            {stateId?
                <canvas
                    ref={canvasRef}
                    width={CANVAS_WIDTH}
                    height={CANVAS_WIDTH / VIEWPORT_DIMENSIONS.aspectRatio}
                /> :
                <p>Select an animation state to view.</p>
            }
        </div>
      );
}

export default AnimationTesterCanvas;