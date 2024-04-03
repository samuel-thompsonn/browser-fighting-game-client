import AnimationFileData from './AnimationFileData';
import AnimationLoader from './AnimationLoader';
import { AnimationDescription, AnimationState } from './InterfaceUtils';

function generateAnimationState(
  animationDescription: AnimationDescription,
  index: number,
  images: {
    left: HTMLImageElement,
    right: HTMLImageElement
  },
  statesPerFrame: number,
): AnimationState {
  const strideMultiplier = Math.floor(index / statesPerFrame);
  return {
    id: `${animationDescription.id}${index + 1}`,
    images,
    imageOffset: {
      x: animationDescription.offset.x + (animationDescription.stride * strideMultiplier),
      y: animationDescription.offset.y,
    },
    imageSize: animationDescription.frameSize,
    fixedPoint: animationDescription.fixedPoint,
    center: {
      x: animationDescription.center? animationDescription.center.x : 0,
      y: animationDescription.center? animationDescription.center.y : 0
    }
  };
}

function getImageFromFile(imageFilePath: string): HTMLImageElement {
  const image = new Image()
  image.src = `/sprites/${imageFilePath}`
  return image
}

function getImageFromLoadedImagesMap(
  loadedImages: Map<string, HTMLImageElement>,
  imageFilePath: string
): HTMLImageElement {
  let image = loadedImages.get(imageFilePath)
  if (image !== undefined) {
    return image
  }
  image = getImageFromFile(imageFilePath)
  loadedImages.set(imageFilePath, image)
  return image
}

export default class SimpleAnimationLoader implements AnimationLoader {
  loadAnimations(animationData: AnimationFileData): Map<string, AnimationState> {
    const animationStates = new Map<string, AnimationState>();
    const loadedImages = new Map<string, HTMLImageElement>();
    const defaultRightImage = getImageFromFile(animationData.defaultSpriteFilePaths.right)
    const defaultLeftImage = getImageFromFile(animationData.defaultSpriteFilePaths.left)

    animationData.animationStates.forEach((animationDescription) => {
      let statesPerFrame = 1;
      if (animationDescription.statesPerFrame) {
        statesPerFrame = animationDescription.statesPerFrame;
      }
      let rightImage = defaultRightImage
      if (animationDescription.imageFilePaths && animationDescription.imageFilePaths.right) {
        rightImage = getImageFromLoadedImagesMap(loadedImages, animationDescription.imageFilePaths.right)
      }
      for (let i = 0; i < animationDescription.numFrames; i += 1) {
        const generatedState = generateAnimationState(
          animationDescription,
          i,
          { right: rightImage, left: defaultLeftImage },
          statesPerFrame,
        );
        animationStates.set(generatedState.id, generatedState);
      }
    });
    return animationStates;
  }
}
