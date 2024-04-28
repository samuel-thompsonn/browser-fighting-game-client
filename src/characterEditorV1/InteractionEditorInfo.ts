export interface ConditionInfo {
  conditionType: string;
  conditionDescription: string;
  args: Map<String, ArgInfo>;
}

export interface ArgInfo {
  argName: string;
  argDescription: string;
  argOptions?: string[];
}

export interface ConditionInfoData {
  conditionType: string;
  conditionDescription: string;
  args: ArgInfo[];
}

export interface EffectInfo {
  effectType: string;
  effectDescription: string;
  args: Map<string, ArgInfo>;
}

export interface EffectInfoData {
  effectType: string;
  effectDescription: string;
  args: ArgInfo[];
}
