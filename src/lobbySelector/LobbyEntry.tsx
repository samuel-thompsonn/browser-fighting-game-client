import { Link } from "react-router-dom"
import './LobbyEntry.css'

interface LobbyEntryProps {
    lobbyID: number
    lobbyName: string
    lobbyPlayerCount: number
    lobbyMaxPlayerCount: number
    lobbyStatus: string
}

export default function LobbyEntry({
    lobbyID,
    lobbyName,
    lobbyPlayerCount,
    lobbyMaxPlayerCount,
    lobbyStatus
}: LobbyEntryProps) {
    return (
        <tr className="LobbyEntry">
            <th scope="row">{lobbyName}</th>
            <td>{lobbyStatus}</td>
            <td>{lobbyPlayerCount}/{lobbyMaxPlayerCount} Players</td>
            <td>
                <Link to="/lobby" state={{ lobbyID: lobbyID, lobbyName: lobbyName }}>
                    <button>Join</button>
                </Link>
            </td>
        </tr>
    )
}