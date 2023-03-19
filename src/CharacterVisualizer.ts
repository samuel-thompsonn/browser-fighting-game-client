import animationData from './animation/characterASimpleAnimations.json';
import DrawableCanvas from './DrawableCanvas';
import {
  Position, AnimationState, CollisionRectangle, CollisionDataItem,
} from './InterfaceUtils';
import SimpleAnimationLoader from './SimpleAnimationLoader';

const CHARACTER_SIZE = 64;
const CHARACTER_DIMENSIONS = {
  x: 32,
  y: 64
};
// const GROUND_LEVEL = 84; // Ground level is 128 units (not necessarily pixels?) down from top of canvas
const GROUND_LEVEL = 0; // Ground level is 128 units (not necessarily pixels?) down from top of canvas

function drawCollisionRectangle(
  canvas: DrawableCanvas,
  rectangle: CollisionRectangle,
  color: string,
) {
  canvas.setFillStyle(color);
  canvas.setAlpha(0.5);
  canvas.strokeRectangle(
    rectangle.x,
    rectangle.y,
    rectangle.width,
    rectangle.height,
  );
  canvas.setFillStyle(color);
  canvas.setAlpha(0.25);
  canvas.fillRectangle(
    rectangle.x,
    rectangle.y,
    rectangle.width,
    rectangle.height,
  );
  canvas.setAlpha(1.0);
}

class CharacterVisualizer {
  currentState: AnimationState | undefined;

  animationStates: Map<string, AnimationState>;

  currentPosition: Position;

  constructor() {
    this.currentPosition = {
      x: 0,
      y: 0,
    };
    this.animationStates = new SimpleAnimationLoader().loadAnimations(animationData);
  }

  setAnimationState(newState: string, collisionInfo: CollisionDataItem[] | undefined) {
    const nextState = this.animationStates.get(newState);
    if (nextState) {
      this.currentState = nextState;
      this.currentState.collisionData = collisionInfo;
    } else {
      throw new Error(`Server referenced unknown animation state ${newState}`);
    }
  }

  setPosition(newPosition: Position) {
    this.currentPosition = newPosition;
  }

  drawSelf(
    canvas: DrawableCanvas,
  ): void {
    if(!this.currentState) { return; }
    canvas.drawImage(
      this.currentState.image,
      this.currentState.imageOffset.x,
      this.currentState.imageOffset.y,
      this.currentState.imageSize.width,
      this.currentState.imageSize.height,
      this.currentPosition.x,
      this.currentPosition.y,
      CHARACTER_DIMENSIONS.x,
      CHARACTER_DIMENSIONS.y,
    );
    if (this.currentState.collisionData) {
      const drawHitbox = (
        color: string,
        hitbox: CollisionRectangle,
      ) => {
        drawCollisionRectangle(
          canvas,
          {
            x: this.currentPosition.x + (hitbox.x * CHARACTER_SIZE),
            y: this.currentPosition.y + (hitbox.y * CHARACTER_SIZE),
            width: hitbox.width * CHARACTER_SIZE,
            height: hitbox.height * CHARACTER_SIZE,
          },
          color,
        );
      };
      const defaultColor = '#AAAAAA';
      const entityTypeColors = new Map([
        ['hurtbox', '#00FF55'],
        ['hitbox', '#AA0000'],
      ]);
      this.currentState.collisionData?.forEach((collisionDataItem) => {
        collisionDataItem.rectangles.forEach((collisionRectangle) => {
          let boxColor = entityTypeColors.get(collisionDataItem.entityType);
          if (!boxColor) {
            boxColor = defaultColor;
          }
          drawHitbox(boxColor, collisionRectangle);
        });
      });
    }
  }
}

export default CharacterVisualizer;
