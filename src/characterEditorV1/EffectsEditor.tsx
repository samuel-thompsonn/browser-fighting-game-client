import { useState } from "react";
import EffectEditor from "./EffectEditor";
import { Effect } from "./Interaction";
import ListSelect from "./ListSelect";

interface EffectsEditorProps {
  effects: Effect[];
  onChange: (newValue: Effect, index: number) => void;
}

function EffectsEditor(props: EffectsEditorProps) {

  const [selectedEffectIndex, setSelectedEffectIndex] = useState<number>(0);

  function handleEffectChange(newValue: Effect) {
    props.onChange(newValue, selectedEffectIndex);
  }

  return (
    <div className="Effects-List">
      <h3>Effects</h3>
      <ListSelect
        items={props.effects.map((effect) => effect.effectType)}
        value={selectedEffectIndex}
        onChangeSelection={setSelectedEffectIndex}
      />
      <EffectEditor
        effect={props.effects[selectedEffectIndex]}
        onChange={handleEffectChange}
      />
    </div>
  );
}

export default EffectsEditor;
