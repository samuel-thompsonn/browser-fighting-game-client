import { useEffect, useRef } from "react";
import Canvas from "../Canvas";
import Button from "../component/button/Button";
import { CharacterStatus, Direction } from "../InterfaceUtils";
import CharacterVisualizer from "../CharacterVisualizer";
import { Socket, io } from "socket.io-client";
import SocketConnection from "./SocketConnection";

function getCharacterStates(): Map<string, CharacterStatus> {
  const status: CharacterStatus = {
      id: 'id',
      position: { x: 0, y: 0 },
      state: 'idle1',
      healthInfo: { maxHealth: 100, health: 100 },
      direction: Direction.LEFT,
      collisionInfo: [],     
  }
  return new Map([
      ['hello', status]
  ]);
}

const initSocketConnection = () => {
  const apiURL = process.env.REACT_APP_API_URL
  if (apiURL) {
    return new SocketConnection(apiURL, document);
  }
  throw new Error("Missing environmental variable REACT_APP_API_URL")
}

interface EditorTesterProps {
  characterVisualizer: CharacterVisualizer
  onChangeGameID?: (gameID: string) => void
};

const EditorTester = ({
  characterVisualizer,
  onChangeGameID
}: EditorTesterProps) => {
  const socketConnectiton = useRef<SocketConnection>(initSocketConnection());

  const handleKeyPressed = (event: KeyboardEvent) => {
    socketConnectiton.current.handleKeyPressed(event)
  }

  const handleKeyReleased = (event: KeyboardEvent) => {
    socketConnectiton.current.handleKeyReleased(event)
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
    socketConnectiton.current.joinGame(identityID, gameID)
    if (onChangeGameID) {
      onChangeGameID(gameID)
    }
  }

  return (
    <div className="editor-tester-container">
      <div className="editor-canvas-container">
        <Canvas
          characterVisualizer={characterVisualizer}
          characters={socketConnectiton.current.getCharacterStates()}
          gameStartTime={new Date()}
        />
      </div>
      <Button onClick={onConnect}>Connect to Server</Button>
    </div>
  )
}

export default EditorTester;