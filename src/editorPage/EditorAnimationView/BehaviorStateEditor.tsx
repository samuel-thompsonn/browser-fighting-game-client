import { CollisionRectangle, FileAttackAnimationDescription, FileCollisionItem } from "../BehaviorFileData"
import ParameterInput from "./ParameterInput"

interface BehaviorStateEditorProps {
  behaviorState: FileAttackAnimationDescription
  onChangeBehaviorState: (animationDescription: FileAttackAnimationDescription) => void
}

interface ParameterInputModifiedProps {
  label: string
  value: (behaviorState: FileAttackAnimationDescription) => number
  onChange: (draft: FileAttackAnimationDescription, newStartupFrames: number) => void
  step?: number
}

const hurtboxValue = (value: (rectangle: CollisionRectangle) => number) => {
  return (behaviorState: FileAttackAnimationDescription) => {
    const generalCollision = behaviorState.state.collisions?.general?.at(0);
    if (generalCollision) {
      return value(generalCollision.rectangles[0])
    }
    return 0
  }
}

const onHurtboxChange = (onChange: (rectangle: CollisionRectangle, newValue: number) => void) => {
  return (draft: FileAttackAnimationDescription, newValue: number) => {
    if (!draft.state.collisions) {
      draft.state.collisions = {}
    }
    if (!draft.state.collisions.general) {
      draft.state.collisions.general = [{
        entityType: 'hurtbox',
        rectangles: [
          { x: 0, y: 0, width: 1, height: 1}
        ]
      }]
    }
    onChange(draft.state.collisions.general[0].rectangles[0], newValue)
  }
}

const hitboxValue = (value: (rectangle: FileCollisionItem) => number) => {
  return (behaviorState: FileAttackAnimationDescription) => {
    const activeCollision = behaviorState.state.collisions?.active?.at(0);
    if (activeCollision) {
      return value(activeCollision)
    }
    return 0
  }
}

const onHitboxChange = (onChange: (collisionItem: FileCollisionItem, newValue: number) => void) => {
  return (draft: FileAttackAnimationDescription, newValue: number) => {
    if (!draft.state.collisions) {
      draft.state.collisions = {}
    }
    if (!draft.state.collisions.active) {
      draft.state.collisions.active = [{
        entityType: 'hitbox',
        rectangles: [
          { x: 0, y: 0, width: 1, height: 1}
        ]
      }]
    }
    onChange(draft.state.collisions.active[0], newValue)
  }
}

const hitboxPropertyValue = (propertyName: string) => {
  return hitboxValue((collisionItem) => {
    if (collisionItem.properties) {
      const damageProperty = collisionItem.properties.find((property) => property.propertyName === propertyName)
      if (damageProperty) { return parseInt(damageProperty.propertyValue) }
    }
    return 0
  })
}

const onHitboxPropertyChange = (propertyName: string) => {
  return onHitboxChange((collisionItem, newValue) => {
    if (!collisionItem.properties) {
      collisionItem.properties = []
    }
    const damageProperty = collisionItem.properties.find((property) => property.propertyName === propertyName)
    if (damageProperty) {
      damageProperty.propertyValue = `${newValue}`
    } else {
      collisionItem.properties.push({ propertyName: propertyName, propertyValue: `${newValue}` })
    }
  })
}

const behaviorParameterInputs: ParameterInputModifiedProps[] = [
  {
    label: 'Startup frames',
    value: (behaviorState) => behaviorState.numFrames.startup,
    onChange: (draft, newStartupFrames) => {
      draft.numFrames.startup = newStartupFrames
    },
  },
  {
    label: 'Active frames',
    value: (behaviorState) => behaviorState.numFrames.active,
    onChange: (draft: FileAttackAnimationDescription, newActiveFrames: number) => {
      draft.numFrames.active = newActiveFrames
    },
  },
  {
    label: 'End frames',
    value: (behaviorState) => behaviorState.numFrames.end,
    onChange: (draft: FileAttackAnimationDescription, newEndFrames: number) => {
      draft.numFrames.end = newEndFrames
    },
  },
  {
    label: 'Hurtbox x',
    value: hurtboxValue((rect) => rect.x),
    onChange: onHurtboxChange((rect, newValue) => rect.x = newValue),
    step: 0.1,
  },
  {
    label: 'Hurtbox y',
    value: hurtboxValue((rect) => rect.y),
    onChange: onHurtboxChange((rect, newValue) => rect.y = newValue),
    step: 0.1,
  },
  {
    label: 'Hurtbox width',
    value: hurtboxValue((rect) => rect.width),
    onChange: onHurtboxChange((rect, newValue) => rect.width = newValue),
    step: 0.1,
  },
  {
    label: 'Hurtbox height',
    value: hurtboxValue((rect) => rect.height),
    onChange: onHurtboxChange((rect, newValue) => rect.height = newValue),
    step: 0.1,
  },
  {
    label: 'Hitbox damage',
    value: hitboxPropertyValue('damage'),
    onChange: onHitboxPropertyChange('damage'),
  },
  {
    label: 'Hitbox knockback',
    value: hitboxPropertyValue('knockback'),
    onChange: onHitboxPropertyChange('knockback'),
  },
  {
    label: 'Hitbox rectangle: x',
    value: hitboxValue((collisionItem: FileCollisionItem) => {
      return collisionItem.rectangles[0].x
    }),
    onChange: onHitboxChange((collisionItem, newValue) => {
      collisionItem.rectangles[0].x = newValue
    }),
    step: 0.1,
  },
  {
    label: 'Hitbox rectangle: y',
    value: hitboxValue((collisionItem: FileCollisionItem) => {
      return collisionItem.rectangles[0].y
    }),
    onChange: onHitboxChange((collisionItem, newValue) => {
      collisionItem.rectangles[0].y = newValue
    }),
    step: 0.1,
  },
  {
    label: 'Hitbox rectangle: width',
    value: hitboxValue((collisionItem: FileCollisionItem) => {
      return collisionItem.rectangles[0].width
    }),
    onChange: onHitboxChange((collisionItem, newValue) => {
      collisionItem.rectangles[0].width = newValue
    }),
    step: 0.1,
  },
  {
    label: 'Hitbox rectangle: height',
    value: hitboxValue((collisionItem: FileCollisionItem) => {
      return collisionItem.rectangles[0].height
    }),
    onChange: onHitboxChange((collisionItem, newValue) => {
      collisionItem.rectangles[0].height = newValue
    }),
    step: 0.1,
  },
]

const BehaviorStateEditor = ({
  behaviorState,
  onChangeBehaviorState,
}: BehaviorStateEditorProps) => {
  console.log(`Rendering new behaviorState. active frames: ${behaviorState.numFrames.active}`)

  return (
    <div style={{ overflow: 'scroll', height: '150px' }}>
      {behaviorParameterInputs.map(({ label, value, onChange, step }) => (
        <ParameterInput
          key={label}
          label={label}
          value={value(behaviorState)}
          onChange={(newValue) => {
            const newBehaviorState = { ...behaviorState }
            onChange(newBehaviorState, newValue)
            onChangeBehaviorState(newBehaviorState)
          }}
          step={step}
        />
      ))}
    </div>
  )
}

export default BehaviorStateEditor
