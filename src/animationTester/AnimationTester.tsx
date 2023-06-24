import { ChangeEvent, useState } from "react";
import { AnimationDescription } from "../InterfaceUtils";
import AnimationTesterCanvas from "./AnimationTesterCanvas";
import './AnimationTester.css'
import AnimationMultiSelect from "./AnimationMultiSelect";

interface AnimationTesterProps {
    animationData: AnimationDescription[]
}

function AnimationTester({ animationData }: AnimationTesterProps) {
    const [globalFrameIndex, setGlobalFrameIndex] = useState<number>(1);
    const [animationInterval, setAnimationInterval] = useState<NodeJS.Timer>()
    const [animationIndices, setAnimationIndices] = useState<number[]>(getStartingAnimationIndices())

    function getStartingAnimationIndices(): number[] {
        return (animationData.length > 0)? [0, 1]: []
    }

    function stopPlayingAnimation(): void {
        clearInterval(animationInterval)
        setAnimationInterval(undefined);
    }

    function startPlayingAnimation(): void {
        setAnimationInterval(setInterval(advanceAnimationFrame, 1000 / 30))
    }
    
    function togglePlayingAnimation(): void {
        animationInterval? stopPlayingAnimation() : startPlayingAnimation()
    }

    function onChangeAnimationIndices(newAnimationIndices: number[]): void {
        setGlobalFrameIndex(1)
        setAnimationIndices(newAnimationIndices)
        if (animationInterval) {
            stopPlayingAnimation()
        }
    }

    function maxFrameIndex() {
        let numFrames = 0
        animationIndices.forEach((animationIndex) => {
            numFrames += animationData[animationIndex].numFrames
        })
        return numFrames
    }

    interface CurrentAnimationInfo {
        localFrameIndex: number
        animationSelectionIndex?: number
    }

    // Calculates the current animation and the frame index within the
    // current animation
    function getCurrentAnimationInfo(): CurrentAnimationInfo {
        let numFramesRemaining = globalFrameIndex - 1
        for (let i = 0; i < animationIndices.length; i ++) {
            const animationIndex = animationIndices[i]
            if (numFramesRemaining < animationData[animationIndex].numFrames) {
                return {
                    localFrameIndex: numFramesRemaining + 1,
                    animationSelectionIndex: animationIndex
                }
            }
            numFramesRemaining -= animationData[animationIndex].numFrames
        }
        return {
            localFrameIndex: 1,
            animationSelectionIndex: undefined
        }
    }
    
    const { animationSelectionIndex, localFrameIndex } = getCurrentAnimationInfo()

    function onChangeSlider(event: ChangeEvent<HTMLInputElement>): void {
        setGlobalFrameIndex(parseInt(event.target.value))
    }

    function advanceAnimationFrame(): void {
        setGlobalFrameIndex((frameIndex) => {
            if (animationSelectionIndex !== undefined) {
                return (frameIndex % maxFrameIndex()) + 1
            }
            return frameIndex
        });
    }


    if (animationSelectionIndex !== undefined) {
        console.log(`current animation: ${animationData[animationSelectionIndex].id} ${localFrameIndex}`)
    }

    // TODO: Add controls for playing/pausing the animation, based on the duuration of the animation.
    return (
        <div className="Animation-Tester">
            <AnimationMultiSelect
                animationData={animationData}
                animationIndices={animationIndices}
                onChangeAnimationIndices={onChangeAnimationIndices}
            />
            <button
                disabled={animationSelectionIndex === undefined}
                onClick={togglePlayingAnimation}
            >
                {animationInterval? "Stop" : "Start"}
            </button>
            <input type="range"
                min={1}
                disabled={animationSelectionIndex === undefined}
                max={animationSelectionIndex !== undefined? maxFrameIndex() : undefined}
                value={globalFrameIndex} onChange={onChangeSlider}
            />
            <AnimationTesterCanvas
                characterAnimationData={animationData}
                stateId={animationSelectionIndex !== undefined? animationData[animationSelectionIndex].id : undefined}
                stateFrameIndex={localFrameIndex}
            />
        </div>
    );
}

export default AnimationTester;