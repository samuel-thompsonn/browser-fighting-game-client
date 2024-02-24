import { WithAuthenticatorProps, withAuthenticator } from "@aws-amplify/ui-react"
import { Auth } from "aws-amplify"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useParams, Link } from "react-router-dom"
import useWebSocket, { ReadyState } from "react-use-websocket"

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

interface StartGameMessage {
    address: string
}

function Lobby({ signOut, user }: WithAuthenticatorProps) {
    const SOCKET_URL = "wss://lobby-action-ws.sam-thompson-test-development.link"
    const [playerStatusUpdates, setPlayerStatusUpdates] = useState<PlayerStatus[]>([])
    const [ready, setReadiness] = useState<boolean>(false)
    const { lobbyID } = useParams();

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
                break
            case 'startGame':
                const startGameMessage = lastJsonMessage.body as StartGameMessage
                navigate(`/game/${lobbyID}`, { state: { gameID: 1241, address: startGameMessage.address }})
                break
            default:
                console.log(`no route defined for action ${lastJsonMessage.action}.`)
        }
      }
    }, [lastJsonMessage, setPlayerStatusUpdates, navigate]);

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
        sendJsonMessage({ action: "startGame" })
        // TODO: Remove the navigation below since that is done in response to
        // the incoming message
        navigate(`/game/${lobbyID}`, { state: { gameID: 1241, address: "address" }})
    }

    async function toggleReadiness() {
        // Make an API call using the lobby ID and some kind of self identifier
        // to toggle readiness status as visible to another user.
        // Should use a websocket, since we want to give live updates to each
        // other lobby member.
        let token
        try {
            token = (await Auth.currentSession()).getIdToken()
        } catch (err) {
            token = undefined
        }
        const identityID = (await Auth.currentCredentials()).identityId
        sendJsonMessage({
            action: "updateStatus",
            identityID,
            status: {
                ready: !ready
            },
            token,
        })
        setReadiness(!ready)
    }

    return (
        <div>
            <div className="User-Info-Bar">
                <p>{user?.getUsername()}</p>
                <button onClick={signOut}>Sign out</button>
            </div>
            {/* TODO: Derive lobby name from Lobby Action REST API */}
            <h1>Lobby: {"Lobby Name Placeholder"}</h1>
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

// export default withAuthenticator(Lobby)
export default Lobby
