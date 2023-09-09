import { Link } from "react-router-dom"
import LobbyData from "../datatype/LobbyData"
import LobbySelector from "./LobbySelector"
import LobbyManagementClient from "./LobbyManagementClient"
import { useEffect, useState } from "react"

// Maybe we should just pass in the functions necessary, rather
// than passing in the whole client?
interface LobbySelectionPageProps {
    lobbyManagementClient: LobbyManagementClient
}

export default function LobbySelectionPage({
    lobbyManagementClient
}: LobbySelectionPageProps) {

    const [lobbies, setLobbies] = useState<LobbyData[]|undefined>(undefined)

    // lobbyManagementClient.getAllLobbies().then((lobbyList) => setLobbies(lobbyList))

    useEffect(() => {
        lobbyManagementClient.getAllLobbies().then((lobbyList) => setLobbies(lobbyList))
    }, [])
    // const lobbies = lobbyManagementClient.getAllLobbies()

    return (
        <div>
            <h1>Select Lobby</h1>
            <Link to="/lobby" state={{ lobbyID: "lobbyID", lobbyName: "lobbyName" }}>
                DEV: lobby link
            </Link>
            <Link to="/">
                <button>Back to title</button>
            </Link>
            <LobbySelector
                lobbies={lobbies}
            />
        </div>
    )
}
