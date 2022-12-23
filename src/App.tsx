import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import Canvas from './Canvas';
import Visualizer from './Visualizer';
import { CharacterUpdate, ControlsEventHandler } from './InterfaceUtils';
import ControlsHandler from './ControlsHandler';
import controlsMap from './ControlsMap.json';
import "./App.css";

function App() {
  const [visualizers] = useState<Map<string, Visualizer>>(
    new Map(),
  );

  function initSocket() {
    return io();
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
      let targetVisualizer = visualizers.get(update.id);
      if (!targetVisualizer) {
        targetVisualizer = new Visualizer();
        visualizers.set(update.id, targetVisualizer);
      }
      targetVisualizer.setAnimationState(update.state, update.collisionInfo);
      targetVisualizer.setPosition(update.position);
    });

    newSocket.on('removeCharacter', (removedCharacterIndex:string) => {
      visualizers.delete(removedCharacterIndex);
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
        <Canvas visualizers={visualizers} />
      </div>
    </div>
  );
}

export default App;
