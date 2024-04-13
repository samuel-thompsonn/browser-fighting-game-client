import CreateLobbyResponse from "../datatype/CreateLobbyResponse";
import LobbyData from "../datatype/LobbyData";

export default interface LobbyManagementClient  {
    getAllLobbies: () => Promise<LobbyData[]>; // TODO: Include pagination
    createLobby: (lobbyName: string, maxPlayerCount: number) => Promise<CreateLobbyResponse>
}
