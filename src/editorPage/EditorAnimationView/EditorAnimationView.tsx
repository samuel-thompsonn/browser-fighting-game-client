import { useEffect, useRef, useState } from "react";
import DrawableGameCanvasImpl from "../../DrawableGameCanvasImpl";
import './EditorAnimationView.css'
import AnimationFileData from "../../AnimationFileData";
import { AnimationDescription } from "../../InterfaceUtils";
import ParameterInput from "./ParameterInput";
import AnimationTester from "../../animationTester/AnimationTester";
import { BehaviorFileData, FileAttackAnimationDescription } from "../BehaviorFileData";
import BehaviorStateEditor from "./BehaviorStateEditor";

const spriteSheetImage = new Image();
spriteSheetImage.src = "/sprites/ryu_sprite_sheet.png";

const CANVAS_ASPECT_RATIO = 2;

interface EditorAnimationViewProps {
  animationData: AnimationFileData
  onChangeAnimationData?: (animationData: AnimationFileData) => void
  behaviorData: BehaviorFileData
  onChangeBehaviorData?: (behaviorData: BehaviorFileData) => void
  canvasScale: number
  setCanvasScale: (newCanvasScale: number) => void
  selectedState: string
  setSelectedState: (newSelectedState: string) => void
}

const EditorAnimationView = ({
  animationData,
  onChangeAnimationData,
  behaviorData,
  onChangeBehaviorData,
  canvasScale,
  setCanvasScale,
  selectedState,
  setSelectedState
}: EditorAnimationViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentAnimation = animationData.animationStates.filter((state) => state.id === selectedState)[0]
  const currentBehaviorState = behaviorData.animations.find((state) => state.id === selectedState)
  const [newStateId, setNewStateId] = useState<string>('')

  const canvasDimensions = {
    width: spriteSheetImage.width * (canvasScale),
    height: spriteSheetImage.height * (canvasScale) / (CANVAS_ASPECT_RATIO)
  }
  const sourceImageWindow = {
    x: currentAnimation.offset.x - (canvasDimensions.width / 2),
    y: currentAnimation.offset.y - (canvasDimensions.height / 2),
    ...canvasDimensions,
  }

  const drawSpriteBox = (
    drawableCanvas: DrawableGameCanvasImpl,
    animationData: AnimationDescription,
    imageViewX: number,
    imageViewY: number,
    imageViewWidth: number,
    imageViewHeight: number,
  ) => {
    drawableCanvas.setFillStyle('#ffaa00');
    drawableCanvas.setAlpha(0.5);
    const statesPerFrame: number = animationData.statesPerFrame || 1;
    const numSprites = animationData.numFrames / statesPerFrame;
    for (let i = 0; i < numSprites; i++) {
      drawableCanvas.fillRectangle(
        ((animationData.offset.x + i * (animationData.stride)) - imageViewX) / imageViewWidth,
        (animationData.offset.y - imageViewY) / imageViewHeight,
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
      spriteSheetImage,
      sourceImageWindow.x,
      sourceImageWindow.y,
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
      sourceImageWindow.x,
      sourceImageWindow.y,
      sourceImageWindow.width,
      sourceImageWindow.height
    );
    console.log(`Canvas scale: ${canvasScale}`)
  }, [animationData, canvasScale, currentAnimation, spriteSheetImage, sourceImageWindow])

  const handleCanvasClick = (event: React.MouseEvent) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const screenX = (event.clientX - rect.left) / rect.width;
    const screenY = (event.clientY - rect.top) / rect.height;

    console.log('[click] Clicked at:', screenX, screenY)

    if (onChangeAnimationData) {
      currentAnimation.offset = {
        x: Math.floor((sourceImageWindow.width * screenX) + sourceImageWindow.x),
        y: Math.floor((sourceImageWindow.height * screenY) + sourceImageWindow.y)
      }
      console.log(`[click] currentAnimation.offset = ${JSON.stringify(currentAnimation.offset)}`)
      onChangeAnimationData(animationData)
    }
  }

  const handleCanvasWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    const newScale = event.deltaY < 0 ? canvasScale * 0.9 : canvasScale / 0.9;
    setCanvasScale(newScale);
  };

  const animationParameterInputs = [
    {
      label: 'Offset x',
      value: currentAnimation.offset.x,
      onChange: (newValue: number) => currentAnimation.offset.x = newValue
    },
    {
      label: 'Offset y',
      value: currentAnimation.offset.y,
      onChange: (newValue: number) => currentAnimation.offset.y = newValue
    },
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

  const handleCreateAnimation = (id: string) => {
    if (!onChangeAnimationData || !onChangeBehaviorData) { return }
    animationData.animationStates.push({
      ...currentAnimation,
      id,
    })
    onChangeAnimationData(animationData)
    if (currentBehaviorState) {
      onChangeBehaviorData({
        ...behaviorData,
        animations: [
          ...behaviorData.animations,
          {
            ...currentBehaviorState,
            id,
          }
        ]
      })
    }
    setSelectedState(id)
  }

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
      <input value={newStateId} onChange={(event) => setNewStateId(event.target.value)}></input>
      <button onClick={() => handleCreateAnimation(newStateId)}>+</button>
      <div className="individual-animation-editor">
        <div className="editor-view-windows">
          <div className="editor-canvas-with-controls">
            <div className="editor-zoom-control">
              <p>Zoom</p>
              <input
                type="number"
                value={canvasScale}
                min={0.1}
                max={1}
                step={0.10}
                onChange={(event) => setCanvasScale(parseFloat(event.target.value))}
              />
            </div>
            <div className="editor-animation-canvas-container">
              <canvas width={3200} height={1600}
                ref={canvasRef}
                onClick={handleCanvasClick}
                onWheel={handleCanvasWheel}
              />
            </div>
          </div>
          <AnimationTester
            animationData={animationData}
            behaviorData={behaviorData}
          />
        </div>
        <div className="editor-animation-param-controls">
          {animationParameterInputs.map(({ label, value, onChange }) => (
            <ParameterInput
              key={label}
              label={label}
              value={value}
              onChange={(newValue: number) => {
                if (!onChangeAnimationData) { return }
                onChange(newValue)
                onChangeAnimationData(animationData)
              }}
            />
          ))}
          {
            currentBehaviorState?.type === 'attack' ? (
              <BehaviorStateEditor
                behaviorState={currentBehaviorState as FileAttackAnimationDescription}
                onChangeBehaviorState={(behaviorState) => {
                  if (!onChangeBehaviorData) { return }
                  onChangeBehaviorData({
                    ...behaviorData,
                    animations: behaviorData.animations.map((state) => {
                      if (state.id === selectedState) {
                        return behaviorState
                      }
                      return state
                    })
                  })
                }}
              />
            ) : null
          }
        </div>
      </div>
    </div>
  );
}

export default EditorAnimationView
