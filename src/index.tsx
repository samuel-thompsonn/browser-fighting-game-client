import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

import Game from './Game';
import EditorPageV1 from './characterEditorV1/CharacterEditorPage';
import AnimationTesterPage from './animationTester/AnimationTesterPage';
import TitlePage from './title/TitlePage';
import LobbySelectionPage from './lobbySelector/LobbySelectionPage';
import Lobby from './lobby/Lobby';
import LobbyManagementClientImpl from './lobbySelector/LobbyManagementClientImpl';
import { LobbyPlayground } from './lobby/LobbyPlayground';
import LobbyActionClientImpl from './lobby/LobbyActionClientImpl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LobbyCreatorPage from './lobbyCreator/LobbyCreatorPage';
import EditorPage from './editorPage/EditorPage';

Amplify.configure(awsconfig);

const lobbyManagementClient = new LobbyManagementClientImpl()
const lobbyActionClient = new LobbyActionClientImpl()

function lobbySelectionPage() {
  return <LobbySelectionPage
    lobbyManagementClient={lobbyManagementClient}
  />
}

function lobbyCreatorPage() {
  return <LobbyCreatorPage
    lobbyManagementClient={lobbyManagementClient}
  />
}

function lobby() {
  return <Lobby
    lobbyActionClient={lobbyActionClient}
  />
}

const container = document.getElementById('root')
const root = createRoot(container!)

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TitlePage/>}/>
          <Route path="/game/:lobbyID/:gameID" element={<Game/>}/>
          <Route path="/lobby-selection" element={lobbySelectionPage()}/>
          <Route path="/create-lobby" element={lobbyCreatorPage()}/>
          <Route path="/lobby/:lobbyID" element={lobby()}/>
          <Route path="/lobby-playground" element={<LobbyPlayground/>}/>
          <Route path="editor" element={<EditorPage/>}/>
          <Route path="animation-tester" element={<AnimationTesterPage/>}/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
