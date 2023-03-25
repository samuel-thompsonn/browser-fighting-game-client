import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import CharacterVisualizer from './CharacterVisualizer';
import { CharacterStatus, ControlsEventHandler } from './InterfaceUtils';
import ControlsHandler from './ControlsHandler';
import controlsMap from './ControlsMap.json';
import "./App.css";
import HealthVisualizer from './HealthVisualizer';

function App() {
  const [characterVisualizers] = useState<Map<string, CharacterVisualizer>>(
    new Map(),
  );

  const [characterStates, setCharacterStates] = useState<Map<string, CharacterStatus>>(
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
      let targetVisualizer = characterVisualizers.get(update.id);
      if (!targetVisualizer) {
        targetVisualizer = new CharacterVisualizer();
        characterVisualizers.set(update.id, targetVisualizer);
      }
      targetVisualizer.setAnimationState(update.state, update.collisionInfo);
      targetVisualizer.setPosition(update.position);

      characterStates.set(update.id, update);
      setCharacterStates(characterStates);
    });

    newSocket.on('removeCharacter', (removedCharacterIndex:string) => {
      characterVisualizers.delete(removedCharacterIndex);
      characterStates.delete(removedCharacterIndex);
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
          characterVisualizers={characterVisualizers}
          characters={characterStates}
        />
      </div>
    </div>
  );
}

export default App;
