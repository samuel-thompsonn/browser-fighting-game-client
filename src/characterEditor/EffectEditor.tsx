import { Effect, InteractionArg } from "./Interaction";
import effectTypes from "./effectTypes.json";
import InteractionArgEditor from "./InteractionArgEditor";
import { ArgInfo, EffectInfo, EffectInfoData } from "./InteractionEditorInfo";
import { useState } from "react";

interface EffectEditorProps {
  effect: Effect;
  onChange: (newValue: Effect) => void;
}

function loadInteractionArgs(args: ArgInfo[]): Map<string, ArgInfo> {
  const argsMap = new Map<string, ArgInfo>();
  args.forEach((argInfo) => {
    argsMap.set(argInfo.argName, argInfo);
  })
  return argsMap;
}

function loadEffectType(effectTypeData: EffectInfoData): EffectInfo {
  return {
    effectType: effectTypeData.effectType,
    effectDescription: effectTypeData.effectDescription,
    args: loadInteractionArgs(effectTypeData.args)
  };
}

function loadEffectTypes(effectTypesData: EffectInfoData[]): Map<string, EffectInfo> {
  const effectTypesMap = new Map<string, EffectInfo>();
  effectTypesData.forEach((effectTypeData) => {
    effectTypesMap.set(effectTypeData.effectType, loadEffectType(effectTypeData))
  });
  return effectTypesMap;
}

function EffectEditor({ effect, onChange }: EffectEditorProps) {

  function handleNewEffectArg(newValue: InteractionArg, index: number) {
    effect.args[index] = newValue;
    onChange({ ...effect });
  }

  const [effectTypeMap] = useState<Map<string, EffectInfo>>(loadEffectTypes(effectTypes));

  const currentEffectInfo = effectTypeMap.get(effect.effectType);

  return (
    <div className="Effect-Description">
      <p>{currentEffectInfo?.effectDescription}</p>
      {
        effect.args.map((arg, index) => (
        <InteractionArgEditor
          arg={arg}
          argInfo={currentEffectInfo? currentEffectInfo.args.get(arg.argName) : undefined}
          onChange={(newValue) => handleNewEffectArg(newValue, index)}
        />))
      }
    </div>
  )
}

export default EffectEditor;
