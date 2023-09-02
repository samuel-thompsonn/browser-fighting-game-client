import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Game from './Game';
import EditorPage from './characterEditor/CharacterEditorPage';
import AnimationTesterPage from './animationTester/AnimationTesterPage';
import TitlePage from './title/TitlePage';
import LobbySelectionPage from './lobbySelector/LobbySelectionPage';
import Lobby from './lobby/Lobby';
import LobbyManagementClientImpl from './lobbySelector/LobbyManagementClientImpl';

const lobbyManagementClient = new LobbyManagementClientImpl()

function lobbySelectionPage() {
  return <LobbySelectionPage
    lobbyManagementClient={lobbyManagementClient}
  />
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TitlePage/>}/>
        <Route path="/game" element={<Game/>}/>
        <Route path="/lobby-selection" element={lobbySelectionPage()}/>
        <Route path="/lobby" element={<Lobby/>}/>
        <Route path="editor" element={<EditorPage/>}/>
        <Route path="animation-tester" element={<AnimationTesterPage/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
