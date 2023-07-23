import animationData from './animation/characterASimpleAnimationsSymmetrical.json';
import DrawableGameCanvas from './DrawableGameCanvas';
import {
  Position, AnimationState, CollisionRectangle, CharacterStatus, Direction,
} from './InterfaceUtils';
import SimpleAnimationLoader from './SimpleAnimationLoader';
import Vector from './Vector';

const CHARACTER_SIZE = 64;
const SPRITE_PIXELS_PER_UNIT = 49/64;

function resolveBasedOnDirection<T>(direction: Direction, ifLeft: T, ifRight: T) {
  if (direction === Direction.LEFT) {
    return ifLeft
  } else if (direction === Direction.RIGHT) {
    return ifRight
  } else {
    throw new Error(`Invalid character direction ${direction}`)
  }
}

function resolveTargetImage(animationState: AnimationState, direction: Direction): HTMLImageElement {
  return resolveBasedOnDirection(direction, animationState.images.left, animationState.images.right)
}

function resolveImageSourceLocation(
  animationState: AnimationState,
  targetImage: HTMLImageElement,
  direction: Direction
): Vector {
  return resolveBasedOnDirection(
    direction,
    {
      x: targetImage.width - animationState.imageOffset.x - animationState.imageSize.width,
      y: animationState.imageOffset.y
    },
    animationState.imageOffset
  )
}

function resolveWorldSpriteOffset (
  animationState: AnimationState,
  direction: Direction
): Vector {
  const centeringOffsetX = (CHARACTER_SIZE / 2)
  const worldOffsetY = (-1 * animationState.center.y / SPRITE_PIXELS_PER_UNIT)
  return resolveBasedOnDirection(
    direction,
    {
      x: ((animationState.center.x - animationState.imageSize.width) / SPRITE_PIXELS_PER_UNIT) + centeringOffsetX,
      y: worldOffsetY
    },
    {
      x: (-animationState.center.x / SPRITE_PIXELS_PER_UNIT) + centeringOffsetX,
      y: worldOffsetY
    }
  )
}

function drawCharacterSprite(
  canvas: DrawableGameCanvas,
  animationState: AnimationState,
  characterStatus: CharacterStatus,
  worldDimensions: Vector
) {
  const targetImage = resolveTargetImage(animationState, characterStatus.direction)
  const imageSourceLocation = resolveImageSourceLocation(animationState, targetImage, characterStatus.direction)
  const worldSpriteOffset = resolveWorldSpriteOffset(animationState, characterStatus.direction)
  canvas.drawImage(
    targetImage,
    imageSourceLocation.x,
    imageSourceLocation.y,
    animationState.imageSize.width,
    animationState.imageSize.height,
    characterStatus.position.x + worldSpriteOffset.x,
    characterStatus.position.y + worldSpriteOffset.y,
    worldDimensions.x,
    worldDimensions.y,
  );
}

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
    canvas.drawText(
      `ID: ${characterStatus.id}`,
      characterStatus.position.x,
      characterStatus.position.y - 10,
      48,
      "#2C74B3",
      "#000000"
    );
    drawCharacterSprite(
      canvas,
      animationState,
      characterStatus,
      { x: worldWidth, y: worldHeight }
    )

    if (characterStatus.collisionInfo) {
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
