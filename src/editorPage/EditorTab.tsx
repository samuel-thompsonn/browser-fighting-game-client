import './EditorTab.css'

interface EditorTabProps {
  label: string
  selected?: boolean
  onSelected?: () => void;
}

const EditorTab = ({
  label,
  selected,
  onSelected,
}: EditorTabProps) => {
  return (
    <button
      className={`editor-tab ${selected ? 'editor-tab-selected' : ''}`}
      onClick={onSelected}
    >
      {label}
    </button>
  )
}

export default EditorTab;
