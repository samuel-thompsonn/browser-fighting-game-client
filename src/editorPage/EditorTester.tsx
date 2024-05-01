import { useEffect, useRef, useState } from "react";
import Button from "../component/button/Button";
import CharacterVisualizer from "../CharacterVisualizer";
import SocketConnection from "./SocketConnection";
import './EditorTester.css';
import EditorNavigator from "./EditorNavigator/EditorNavigator";
import EditorGameView from "./EditorGameView/EditorGameView";
import EditorAnimationView from "./EditorAnimationView/EditorAnimationView";
import AnimationFileData from "../AnimationFileData";

const initSocketConnection = () => {
  const apiURL = process.env.REACT_APP_API_URL
  if (apiURL) {
    return new SocketConnection(apiURL, document);
  }
  throw new Error("Missing environmental variable REACT_APP_API_URL")
}

interface EditorTesterProps {
  characterVisualizer: CharacterVisualizer
  onChangeGameID?: (gameID: string) => void,
  characterAnimationData: AnimationFileData,
  onChangeAnimationData?: (animationData: AnimationFileData) => void
};

const EditorTester = ({
  characterVisualizer,
  onChangeGameID,
  characterAnimationData,
  onChangeAnimationData,
}: EditorTesterProps) => {
  const [selectedView, setSelectedView] = useState<string>('Animate');
  const [canvasScale, setCanvasScale] = useState<number>(1);
  const [selectedState, setSelectedState] = useState<string>('idle')
  const socketConnection = useRef<SocketConnection>(initSocketConnection());

  const handleKeyPressed = (event: KeyboardEvent) => {
    socketConnection.current.handleKeyPressed(event)
  }

  const handleKeyReleased = (event: KeyboardEvent) => {
    socketConnection.current.handleKeyReleased(event)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPressed);
    document.addEventListener('keyup', handleKeyReleased);
    return () => {
      document.addEventListener('keydown', handleKeyPressed);
      document.addEventListener('keyup', handleKeyReleased);
    }
  }, []);

  const onConnect = async () => {
    const identityID = 'debugPlayer';
    const response = await fetch('http://localhost:3001/debug/start-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ players: [identityID] }),
    });
    const gameID = (await response.json()).gameID;
    socketConnection.current.joinGame(identityID, gameID)
    if (onChangeGameID) {
      onChangeGameID(gameID)
    }
  }

  const getView = (view: string) => {
    switch (view) {
      case 'Play':
        return (
          <div>
            <EditorGameView
              characterVisualizer={characterVisualizer}
              socketConnection={socketConnection.current}
            />
            <Button onClick={onConnect}>Connect to Server</Button>
          </div>
        )
      case 'Animate':
        return (
          <EditorAnimationView
            key="editor-animation-view"
            animationData={characterAnimationData}
            onChangeAnimationData={onChangeAnimationData}
            canvasScale={canvasScale}
            setCanvasScale={(newCanvasScale) => setCanvasScale(newCanvasScale)}
            selectedState={selectedState}
            setSelectedState={(newSelectedState) => setSelectedState(newSelectedState)}
          />
        )
      default:
        return () => null
    }
  }

  return (
    <div className="editor-tester-container">
      <EditorNavigator
        options={['Play', 'Animate']}
        selected={selectedView}
        onSetSelected={setSelectedView}
      />
      {getView(selectedView)}
      {/* <EditorAnimationView
        key="editor-animation-view"
        animationData={characterAnimationData}
        onChangeAnimationData={onChangeAnimationData}
        canvasScale={canvasScale}
        setCanvasScale={(newCanvasScale) => setCanvasScale(newCanvasScale)}
        selectedState={selectedState}
        setSelectedState={(newSelectedState) => setSelectedState(newSelectedState)}
      /> */}
    </div>
  )
}

export default EditorTester;