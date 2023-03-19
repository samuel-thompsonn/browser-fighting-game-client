import AnimationLoader from './AnimationLoader';
import { AnimationDescription, AnimationState } from './InterfaceUtils';

function generateAnimationState(
  animationDescription: AnimationDescription,
  index: number,
  image: HTMLImageElement,
  statesPerFrame: number,
): AnimationState {
  const strideMultiplier = Math.floor(index / statesPerFrame);
  return {
    id: `${animationDescription.id}${index + 1}`,
    image,
    imageOffset: {
      x: animationDescription.offset.x + (animationDescription.stride * strideMultiplier),
      y: animationDescription.offset.y,
    },
    imageSize: animationDescription.frameSize,
    fixedPoint: animationDescription.fixedPoint,
  };
}

export default class SimpleAnimationLoader implements AnimationLoader {
  // eslint-disable-next-line class-methods-use-this
  loadAnimations(animationData: AnimationDescription[]): Map<string, AnimationState> {
    const animationStates = new Map<string, AnimationState>();
    const loadedImages = new Map<string, HTMLImageElement>();
    animationData.forEach((animationDescription) => {
      let statesPerFrame = 1;
      if (animationDescription.statesPerFrame) {
        statesPerFrame = animationDescription.statesPerFrame;
      }
      let image = loadedImages.get(animationDescription.filePath);
      if (!image) {
        image = new Image();
        image.src = `../sprites/${animationDescription.filePath}`;
        loadedImages.set(animationDescription.filePath, image);
      }
      for (let i = 0; i < animationDescription.numFrames; i += 1) {
        const generatedState = generateAnimationState(
          animationDescription,
          i,
          image,
          statesPerFrame,
        );
        animationStates.set(generatedState.id, generatedState);
      }
    });
    return animationStates;
  }
}
