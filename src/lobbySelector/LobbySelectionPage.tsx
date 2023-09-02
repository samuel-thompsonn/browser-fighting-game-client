import { Link } from "react-router-dom"
import LobbyData from "../datatype/LobbyData"
import LobbySelector from "./LobbySelector"
import LobbyManagementClient from "./LobbyManagementClient"

function fetchLobbies(): LobbyData[] {
    return [
        {
            id: 3,
            name: "Placeholder lobby name",
            status: "Waiting for players",
            playerCount: 1,
            maxPlayerCount: 2
        },
        {
            id: 7,
            name: "Placeholder lobby name 2",
            status: "In-Game",
            playerCount: 2,
            maxPlayerCount: 2
        }
    ]
}

// Maybe we should just pass in the functions necessary, rather
// than passing in the whole client?
interface LobbySelectionPageProps {
    lobbyManagementClient: LobbyManagementClient
}

export default function LobbySelectionPage({
    lobbyManagementClient
}: LobbySelectionPageProps) {
    const lobbies = fetchLobbies()

    return (
        <div>
            <h1>Select Lobby</h1>
            <Link to="/">
                <button>Back to title</button>
            </Link>
            <LobbySelector
                lobbies={lobbies}
            />
        </div>
    )
}
