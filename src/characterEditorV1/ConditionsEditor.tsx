import { Condition } from "./Interaction";
import ListSelect from "./ListSelect";
import { useState } from 'react';
import ConditionEditor from "./ConditionEditor";
import Typography from '@mui/material/Typography';
import { ConditionInfo } from "./InteractionEditorInfo";

function getConditionTypes(conditionInfoMap: Map<String, ConditionInfo>): string[] {
  const keys: string[] = [];
  conditionInfoMap.forEach((item) => keys.push(item.conditionType));
  return keys;
}

interface ConditionsEditorProps {
  conditionInfoMap: Map<String, ConditionInfo>;
  conditions: Condition[];
  onChange: (newValue: Condition, index: number) => void;
  onNewCondition: (newValue: Condition) => void;
  onRemoveCondition: (index: number) => void;
}

function ConditionsEditor(props: ConditionsEditorProps) {

  const [selectedCondition, setSelectedCondition] = useState<number>(0);

  function handleNewCondition(conditionType: string) {
    const newConditionInfo = props.conditionInfoMap.get(conditionType);
    if (newConditionInfo) {
      props.onNewCondition({
        conditionType,
        args: []
      });
    }
  }

  return (
    <div>
      <Typography variant="h4">Conditions</Typography>
      <ListSelect
        items={props.conditions.map((condition) => condition.conditionType)}
        value={selectedCondition}
        onChangeSelection={setSelectedCondition}
        addItemProps={{
          possibleTypes: getConditionTypes(props.conditionInfoMap),
          onAddItem: handleNewCondition
        }}
        onRemoveItem={props.onRemoveCondition}
      />
      {
        props.conditions.length > 0 ?
        <ConditionEditor
          condition={props.conditions[selectedCondition]}
          onChange={(newValue: Condition) => props.onChange(newValue, selectedCondition)}
          conditionInfo={props.conditionInfoMap.get(props.conditions[selectedCondition].conditionType)}
        /> : null
      }
    </div>
  );
}

export default ConditionsEditor;