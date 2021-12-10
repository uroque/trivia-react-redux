import React from 'react';
import { Route, Switch } from 'react-router-dom';
import logo from './trivia.png';
import './App.css';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Game from './pages/Game';
import Feedback from './pages/Feedback';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
        <p>
          SUA VEZ
        </p>
      </header>
      <Switch>
        <Route path="/settingspage" component={ Settings } />
        <Route path="/game/:questionindex" component={ Game } />
        <Route path="/feedback" component={ Feedback } />
        <Route path="/" component={ Login } />
      </Switch>
    </div>
  );
}
