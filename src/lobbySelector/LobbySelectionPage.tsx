import { Link } from "react-router-dom"
import LobbyData from "../datatype/LobbyData"
import LobbySelector from "./LobbySelector"
import LobbyManagementClient from "./LobbyManagementClient"
import { useEffect, useState } from "react"
import { Authenticator } from '@aws-amplify/ui-react';
import { Auth } from "aws-amplify"
import { CognitoUser } from "@aws-amplify/auth"

// Maybe we should just pass in the functions necessary, rather
// than passing in the whole client?
interface LobbySelectionPageProps {
    lobbyManagementClient: LobbyManagementClient
}

export default function LobbySelectionPage({
    lobbyManagementClient
}: LobbySelectionPageProps) {

    const [lobbies, setLobbies] = useState<LobbyData[]|undefined>(undefined)
    const [userName, setUserName] = useState<string|undefined>(undefined)

    // lobbyManagementClient.getAllLobbies().then((lobbyList) => setLobbies(lobbyList))

    useEffect(() => {
        lobbyManagementClient.getAllLobbies().then((lobbyList) => setLobbies(lobbyList))
        Auth.currentAuthenticatedUser().then((val: CognitoUser) => {
            setUserName(val.getUsername())
        })
    }, [])

    async function signOutWrapper(signOutFunction?: () => void) {
        signOutFunction?.()
        setUserName(undefined)
    }

    return (
        <div>
            <div className="Navigation-Bar">
                <Authenticator>
                    {({ signOut, user }) => (
                        <div>
                            <p>{user?.getUsername()}</p>
                            <button onClick={() => signOutWrapper(signOut)}>Sign out</button>
                        </div>
                    )}
                </Authenticator>
            </div>
            <h1>Select Lobby</h1>
            <Link to="/lobby" state={{ lobbyID: "lobbyID", lobbyName: "lobbyName" }}>
                DEV: lobby link
            </Link>
            <Link to="/">
                <button>Back to title</button>
            </Link>
                <LobbySelector
                    lobbies={lobbies}
                />
        </div>
    )
}
