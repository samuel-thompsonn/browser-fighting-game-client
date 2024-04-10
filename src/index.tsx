import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

import Game from './Game';
import EditorPage from './characterEditor/CharacterEditorPage';
import AnimationTesterPage from './animationTester/AnimationTesterPage';
import TitlePage from './title/TitlePage';
import LobbySelectionPage from './lobbySelector/LobbySelectionPage';
import Lobby from './lobby/Lobby';
import LobbyManagementClientImpl from './lobbySelector/LobbyManagementClientImpl';
import { LobbyPlayground } from './lobby/LobbyPlayground';
import LobbyActionClientImpl from './lobby/LobbyActionClientImpl';

Amplify.configure(awsconfig);

const lobbyManagementClient = new LobbyManagementClientImpl()
const lobbyActionClient = new LobbyActionClientImpl()

function lobbySelectionPage() {
  return <LobbySelectionPage
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

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TitlePage/>}/>
        <Route path="/game/:lobbyID/:gameID" element={<Game/>}/>
        <Route path="/lobby-selection" element={lobbySelectionPage()}/>
        <Route path="/lobby/:lobbyID" element={lobby()}/>
        <Route path="/lobby-playground" element={<LobbyPlayground/>}/>
        <Route path="editor" element={<EditorPage/>}/>
        <Route path="animation-tester" element={<AnimationTesterPage/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
