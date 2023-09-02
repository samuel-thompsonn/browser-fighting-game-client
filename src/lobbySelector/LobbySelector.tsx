import LobbyData from "../datatype/LobbyData";
import LobbyEntry from "./LobbyEntry";

interface LobbySelectorProps {
    lobbies: LobbyData[]
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
                    lobbies.map((lobby) => (
                        <LobbyEntry
                            lobbyID={lobby.id}
                            lobbyName={lobby.name}
                            lobbyStatus={lobby.status}
                            lobbyMaxPlayerCount={lobby.maxPlayerCount}
                            lobbyPlayerCount={lobby.playerCount}
                            key={lobby.id}
                        />
                    ))
                }
            </tbody>
        </table>
    )
}
