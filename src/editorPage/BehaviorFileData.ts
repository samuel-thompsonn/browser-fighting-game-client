export interface CharacterDimensions {
  width: number;
  height: number;
}

export interface CollisionRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HitboxRectangle {
  collisionBox: CollisionRectangle;
  damage: number;
  knockback: number;
}

export interface CollisionProperty {
  propertyName: string;
  valueType?: string;
  propertyValue: string;
}

export interface FileCollisionItem {
  entityType: string;
  properties?: CollisionProperty[];
  rectangles: CollisionRectangle[];
}

export interface ControlsTransition {
  control: string;
  destination: string;
}

export interface TransitionEffectDescription {
  effectType: string;
  argumentLabels: string[];
}

export interface CollisionTransitionDescription {
  foreignEntityType: string;
  selfEntityType: string;
  destination: string;
  effects: TransitionEffectDescription[];
}

export interface InteractionArgumentDescription {
  argName: string;
  value: string;
  valueType?: string;
}

export interface InteractionConditionDescription {
  conditionType: string;
  args: InteractionArgumentDescription[];
}

export interface InteractionEffectDescription {
  effectType: string;
  args: InteractionArgumentDescription[];
}

export interface StateInteractionDescription {
  name: string;
  id?: string;
  priority: number;
  conditions: InteractionConditionDescription[];
  effects: InteractionEffectDescription[];
}

export interface ImportedInteractionDescription {
  id: string;
  priority: number;
}

export interface FileAnimationDescription {
  name: string;
  id: string;
  numFrames: number;
  type?: string;
  state: {
    importedInteractions?: ImportedInteractionDescription[];
    interactions?: StateInteractionDescription[];
    effects?: {
      move?: { // x and y movement are proportional to movementSpeed stat
        x: number;
        y: number;
      }
    }
    collisions?: FileCollisionItem[];
  }
}

export interface FrameTypeMap<T> {
  general?: T;
  startup?: T;
  active?: T;
  end?: T;
}

export interface FileAttackAnimationDescription {
  name: string;
  id: string;
  type: string;
  numFrames: {
    startup: number;
    active: number;
    end: number;
  };
  destinationState: string;
  state: {
    importedInteractions?: FrameTypeMap<ImportedInteractionDescription[]>;
    collisions?: FrameTypeMap<FileCollisionItem[]>
  }
}

export interface BehaviorFileData {
  name: string;
  initialState: string;
  stats: {
    movementSpeed: number; // Units per second
    maxHealth: number;
    knockbackStrength: number;
  },
  interactions: StateInteractionDescription[];
  animations: (FileAnimationDescription | FileAttackAnimationDescription)[];
}
