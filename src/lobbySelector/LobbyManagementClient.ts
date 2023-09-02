import LobbyData from "../datatype/LobbyData";

export default interface LobbyManagementClient  {
    getAllLobbies: () => LobbyData[]; // TODO: Include pagination
}
