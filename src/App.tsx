import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import CharacterVisualizer from './CharacterVisualizer';
import { CharacterStatus, ControlsEventHandler } from './InterfaceUtils';
import ControlsHandler from './ControlsHandler';
import controlsMap from './ControlsMap.json';
import "./App.css";
import GameEndInfo from './datatype/GameEndInfo';

function App() {

  const [characterStates] = useState<Map<string, CharacterStatus>>(
    new Map(),
  );

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

  const [controlsHandler] = useState<ControlsHandler>(initControlsHandler());

  const initSocketIo = (newSocket:Socket) => {
    newSocket.on('accepted_connection', () => {
      newSocket.emit('createCharacter');
    });
    newSocket.on('updateCharacter', (update:CharacterStatus) => {
      characterStates.set(update.id, update);
    });
    newSocket.on('removeCharacter', (removedCharacterIndex:string) => {
      characterStates.delete(removedCharacterIndex);
    });
    newSocket.on('gameComplete', ({ winnerID }:GameEndInfo) => {
      console.log(`Player with ID ${winnerID} has won!`);

    });
  };

  const handleKeyDown = (event:KeyboardEvent) => {
    controlsHandler.keyPressed(event.key);
  };

  const handleKeyUp = (event:KeyboardEvent) => {
    controlsHandler.keyReleased(event.key);
  };

  useEffect(() => {
    initSocketIo(socket.current);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }, []);

  return (
    <div className="App">
      <div className="Header-Container">
        <h1>Browser fighting game</h1>
      </div>
      {/* Canvas should really just take in two characters, or take JSON translations of their state */}
      <div className="Canvas-Container">
        <Canvas
          characters={characterStates}
        />
      </div>
    </div>
  );
}

export default App;
