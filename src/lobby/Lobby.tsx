import { WithAuthenticatorProps, withAuthenticator } from "@aws-amplify/ui-react"
import { Auth } from "aws-amplify"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Link } from "react-router-dom"
import useWebSocket, { ReadyState } from "react-use-websocket"

interface LobbyState {
    lobbyID: number
    lobbyName: string
}

interface PlayerStatus {
    player: string
    status: {
        ready: boolean
    }
    connected?: boolean
}

interface PlayerDisconnectMessage {
    player: string
}

function Lobby({ signOut, user }: WithAuthenticatorProps) {
    const SOCKET_URL = "wss://t2uuwnon19.execute-api.us-east-1.amazonaws.com/Prod"
    const [playerStatusUpdates, setPlayerStatusUpdates] = useState<PlayerStatus[]>([])
    const [ready, setReadiness] = useState<boolean>(false)
    const { lobbyID, lobbyName } = useLocation().state as LobbyState

    const navigate = useNavigate()
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(SOCKET_URL, {
        onOpen: onConnectWebsocket
    });

    function onConnectWebsocket(event: WebSocketEventMap['open']) {
        console.log(event)
        sendJsonMessage({
            action: "getAllStatuses"
        })
        sendJsonMessage({
            action: "updateStatus",
            status: {
                ready: ready
            }
        })
    }

    useEffect(() => {
      if (lastJsonMessage !== null) {
        console.log("Message received!")
        console.log(lastJsonMessage)
        switch (lastJsonMessage.action) {
            case ('updateStatus'):
                const statusUpdate = lastJsonMessage.body as PlayerStatus
                console.log(`updateStatus: ${JSON.stringify(statusUpdate)}`)
                setPlayerStatusUpdates((prev) => prev.concat(statusUpdate))
                break;
            case ('getAllStatusesResponse'):
                const statusUpdates = lastJsonMessage.body as PlayerStatus[]
                statusUpdates.forEach((statusUpdate) => {
                    console.log(`updateStatus: ${JSON.stringify(statusUpdate)}`)
                    setPlayerStatusUpdates((prev) => prev.concat(statusUpdate))
                })
                break;
            case ('playerDisconnect'):
                const playerDisconnectMessage = lastJsonMessage.body as PlayerDisconnectMessage
                const disconnectStatusUpdate = {
                    player: playerDisconnectMessage.player,
                    status: {
                        ready: false,
                        connected: false
                    }
                }
                console.log(`Player ${disconnectStatusUpdate.player} disconnected from the lobby.`)
                setPlayerStatusUpdates((prev) => prev.concat(disconnectStatusUpdate))
                break;
            default:
                console.log(`no route defined for action ${lastJsonMessage.action}.`)
        }
      }
    }, [lastJsonMessage, setPlayerStatusUpdates]);

    function playerStatusList(): PlayerStatus[] {
        const playerStatusMap = new Map()
        playerStatusUpdates.forEach((playerStatusUpdate) => {
            playerStatusMap.set(playerStatusUpdate.player, playerStatusUpdate)
        })
        return Array.from(playerStatusMap.values())
    }

    const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    function handleStartGame() {
        // TODO: Have this make a call to an API orchestrating starting game.
        // The API will then return a game ID and/or host which we will pass as
        // state to the game.
        navigate('/game', { state: { gameID: 1241 }})
    }

    async function toggleReadiness() {
        // Make an API call using the lobby ID and some kind of self identifier
        // to toggle readiness status as visible to another user.
        // Should use a websocket, since we want to give live updates to each
        // other lobby member.
        sendJsonMessage({
            action: "updateStatus",
            status: {
                ready: !ready
            },
            token: (await Auth.currentSession()).getIdToken()
        })
        setReadiness(!ready)
    }

    return (
        <div>
            <div className="User-Info-Bar">
                <p>{user?.getUsername()}</p>
                <button onClick={signOut}>Sign out</button>
            </div>
            <h1>Lobby: {lobbyName}</h1>
            <p>ID: {lobbyID} </p>
            <p>Connection: {connectionStatus}</p>
            <Link to="/lobby-selection">
                <button>Back to Lobby Menu</button>
            </Link>
            <p>Select your character:</p>
            <select>
                <option id="0">Ryu</option>
            </select>
            <button onClick={toggleReadiness}>{!ready? "Ready" : "Not ready"}</button>
            <button onClick={handleStartGame} disabled={!ready}>Start Game</button>
            {
                playerStatusList().map((playerStatus) => <p key={playerStatus.player}>{JSON.stringify(playerStatus)}</p>)
            }
        </div>
    )
}

export default withAuthenticator(Lobby)
