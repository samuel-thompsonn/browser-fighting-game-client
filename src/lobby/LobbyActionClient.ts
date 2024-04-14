export default interface LobbyActionClient  {
    startGame: (identityID: string) => Promise<Response>;
}
