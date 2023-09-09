import LobbyData from "../datatype/LobbyData";
import LobbyManagementClient from "./LobbyManagementClient";

export default class LobbyManagementClientImpl implements LobbyManagementClient {
    getAllLobbies(): Promise<LobbyData[]> {
        return fetch('https://sam-thompson-test-development.link/get_all_lobbies', {
            method: 'GET'
        })
        .then((response) => response.json())
        // return [
        //     {
        //         id: 3,
        //         name: "Placeholder lobby name",
        //         status: "Waiting for players",
        //         playerCount: 1,
        //         maxPlayerCount: 2
        //     },
        //     {
        //         id: 7,
        //         name: "Placeholder lobby name 2",
        //         status: "In-Game",
        //         playerCount: 2,
        //         maxPlayerCount: 2
        //     }
        // ]
    }
}
