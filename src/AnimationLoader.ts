import AnimationFileData from './AnimationFileData';
import { AnimationState } from './InterfaceUtils';

interface AnimationLoader {
  loadAnimations(animationData: AnimationFileData): Map<string, AnimationState>;
}

export default AnimationLoader;
