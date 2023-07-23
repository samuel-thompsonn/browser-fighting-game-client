import Vector from "./Vector";

export interface CollisionProperty {
  propertyName: string;
  valueType?: string;
  propertyValue: string;
}

export interface CollisionRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollisionDataItem {
  entityType: string;
  properties?: CollisionProperty[];
  rectangles: CollisionRectangle[];
}

export interface AnimationState {
  id: string;
  images: {
    right: HTMLImageElement
    left: HTMLImageElement,
  };
  imageOffset: {
    x: number;
    y: number;
  };
  imageSize: {
    width: number;
    height: number;
  };
  fixedPoint?: Vector;
  collisionData?: CollisionDataItem[];
  center: {
    x: number;
    y: number;
  };
}

export interface AnimationDescription {
  id: string;
  numFrames: number;
  filePath?: string;
  imageFilePaths?: {
    right: string;
    left: string;
  }
  offset: {
    x: number;
    y: number;
  };
  frameSize: {
    width: number;
    height: number;
  };
  fixedPoint?: Vector;
  stride: number;
  statesPerFrame?: number;
  center?: {
    x: number;
    y: number;
  };
}

export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  LEFT ='left',
  RIGHT = 'right'
}

export interface CharacterStatus {
  id: string;
  position: Position;
  state: string;
  direction: Direction;
  healthInfo: HealthInfo;
  collisionInfo: CollisionDataItem[];
}

export interface HealthInfo {
  health: number;
  maxHealth: number;
}

export interface ControlsEventHandler {
  key: string;
  onPress?: () => void;
  onRelease?: () => void;
}
