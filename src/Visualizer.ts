import animationData from './animation/characterASimpleAnimations.json';
import {
  Position, AnimationState, CollisionRectangle, CollisionDataItem,
} from './InterfaceUtils';
import SimpleAnimationLoader from './SimpleAnimationLoader';

const CHARACTER_SIZE = 64;

function setCanvasFillStyle(canvas: CanvasRenderingContext2D, color: string) {
  // eslint-disable-next-line no-param-reassign
  canvas.fillStyle = color;
}

function setCanvasAlpha(canvas: CanvasRenderingContext2D, alpha: number) {
  // eslint-disable-next-line no-param-reassign
  canvas.globalAlpha = alpha;
}

function drawCollisionRectangle(
  canvas: CanvasRenderingContext2D,
  rectangle: CollisionRectangle,
  color: string,
) {
  setCanvasFillStyle(canvas, color);
  setCanvasAlpha(canvas, 0.5);
  canvas.strokeRect(
    rectangle.x,
    rectangle.y,
    rectangle.width,
    rectangle.height,
  );
  setCanvasFillStyle(canvas, color);
  setCanvasAlpha(canvas, 0.25);
  canvas.fillRect(
    rectangle.x,
    rectangle.y,
    rectangle.width,
    rectangle.height,
  );
  setCanvasAlpha(canvas, 1.0);
}

class Visualizer {
  currentState: AnimationState|undefined;

  animationStates: Map<string, AnimationState>;

  currentPosition: Position;

  constructor() {
    this.currentPosition = {
      x: 0,
      y: 0,
    };
    this.animationStates = new SimpleAnimationLoader().loadAnimations(animationData);
  }

  setAnimationState(newState: string, collisionInfo: CollisionDataItem[]|undefined) {
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
    canvas: CanvasRenderingContext2D,
  ):void {
    if (!this.currentState) { return; }
    canvas.drawImage(
      this.currentState.image,
      this.currentState.imageOffset.x,
      this.currentState.imageOffset.y,
      this.currentState.imageSize.width,
      this.currentState.imageSize.height,
      this.currentPosition.x,
      this.currentPosition.y,
      this.currentState.imageSize.width,
      this.currentState.imageSize.height,
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

export default Visualizer;
