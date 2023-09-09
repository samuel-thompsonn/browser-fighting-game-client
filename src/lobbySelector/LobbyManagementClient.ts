import LobbyData from "../datatype/LobbyData";

export default interface LobbyManagementClient  {
    getAllLobbies: () => Promise<LobbyData[]>; // TODO: Include pagination
}
