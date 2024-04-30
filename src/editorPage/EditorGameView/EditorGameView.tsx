import Canvas from "../../Canvas"
import CharacterVisualizer from "../../CharacterVisualizer"
import SocketConnection from "../SocketConnection"
import './EditorGameView.css'

interface EditorGameViewProps {
  characterVisualizer: CharacterVisualizer
  socketConnection: SocketConnection
}

const EditorGameView = ({
  characterVisualizer,
  socketConnection,
}: EditorGameViewProps) => {
  return (
    <div className="editor-canvas-container">
      <Canvas
        characterVisualizer={characterVisualizer}
        characters={socketConnection.getCharacterStates()}
        gameStartTime={new Date()}
      />
    </div>
  )
}

export default EditorGameView
