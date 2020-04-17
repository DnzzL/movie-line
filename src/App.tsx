import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { LandingPage } from './landing/LandingPage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path='/'>
            <LandingPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
