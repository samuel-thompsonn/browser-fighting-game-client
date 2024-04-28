import Interaction, { Condition, Effect } from './Interaction';
import ConditionsEditor from './ConditionsEditor';
import EffectsEditor from './EffectsEditor';
import { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import conditionTypes from "./conditionTypes.json";
import { ArgInfo, ConditionInfo, ConditionInfoData } from "./InteractionEditorInfo";

import './InteractionEditor.css';


function constructConditionTypesMap(conditionInfos: ConditionInfoData[]): Map<String, ConditionInfo> {
  const conditionTypeMap = new Map<String, ConditionInfo>();
  conditionInfos.forEach(
    (conditionInfo) => conditionTypeMap.set(conditionInfo.conditionType, loadConditionInfo(conditionInfo))
  );
  return conditionTypeMap;
}

function loadConditionInfo(conditionInfoData: ConditionInfoData): ConditionInfo {
  return {
    ...conditionInfoData,
    args: constructArgInfoMap(conditionInfoData.args)
  }
}

function constructArgInfoMap(argInfoList: ArgInfo[]): Map<String, ArgInfo> {
  const argInfoMap = new Map<String, ArgInfo>();
  argInfoList.forEach((argInfo: ArgInfo) => {
    argInfoMap.set(argInfo.argName, argInfo);
  });
  return argInfoMap;
}

interface InteractionEditorProps {
  interaction: Interaction;
  onChange: (newValue: Interaction) => void;
}

function InteractionEditor(props: InteractionEditorProps) {

  const conditionInfoMap = constructConditionTypesMap(conditionTypes);

  function handleConditionChange(newValue: Condition, index: number) {
    props.interaction.conditions[index] = newValue;
    props.onChange({...props.interaction});
  }

  function handleNewCondition(newValue: Condition) {
    props.interaction.conditions.push(newValue);
    props.onChange({...props.interaction});
  }

  function handleRemoveCondition(index: number) {
    props.interaction.conditions.splice(index, 1);
    props.onChange({...props.interaction});
  }

  function handleEffectChange(newValue: Effect, index: number) {
    props.interaction.effects[index] = newValue;
    props.onChange({...props.interaction});
  }

  function handleNameChange(newValue: string) {
    props.interaction.name = newValue;
    props.onChange({...props.interaction});
  }

  return (
    <div className="Condition-Effect-Editors">
      <TextField
        variant="outlined"
        value={props.interaction.name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleNameChange(event.target.value)}
      />
      <ConditionsEditor
        conditionInfoMap={conditionInfoMap}
        conditions={props.interaction.conditions}
        onChange={handleConditionChange}
        onNewCondition={handleNewCondition}
        onRemoveCondition={handleRemoveCondition}
      />
      <EffectsEditor
        effects={props.interaction.effects}
        onChange={handleEffectChange}
      />
    </div>
  );
}

export default InteractionEditor;
