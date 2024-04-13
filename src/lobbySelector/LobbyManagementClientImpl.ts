import CreateLobbyResponse from "../datatype/CreateLobbyResponse";
import LobbyData from "../datatype/LobbyData";
import LobbyManagementClient from "./LobbyManagementClient";

const LOBBY_MANAGEMENT_API_URL = 'https://lobby-management.sam-thompson-test-development.link';

export default class LobbyManagementClientImpl implements LobbyManagementClient {
    getAllLobbies(): Promise<LobbyData[]> {
        return fetch(`${LOBBY_MANAGEMENT_API_URL}/get_all_lobbies`, {
            method: 'GET'
        })
        .then((response) => response.json())
    }

    createLobby(lobbyName: string, maxPlayerCount: number): Promise<CreateLobbyResponse> {
        return fetch(`${LOBBY_MANAGEMENT_API_URL}/create_lobby`, {
            method: 'POST',
            body: JSON.stringify({
                name: lobbyName,
                maxPlayerCount,
            })
        })
        .then((response) => response.json());
    }
}
