import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import EditorPage from './characterEditor/CharacterEditorPage';
import AnimationTesterPage from './animationTester/AnimationTesterPage';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
        </Route>
        <Route path="editor" element={<EditorPage/>}/>
        <Route path="animation-tester" element={<AnimationTesterPage/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
