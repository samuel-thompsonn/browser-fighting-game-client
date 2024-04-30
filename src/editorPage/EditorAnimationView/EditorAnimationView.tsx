import { useEffect, useRef, useState } from "react";
import DrawableGameCanvasImpl from "../../DrawableGameCanvasImpl";
import './EditorAnimationView.css'
import AnimationFileData from "../../AnimationFileData";
import { AnimationDescription } from "../../InterfaceUtils";
import ParameterInput from "./ParameterInput";

const backgroundImage = new Image();
backgroundImage.src = "/sprites/ryu_sprite_sheet.png";

interface EditorAnimationViewProps {
  animationData: AnimationFileData
  onChangeAnimationData?: (animationData: AnimationFileData) => void
  canvasScale: number
  setCanvasScale: (newCanvasScale: number) => void
  selectedState: string
  setSelectedState: (newSelectedState: string) => void
}

const EditorAnimationView = ({
  animationData,
  onChangeAnimationData,
  canvasScale,
  setCanvasScale,
  selectedState,
  setSelectedState
}: EditorAnimationViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userClickLocation, setUserClickLocation] = useState<{ x: number, y: number }>({ x: 0.5, y: 0.5 });
  // const [selectedState, setSelectedState] = useState<string>('idle')

  const currentAnimation = animationData.animationStates.filter((state) => state.id === selectedState)[0];

  const sourceImageWindow = {
    x: 0,
    y: 0,
    width: backgroundImage.width * (canvasScale),
    height: backgroundImage.height * (canvasScale)
  }

  const drawSpriteBox = (
    drawableCanvas: DrawableGameCanvasImpl,
    animationData: AnimationDescription,
    imageViewWidth: number,
    imageViewHeight: number,
  ) => {
    drawableCanvas.setFillStyle('#ffaa00');
    drawableCanvas.setAlpha(0.5);
    const statesPerFrame: number = animationData.statesPerFrame || 1;
    const numSprites = animationData.numFrames / statesPerFrame;
    for (let i = 0; i < numSprites; i++) {
      drawableCanvas.fillRectangle(
        (animationData.offset.x / imageViewWidth) + (i * (animationData.stride / imageViewWidth)),
        animationData.offset.y / imageViewHeight,
        animationData.frameSize.width / imageViewWidth,
        animationData.frameSize.height / imageViewHeight,
      )
    }
    drawableCanvas.setAlpha(1.0);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) { return undefined; }
    const canvasContext = canvas.getContext('2d');
    if (canvasContext === null) { return undefined; }
    canvasContext.imageSmoothingQuality = 'high';
    const drawableCanvas = new DrawableGameCanvasImpl(
      canvasContext,
      1,
      1,
      { x: 0, y: 0 }
    );

    drawableCanvas.clear();

    drawableCanvas.drawImage(
      backgroundImage,
      0,
      0,
      sourceImageWindow.width,
      sourceImageWindow.height,
      0,
      0,
      1,
      1
    );

    drawSpriteBox(
      drawableCanvas,
      currentAnimation,
      sourceImageWindow.width,
      sourceImageWindow.height
    );
    console.log(`Canvas scale: ${canvasScale}`)
  }, [animationData, canvasScale, currentAnimation, backgroundImage, sourceImageWindow])

  const handleCanvasClick = (event: React.MouseEvent) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    console.log('Clicked at:', x, y)
    setUserClickLocation({ x, y })

    if (onChangeAnimationData && userClickLocation) {
      currentAnimation.offset = {
        x: Math.floor(sourceImageWindow.width * x),
        y: Math.floor(sourceImageWindow.height * y)
      }
      onChangeAnimationData(animationData)
    }
  }

  // const handleCanvasWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
  //   event.preventDefault()
  //   const newScale = event.deltaY < 0 ? canvasScale * 0.9 : canvasScale / 0.9;
  //   setCanvasScale(newScale);
  // };

  const parameterInputs = [
    {
      label: 'Frame width',
      value: currentAnimation.frameSize.width,
      onChange: (newValue: number) => currentAnimation.frameSize.width = newValue
    },
    {
      label: 'Frame height',
      value: currentAnimation.frameSize.height,
      onChange: (newValue: number) => currentAnimation.frameSize.height = newValue
    },
    {
      label: 'Stride',
      value: currentAnimation.stride,
      onChange: (newValue: number) => currentAnimation.stride = newValue
    },
    {
      label: 'States per frame',
      value: currentAnimation.statesPerFrame || 1,
      onChange: (newValue: number) => currentAnimation.statesPerFrame = newValue
    },
    {
      label: 'Number of frames',
      value: currentAnimation.numFrames,
      onChange: (newValue: number) => currentAnimation.numFrames = newValue
    },
  ]

  return (
    <div>
      <select
        value={selectedState}
        onChange={(event) => setSelectedState(event.target.value)}
      >
        {animationData.animationStates.map((animationDescription) => (
          <option value={animationDescription.id}>{animationDescription.id}</option>
        ))}
      </select>
      <div className="individual-animation-editor">
        <div className="editor-animation-param-controls">
          {parameterInputs.map(({ label, value, onChange }) => (
            <ParameterInput
              label={label}
              value={value}
              onChange={(newValue: number) => {
                if (!onChangeAnimationData) { return }
                onChange(newValue)
                onChangeAnimationData(animationData)
              }}
            />
          ))}
        </div>
        <div className="editor-canvas-with-controls">
          <p>Scale</p>
          <input
            type="number"
            value={canvasScale}
            min={0.1}
            max={1}
            step={0.10}
            onChange={(event) => setCanvasScale(parseFloat(event.target.value))}
          />
          <div className="editor-animation-canvas-container">
            <canvas width={1600} height={1600}
              ref={canvasRef}
              onClick={handleCanvasClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorAnimationView
