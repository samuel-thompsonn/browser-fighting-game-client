import { AnimationDescription } from "./InterfaceUtils";

export default interface AnimationFileData {
  defaultSpriteFilePaths: {
    right: string;
    left: string;
  }
  animationStates: AnimationDescription[]
}