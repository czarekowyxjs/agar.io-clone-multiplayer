import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Game from './components/Game/Game.jsx'
import Lost from './components/Lost/Lost.jsx';

class App extends Component {
  render() {
    return (
      <div id="app">
      	<BrowserRouter>
	        <Switch>
	        	<Route path="/" exact={true} component={Login}/>
	        	<Route path="/game" component={Game}/>
            <Route path="/lost" component={Lost}/>
	        </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
