import { ChangeEvent } from "react"
import { AnimationDescription } from "../InterfaceUtils"

interface AnimationSelectProps {
    animationData: AnimationDescription[]
    animationIndex?: number
    onSelectAnimation: (animationId: number) => void
    onRemoveAnimation: () => void
}

function AnimationSelect({
    animationData,
    animationIndex,
    onSelectAnimation,
    onRemoveAnimation
}: AnimationSelectProps) {
    function onChangeStateId(event: ChangeEvent<HTMLSelectElement>): void {
        onSelectAnimation(parseInt(event.target.value))
    }

    return (
        <div>
            <select value={animationIndex} onChange={onChangeStateId}>
                {animationData.map((animationDescription, index) => <option key={index} value={index}>{animationDescription.id}</option>)}
            </select>
            <button onClick={onRemoveAnimation}>-</button>
        </div>
    )
}

interface AnimationMultiSelectProps {
    animationData: AnimationDescription[]
    animationIndices: number[]
    onChangeAnimationIndices: (animationIndices: number[]) => void
}

function AnimationMultiSelect({
    animationData,
    animationIndices,
    onChangeAnimationIndices
}: AnimationMultiSelectProps) {

    function onChangeAnimationIndex(animationIndex: number, selectionIndex: number): void {
        const newAnimationIndices = [...animationIndices]
        newAnimationIndices[selectionIndex] = animationIndex
        onChangeAnimationIndices(newAnimationIndices)
    }

    function onRemoveAnimation(selectionIndex: number): void {
        const newAnimationIndices = [...animationIndices]
        newAnimationIndices.splice(selectionIndex, 1)
        onChangeAnimationIndices(newAnimationIndices)
    }

    function onAddAnimation(): void {
        const newAnimationIndices = [...animationIndices]
        newAnimationIndices.push(0)
        onChangeAnimationIndices(newAnimationIndices)
    }

    return (
        <>
            {animationIndices.map((animationIndex, selectionIndex) => (
                <AnimationSelect
                    key={selectionIndex}
                    animationData={animationData}
                    animationIndex={animationIndex}
                    onSelectAnimation={(newAnimationIndex) => onChangeAnimationIndex(newAnimationIndex, selectionIndex)}
                    onRemoveAnimation={() => onRemoveAnimation(selectionIndex)}
                />
            ))}
            <button onClick={onAddAnimation}>+</button>
        </>
    )
}

export default AnimationMultiSelect
