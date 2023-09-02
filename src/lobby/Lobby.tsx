import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Link } from "react-router-dom"

interface LobbyState {
    lobbyID: number
    lobbyName: string
}

export default function Lobby() {
    const [ready, setReadiness] = useState<boolean>()
    const { lobbyID, lobbyName } = useLocation().state as LobbyState
    const navigate = useNavigate()

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
        setReadiness(!ready)
    }

    return (
        <div>
            <h1>Lobby: {lobbyName}</h1>
            <p>ID: {lobbyID} </p>
            <Link to="/lobby-selection">
                <button>Back to Lobby Menu</button>
            </Link>
            <p>Select your character:</p>
            <select>
                <option id="0">Ryu</option>
            </select>
            <button onClick={toggleReadiness}>{!ready? "Ready" : "Not ready"}</button>
            <button onClick={handleStartGame} disabled={!ready}>Start Game</button>
        </div>
    )
}
