import LobbyData from "../datatype/LobbyData";
import LobbyManagementClient from "./LobbyManagementClient";

export default class LobbyManagementClientImpl implements LobbyManagementClient {
    getAllLobbies(): Promise<LobbyData[]> {
        return fetch('https://sam-thompson-test-development.link/get_all_lobbies', {
            method: 'GET'
        })
        .then((response) => response.json())
    }
}
