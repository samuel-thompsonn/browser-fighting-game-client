import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import { CharacterStatus, ControlsEventHandler } from './InterfaceUtils';
import ControlsHandler from './ControlsHandler';
import controlsMap from './ControlsMap.json';
import "./Game.css";
import GameEndInfo from './datatype/GameEndInfo';
import CreatedCharacterMessage from './CreatedCharacterMessage';
import { useLocation } from 'react-router';

interface GameState {
  gameID: string
}

function App() {

  const [characterStates] = useState<Map<string, CharacterStatus>>(
    new Map(),
  );

  const [characterID, setCharacterID] = useState<string|undefined>(undefined);

  const [gameWinner, setGameWinner] = useState<string|undefined>(undefined);

  const [controlsHandler] = useState<ControlsHandler>(initControlsHandler());

  const { gameID } = useLocation().state as GameState

  function initSocket() {
    const apiURL = process.env.REACT_APP_API_URL;
    if (apiURL) {
      return io(apiURL);
    }
    throw new Error("Missing environmental variable REACT_APP_API_URL");
  }

  const socket = useRef<Socket>(initSocket());

  function initControlsHandler(): ControlsHandler {
    const controlsHandlers: ControlsEventHandler[] = Object.entries(controlsMap)
      .map(([controlLabel, controlKey]) => ({
        key: controlKey,
        onPress: () => {
          socket.current.emit('controlsChange', {
            control: controlLabel,
            status: 'pressed',
          });
        },
        onRelease: () => {
          socket.current.emit('controlsChange', {
            control: controlLabel,
            status: 'released',
          });
        },
      }));
    return new ControlsHandler(...controlsHandlers);
  }

  function handleGameReset() {
    console.log("Game reset!");
    characterStates.clear();
    setGameWinner(undefined);
    setCharacterID(undefined);
  }

  // Called to respond to a request to create a character. Not called when
  // another client in the same game creates a character.
  function handleCreatedCharacter({ characterID }: CreatedCharacterMessage) {
    setCharacterID(characterID);
  }

  const initSocketIo = (newSocket:Socket) => {
    newSocket.on('accepted_connection', () => {
      // TODO: Bar other commands to server behind this?
    });
    newSocket.on('updateCharacter', (update:CharacterStatus) => {
      characterStates.set(update.id, update);
    });
    newSocket.on('removeCharacter', (removedCharacterIndex:string) => {
      characterStates.delete(removedCharacterIndex);
    });
    newSocket.on('gameComplete', ({ winnerID }:GameEndInfo) => {
      setGameWinner(winnerID);
    });
    newSocket.on('gameReset', handleGameReset);
    newSocket.on('createdCharacter', handleCreatedCharacter);
  };

  const handleKeyDown = (event:KeyboardEvent) => {
    controlsHandler.keyPressed(event.key);
  };

  const handleKeyUp = (event:KeyboardEvent) => {
    controlsHandler.keyReleased(event.key);
  };

  const handleRequestReset = () => {
    socket.current.emit("resetGame");
  }

  const handleCreateCharacter = () => {
    socket.current.emit("createCharacter");
  }

  useEffect(() => {
    initSocketIo(socket.current);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }, []);

  return (
    <div className="App">
      <div className="Header-Container">
        <h1>Browser fighting game (Game ID: {gameID})</h1>
      </div>
      <div className="Meta-controls-container">
        <button type="button" onClick={handleRequestReset}>Reset</button>
        <button
          type="button"
          onClick={handleCreateCharacter}
          disabled={characterID !== undefined}
        >
          Join
        </button>
      </div>
      <div className="Canvas-Container">
        <Canvas
          characters={characterStates}
          gameWinner={gameWinner}
        />
      </div>
    </div>
  );
}

export default App;
