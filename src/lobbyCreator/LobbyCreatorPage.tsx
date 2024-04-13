import { useState } from "react";
import LobbyManagementClient from "../lobbySelector/LobbyManagementClient";
import { useNavigate } from "react-router";

interface LobbyCreatorPageProps {
    lobbyManagementClient: LobbyManagementClient
}

export default function LobbyCreatorPage({
    lobbyManagementClient
}: LobbyCreatorPageProps) {
    const [lobbyName, setLobbyName] = useState<string>('')
    const [lobbyMaxPlayers, setLobbyMaxPlayers] = useState<number>(2)
    const navigate = useNavigate()

    const onSubmit = () => {
        // use a client for the lobby management API to make a lobby.
        lobbyManagementClient.createLobby(lobbyName, lobbyMaxPlayers)
            .then(({ lobbyID }) => {
                navigate(`/lobby/${lobbyID}`);
            })
    };

    return (
        <div>
            <h1>Create lobby</h1>
            <p>Lobby name</p>
            <input value={lobbyName} onChange={(event) => setLobbyName(event.target.value)}/>
            <p>Lobby max players</p>
            <input
                type="number"
                value={lobbyMaxPlayers}
                min={1}
                max={4}
                onChange={(event) => setLobbyMaxPlayers(parseInt(event.target.value))}
            />
            <button onClick={onSubmit}>Create Lobby</button>
        </div>
    )
}
