export interface InteractionArg {
  argName: string;
  value: string;
};

export interface Condition {
  conditionType: string;
  args: InteractionArg[];
};

export interface Effect {
  effectType: string;
  args: InteractionArg[];
}

interface Interaction {
  name: string;
  id: string;
  priority: number;
  conditions: Condition[];
  effects: Effect[];
};

export default Interaction;
