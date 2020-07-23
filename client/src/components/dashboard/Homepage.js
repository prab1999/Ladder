import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import CreateLadder from "./components/create-ladder.component";
import LadderList from "./components/ladder-list.component";


class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Ladders</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Ladder</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={LadderList} />
          
          <Route path="/create" component={CreateLadder} />
        </div>
      </Router>
    );
  }
}

export default App;