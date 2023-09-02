import LobbyData from "../datatype/LobbyData";

export default class LobbyManagementClientImpl  {
    getAllLobbies(): LobbyData[] {
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
}
