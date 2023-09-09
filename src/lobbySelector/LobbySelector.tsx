import LobbyData from "../datatype/LobbyData";
import LobbyEntry from "./LobbyEntry";

interface LobbySelectorProps {
    lobbies?: LobbyData[]
}

function lobbyTableEntry(lobby: LobbyData) {
    return <LobbyEntry
        lobbyID={lobby.id}
        lobbyName={lobby.name}
        lobbyStatus={lobby.status}
        lobbyMaxPlayerCount={lobby.maxPlayerCount}
        lobbyPlayerCount={lobby.playerCount}
        key={lobby.id}
    />
}

export default function LobbySelector({
    lobbies
}: LobbySelectorProps) {
    return (
        <table>
            <thead>
                <tr>
                    <th scope="col">
                        Name
                    </th>
                    <th>
                        Status
                    </th>
                    <th>
                        Players
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    lobbies? 
                        lobbies.map(lobbyTableEntry)
                        : <tr><td colSpan={4}>Loading lobbies...</td></tr>
                }
            </tbody>
        </table>
    )
}
