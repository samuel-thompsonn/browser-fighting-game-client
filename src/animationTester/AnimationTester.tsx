import { ChangeEvent, useState } from "react";
import { AnimationDescription } from "../InterfaceUtils";
import AnimationTesterCanvas from "./AnimationTesterCanvas";
import './AnimationTester.css'

interface AnimationSelectProps {
    animationData: AnimationDescription[]
    animationIndex?: number
    onSelectAnimation: (animationId: number) => void
}

function AnimationSelect({
    animationData,
    animationIndex,
    onSelectAnimation
}: AnimationSelectProps) {
    function onChangeStateId(event: ChangeEvent<HTMLSelectElement>): void {
        onSelectAnimation(parseInt(event.target.value))
    }

    return (
        <select value={animationIndex} onChange={onChangeStateId}>
            {animationData.map((animationDescription, index) => <option key={index} value={index}>{animationDescription.id}</option>)}
        </select>
    )
}

interface AnimationTesterProps {
    animationData: AnimationDescription[]
}

function AnimationTester({ animationData }: AnimationTesterProps) {

    function getStartingAnimationIndex(): number|undefined {
        return (animationData.length > 0)? 1 : undefined
    }

    const [animationIndex, setAnimationIndex] = useState<number|undefined>(getStartingAnimationIndex())
    const [frameIndex, setFrameIndex] = useState<number>(1);
    const [animationInterval, setAnimationInterval] = useState<NodeJS.Timer>()

    function onChangeAnimationIndex(index: number) {
        setAnimationIndex(index);
        setFrameIndex(1);
    }

    function onChangeSlider(event: ChangeEvent<HTMLInputElement>): void {
        setFrameIndex(parseInt(event.target.value))
    }

    function advanceAnimationFrame(): void {
        setFrameIndex((frameIndex) => {
            if (animationIndex) {
                return (frameIndex % animationData[animationIndex].numFrames) + 1
            }
            return frameIndex
        });
    }

    function togglePlayingAnimation() {
        if (animationInterval) {
            console.log("Clearing animation interval")
            clearInterval(animationInterval)
            setAnimationInterval(undefined);
        } else {
            setAnimationInterval(setInterval(advanceAnimationFrame, 1000 / 30))
        }
    }

    // TODO: Add controls for playing/pausing the animation, based on the duuration of the animation.
    return (
        <div className="Animation-Tester">
            <AnimationSelect
                animationData={animationData}
                animationIndex={animationIndex}
                onSelectAnimation={onChangeAnimationIndex}
            />
            <button onClick={togglePlayingAnimation}>
                {animationInterval? "Stop" : "Start"}
            </button>
            <input type="range"
                min={1}
                disabled={!animationIndex}
                max={animationIndex? animationData[animationIndex].numFrames : undefined}
                value={frameIndex} onChange={onChangeSlider}
            />
            <AnimationTesterCanvas
                characterAnimationData={animationData}
                stateId={animationIndex? animationData[animationIndex].id : undefined}
                stateFrameIndex={frameIndex}
            />

        </div>
    );
}

export default AnimationTester;