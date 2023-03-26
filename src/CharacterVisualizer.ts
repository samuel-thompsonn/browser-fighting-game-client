import animationData from './animation/characterASimpleAnimations.json';
import DrawableGameCanvas from './DrawableGameCanvas';
import {
  Position, AnimationState, CollisionRectangle, CollisionDataItem, CharacterStatus,
} from './InterfaceUtils';
import SimpleAnimationLoader from './SimpleAnimationLoader';

const CHARACTER_SIZE = 64;
const SPRITE_PIXELS_PER_UNIT = 49/64;

function drawCollisionRectangle(
  canvas: DrawableGameCanvas,
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
  animationStates: Map<string, AnimationState>;

  constructor() {
    this.animationStates = new SimpleAnimationLoader().loadAnimations(animationData);
  }

  drawCharacter(
    canvas: DrawableGameCanvas,
    characterStatus: CharacterStatus
  ): void {
    const animationState = this.animationStates.get(characterStatus.state);
    if (!animationState) {
      throw new Error(`Server referenced unknown animation state ${characterStatus.state}`)
    }
    const worldWidth = animationState.imageSize.width / SPRITE_PIXELS_PER_UNIT;
    const worldHeight = animationState.imageSize.height / SPRITE_PIXELS_PER_UNIT;
    let worldSpriteOffset = { x: 0, y: 0 };
    if (animationState.fixedPoint) {
      worldSpriteOffset.x = animationState.fixedPoint.x / SPRITE_PIXELS_PER_UNIT;
      worldSpriteOffset.y = animationState.fixedPoint.y / SPRITE_PIXELS_PER_UNIT;
    }

    canvas.drawText(
      `ID: ${characterStatus.id}`,
      characterStatus.position.x,
      characterStatus.position.y - 10,
      48,
      "#2C74B3",
      "#000000"
    );
    canvas.drawImage(
      animationState.image,
      animationState.imageOffset.x,
      animationState.imageOffset.y,
      animationState.imageSize.width,
      animationState.imageSize.height,
      characterStatus.position.x - worldSpriteOffset.x,
      characterStatus.position.y - worldSpriteOffset.y,
      worldWidth,
      worldHeight,
    );

    console.log(`animationState: ${animationState}`);
    if (characterStatus.collisionInfo) {
      console.log("Drawing collision data!");
      const defaultColor = '#AAAAAA';
      const entityTypeColors = new Map([
        ['hurtbox', '#00FF55'],
        ['hitbox', '#AA0000'],
      ]);
      characterStatus.collisionInfo?.forEach((collisionDataItem) => {
        collisionDataItem.rectangles.forEach((collisionRectangle) => {
          let boxColor = entityTypeColors.get(collisionDataItem.entityType);
          if (!boxColor) {
            boxColor = defaultColor;
          }
          this.drawHitbox(
            canvas,
            boxColor,
            collisionRectangle,
            characterStatus.position
          );
        });
      });
    }
  }

  drawHitbox(
    canvas: DrawableGameCanvas,
    color: string,
    hitbox: CollisionRectangle,
    characterPosition: Position
  ):void {
    console.log("Drawing collision rectangle!");
    drawCollisionRectangle(
      canvas,
      {
        x: characterPosition.x + (hitbox.x * CHARACTER_SIZE),
        y: characterPosition.y + (hitbox.y * CHARACTER_SIZE),
        width: hitbox.width * CHARACTER_SIZE,
        height: hitbox.height * CHARACTER_SIZE,
      },
      color,
    );
  }
}

export default CharacterVisualizer;
