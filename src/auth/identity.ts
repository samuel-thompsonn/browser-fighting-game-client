import { Auth } from 'aws-amplify';

/**
 * Identity resolution with a local mock-auth path.
 *
 * In production the player's identity comes from Amazon Cognito. For local
 * development that requires AWS credentials / SSO just to load the app, which is
 * friction we don't want. When `REACT_APP_MOCK_AUTH=true` these helpers return a
 * deterministic local identity and never call Cognito, so `npm start` works with
 * no AWS at all.
 *
 * For local two-player testing, each browser tab can override its identity with a
 * `?mockIdentity=<name>` query parameter (e.g. open the game in two tabs as
 * `PlayerID1` and `PlayerID2`).
 */

const isMockAuth = (): boolean => process.env.REACT_APP_MOCK_AUTH === 'true';

const mockIdentityId = (): string => {
  const params = new URLSearchParams(window.location.search);
  return (
    params.get('mockIdentity')
    || process.env.REACT_APP_MOCK_IDENTITY_ID
    || 'local-player'
  );
};

/** Resolve the current player's identity id (Cognito identityId, or a mock). */
export async function getIdentityId(): Promise<string> {
  if (isMockAuth()) {
    return mockIdentityId();
  }
  return (await Auth.currentCredentials()).identityId;
}

/**
 * Resolve an auth token to attach to lobby messages. Returns undefined under
 * mock auth (the local stack does not verify tokens) or if there is no session.
 */
export async function getIdToken(): Promise<unknown> {
  if (isMockAuth()) {
    return undefined;
  }
  try {
    return (await Auth.currentSession()).getIdToken();
  } catch {
    return undefined;
  }
}
