import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom'
import { useLocation, useNavigate } from "react-router"
import Canvas from './Canvas';
import { CharacterStatus, ControlsEventHandler } from './InterfaceUtils';
import ControlsHandler from './ControlsHandler';
import controlsMap from './ControlsMap.json';
import "./Game.css";
import GameEndInfo from './datatype/GameEndInfo';
import CreatedCharacterMessage from './CreatedCharacterMessage';
import GameStartInfo from './datatype/GameStartInfo';
import { Auth } from 'aws-amplify';
import { useQuery } from '@tanstack/react-query';

function App() {

  const [characterStates] = useState<Map<string, CharacterStatus>>(
    new Map(),
  );

  const [searchParams] = useSearchParams();

  const [characterID, setCharacterID] = useState<string|undefined>(undefined);

  const [gameWinner, setGameWinner] = useState<string|undefined>(undefined);

  const [gameStartTime, setGameStartTime] = useState<Date|undefined>(undefined);

  const [isDebug, setDebugMode] = useState<boolean>(searchParams.has('debug'));

  const [debugIdentity, setDebugIdentity] = useState<string>('PlayerID1')

  const [controlsHandler] = useState<ControlsHandler>(initControlsHandler());

  const { lobbyID, gameID } = useParams()

  const navigate = useNavigate();

  function initSocket() {
    const apiURL = process.env.REACT_APP_API_URL;
    if (apiURL) {
      return io(apiURL);
    }
    throw new Error("Missing environmental variable REACT_APP_API_URL");
  }

  const socket = useRef<Socket>(initSocket());

  const sendIdentity = async () => {
    const identityID = (await Auth.currentCredentials()).identityId
    socket.current.emit('sendIdentity', { playerID: identityID })
    socket.current.emit('joinGame', { gameID: gameID})
    console.log('Sent sendIdentity and joinGame signals!')
  }

  const { isPending: isSendIdentityPending} = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      if (!isDebug) await sendIdentity()
      return { status: 'done' }
    }
  })

  const emitControlsChange = (controlLabel: string, status: 'pressed' | 'released') => {
    socket.current.emit('controlsChange', {
      controlsChange: {
        control: controlLabel,
        status,
      }
    });
  }

  function initControlsHandler(): ControlsHandler {
    const controlsHandlers: ControlsEventHandler[] = Object.entries(controlsMap)
      .map(([controlLabel, controlKey]) => ({
        key: controlKey,
        onPress: () => emitControlsChange(controlLabel, 'pressed'),
        onRelease: () => emitControlsChange(controlLabel, 'released'),
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
    newSocket.on('startGame', ({ gameStartTime }: GameStartInfo) => {
      console.log(`Game starting. Current time: ${new Date()}. Start time: ${gameStartTime}`);
      setGameStartTime(gameStartTime);
    })
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

  const handleBackToLobby = () => {
    navigate(`/lobby/${lobbyID}`)
  }

  useEffect(() => {
    initSocketIo(socket.current);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }, []);

  const debugHandleSendIdentity = () => {
    socket.current.emit('sendIdentity', { playerID: debugIdentity });
  }

  const debugHandleJoinGame = () => {
    socket.current.emit('joinGame', { gameID: gameID });
  }

  return (
    <div className="App">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <input type="checkbox" checked={isDebug} title={"hello"} onChange={() => setDebugMode(!isDebug)}/>
        <p onClick={() => setDebugMode(!isDebug)}>Debug mode</p>
      </div>
      {isDebug? (
        <>
          <input value={debugIdentity} onChange={(event) => setDebugIdentity(event.target.value)}/>
          <button onClick={debugHandleSendIdentity}>Send identity</button>
          <button onClick={debugHandleJoinGame}>Join game</button>
        </>
      ) : null}
      <div className="Header-Container">
        <h1>Browser fighting game (Game ID: {gameID}, Lobby ID: {lobbyID})</h1>
      </div>
      <div className="Meta-controls-container">
        <button
          type="button"
          onClick={handleBackToLobby}
        >
          Back to lobby
        </button>
        sending identity: {isSendIdentityPending}
      </div>
      <div className="Canvas-Container">
        <Canvas
          characters={characterStates}
          gameWinner={gameWinner}
          gameStartTime={gameStartTime}
        />
      </div>
    </div>
  );
}

export default App;
