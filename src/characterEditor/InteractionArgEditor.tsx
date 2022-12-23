import { ChangeEvent } from "react";
import { InteractionArg } from "./Interaction";
import { ArgInfo } from "./InteractionEditorInfo";

interface InteractionArgEditorProps {
  arg: InteractionArg;
  argInfo: ArgInfo | undefined;
  onChange: (newValue: InteractionArg) => void;
}

function InteractionArgEditor({arg, argInfo, onChange}: InteractionArgEditorProps) {

  function handleNewArgValue(newValue: string) {
    onChange({...arg, value: newValue })
  }

  return (
    <div className="Interaction-Arg-Description">
      {
        argInfo? <p>{argInfo.argDescription}</p> : arg.argName
      }
      <input type="text" value={arg.value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleNewArgValue(event.target.value)}
      />
    </div>
  )
}

export default InteractionArgEditor;
