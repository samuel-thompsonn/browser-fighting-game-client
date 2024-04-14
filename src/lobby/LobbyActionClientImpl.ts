import LobbyActionClient from "./LobbyActionClient";

const LOBBY_ACTION_API_ENDPOINT = "https://lobby-action-http.sam-thompson-test-development.link"

export default class LobbyActionClientImpl implements LobbyActionClient {
    startGame = (identityID: string) => {
        const request = new Request(`${LOBBY_ACTION_API_ENDPOINT}/start-game`);
        return fetch(request, { method: "POST", mode: "cors", body: JSON.stringify({ identityID }) })
    }
}