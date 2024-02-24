export default interface LobbyActionClient  {
    startGame: () => Promise<Response>;
}
