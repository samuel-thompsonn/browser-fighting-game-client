import EditorTab from '../EditorTab'
import './EditorNavigator.css'

interface EditorNavigatorProps {
  options: string[]
  selected: string
  onSetSelected: (newSelection: string) => void;
}

const EditorNavigator = ({
  options,
  selected,
  onSetSelected
}: EditorNavigatorProps) => {
  return (
    <div className='editor-navigation'>
      {options.map((option) => (
        <EditorTab
          label={option}
          selected={option === selected}
          onSelected={() => onSetSelected(option)}
        />
      ))}
    </div>
  )
}

export default EditorNavigator;