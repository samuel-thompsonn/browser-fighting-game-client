import { io, Socket } from "socket.io-client";
import { CharacterStatus, ControlsEventHandler } from "../InterfaceUtils";
import ControlsHandler from "../ControlsHandler";
import controlsMap from '../ControlsMap.json'

class SocketConnection {
  characterStates: Map<string, CharacterStatus>
  socket: Socket
  controlsHandler: ControlsHandler

  constructor(apiUrl: string, document: Document) {
    this.characterStates = new Map();
    this.socket = io(apiUrl);
    this.initSocketIo(this.socket);
    this.controlsHandler = this.initControlsHandler();
    this.addKeyListeners(document);
  }

  addKeyListeners(document: Document) {
    document.addEventListener('keydown', (event) => this.controlsHandler.keyPressed(event.key));
    document.addEventListener('keyup', (event) => this.controlsHandler.keyReleased(event.key));
  }

  initControlsHandler() {
    const controlsHandlers: ControlsEventHandler[] = Object.entries(controlsMap)
      .map(([controlLabel, controlKey]) => ({
        key: controlKey,
        onPress: () => this.emitControlsChange(controlLabel, 'pressed'),
        onRelease: () => this.emitControlsChange(controlLabel, 'released'),
      }));
    return new ControlsHandler(...controlsHandlers);
  }

  getCharacterStates() {
    return this.characterStates;
  }

  // This should be private!
  initSocketIo(newSocket: Socket) {
    newSocket.on('updateCharacter', (update:CharacterStatus) => {
      this.characterStates.set(update.id, update);
    });
    newSocket.on('removeCharacter', (removedCharacterIndex:string) => {
      this.characterStates.delete(removedCharacterIndex);
    });
    // newSocket.on('startGame', ({ gameStartTime }: GameStartInfo) => {
    //   console.log(`Game starting. Current time: ${new Date()}. Start time: ${gameStartTime}`);
    //   setGameStartTime(gameStartTime);
    // })
    // newSocket.on('gameComplete', ({ winnerID }:GameEndInfo) => {
    //   setGameWinner(winnerID);
    // });
  };

  joinGame(identityID: string, gameID: string) {
    this.socket.emit('sendIdentity', { playerID: identityID });
    this.socket.emit('joinGame', { gameID: gameID })
  }

  // Private method
  emitControlsChange(controlLabel: string, status: 'pressed' | 'released') {
    this.socket.emit('controlsChange', {
      controlsChange: {
        control: controlLabel,
        status,
      }
    });
  }

  handleKeyPressed(keyPressEvent: KeyboardEvent) {
    this.controlsHandler.keyPressed(keyPressEvent.key)
  }

  handleKeyReleased(keyPressEvent: KeyboardEvent) {
    this.controlsHandler.keyReleased(keyPressEvent.key)
  }
}

export default SocketConnection;