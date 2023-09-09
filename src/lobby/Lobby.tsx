import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Link } from "react-router-dom"
import useWebSocket, { ReadyState } from "react-use-websocket"

interface LobbyState {
    lobbyID: number
    lobbyName: string
}

interface PlayerStatus {
    player: string,
    status: {
        ready: boolean
    }
}

export default function Lobby() {
    const SOCKET_URL = "wss://4ij89cwmg8.execute-api.us-east-1.amazonaws.com/Prod"
    const [playerStatusUpdates, setPlayerStatusUpdates] = useState<PlayerStatus[]>([])
    const [ready, setReadiness] = useState<boolean>()
    const { lobbyID, lobbyName } = useLocation().state as LobbyState

    const navigate = useNavigate()
    const { sendJsonMessage, lastMessage, readyState } = useWebSocket(SOCKET_URL, {
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
      if (lastMessage !== null) {
        console.log("Message received!")
        console.log(lastMessage)
        const messageData = JSON.parse(lastMessage.data)
        switch (messageData.action) {
            case ('updateStatus'):
                const statusUpdate = messageData.body as PlayerStatus
                console.log(`updateStatus: ${statusUpdate}`)
                setPlayerStatusUpdates((prev) => prev.concat(statusUpdate))
                break;
            case ('getAllStatusesResponse'):
                const statusUpdates = messageData.body as PlayerStatus[]
                statusUpdates.forEach((statusUpdate) => {
                    console.log(`updateStatus: ${statusUpdate}`)
                    setPlayerStatusUpdates((prev) => prev.concat(statusUpdate))
                })
                break;
        }
      }
    }, [lastMessage, setPlayerStatusUpdates]);

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

    function toggleReadiness() {
        // Make an API call using the lobby ID and some kind of self identifier
        // to toggle readiness status as visible to another user.
        // Should use a websocket, since we want to give live updates to each
        // other lobby member.
        sendJsonMessage({
            action: "updateStatus",
            status: {
                ready: !ready
            }
        })
        setReadiness(!ready)
    }

    return (
        <div>
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
