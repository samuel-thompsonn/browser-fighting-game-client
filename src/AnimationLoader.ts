import { AnimationState, AnimationDescription } from './InterfaceUtils';

interface AnimationLoader {
  // eslint-disable-next-line no-unused-vars
  loadAnimations(animationData: AnimationDescription[]): Map<string, AnimationState>;
}

export default AnimationLoader;
