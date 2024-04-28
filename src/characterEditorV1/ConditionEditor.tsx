import { Condition, InteractionArg } from "./Interaction";
import { ConditionInfo, ArgInfo, ConditionInfoData } from "./InteractionEditorInfo";
import { ChangeEvent } from "react";

function ConditionArgEditor(
  arg: InteractionArg,
  argInfo: ArgInfo | undefined,
  onChange: (newValue: InteractionArg) => void
) {

  function handleNewArgValue(newArgValue: string) {
    onChange({
      argName: arg.argName,
      value: newArgValue
    });
  }

  return (
    <div className="Condition-Description">
      {
        argInfo? <p>{argInfo.argDescription}</p> : arg.argName
      }
      <input type="text" value={arg.value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleNewArgValue(event.target.value)}
      />
    </div>
  )
}

interface ConditionEditorProps {
  condition: Condition;
  onChange: (newValue: Condition) => void;
  conditionInfo?: ConditionInfo;
}

function ConditionEditor({
  condition,
  onChange,
  conditionInfo
}: ConditionEditorProps) {

  function handleNewConditionArg(newValue: InteractionArg, index: number) {
    condition.args[index] = newValue;
    onChange(condition);
  }

  return (
    <div className="Condition-Item">
      <p>{conditionInfo? conditionInfo.conditionDescription : "(No description available)"}</p>
      {
        condition.args.map((arg: InteractionArg, index: number) => (
            ConditionArgEditor(
              arg,
              conditionInfo? conditionInfo.args.get(arg.argName) : undefined,
              (newValue: InteractionArg) => handleNewConditionArg(newValue, index)
            )
          )
        )
      }
    </div>
  )
}

export default ConditionEditor;