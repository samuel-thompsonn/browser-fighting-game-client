import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import CharacterVisualizer from './CharacterVisualizer';
import { CharacterUpdate, ControlsEventHandler } from './InterfaceUtils';
import ControlsHandler from './ControlsHandler';
import controlsMap from './ControlsMap.json';
import "./App.css";
import HealthVisualizer from './HealthVisualizer';

function App() {
  const [characterVisualizers] = useState<Map<string, CharacterVisualizer>>(
    new Map(),
  );

  const [characterHealthbars] = useState<Map<string, HealthVisualizer>>(
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
    newSocket.on('updateCharacter', (update:CharacterUpdate) => {
      let targetVisualizer = characterVisualizers.get(update.id);
      if (!targetVisualizer) {
        targetVisualizer = new CharacterVisualizer();
        characterVisualizers.set(update.id, targetVisualizer);
      }
      targetVisualizer.setAnimationState(update.state, update.collisionInfo);
      targetVisualizer.setPosition(update.position);

      let healthVisualizer = characterHealthbars.get(update.id);
      if (!healthVisualizer) {
        healthVisualizer = new HealthVisualizer();
        characterHealthbars.set(update.id, healthVisualizer);
      }
      healthVisualizer.setHealth(update.healthInfo.health, update.healthInfo.maxHealth);
    });

    newSocket.on('removeCharacter', (removedCharacterIndex:string) => {
      characterVisualizers.delete(removedCharacterIndex);
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
      <div className="Canvas-Container">
        <Canvas
          characterVisualizers={characterVisualizers}
          healthVisualizers={characterHealthbars}
        />
      </div>
    </div>
  );
}

export default App;
