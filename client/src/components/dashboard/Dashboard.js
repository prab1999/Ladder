import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CreateLadder from "./create-ladder.component";
import LadderList from "./ladder-list.component";
import LadderView from "./view-ladder.component";
import constants from "../../constant";
class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
render() {
    const { user } = this.props.auth;
    console.log(user);
    constants.user=user;
  
return (<Router>
  <div className="container">
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
            <Link to="/dashboard" className="nav-link">Ladders</Link>
          </li>
          <li className="navbar-item">
            <Link to="/create" className="nav-link">Create Ladder</Link>
          </li>
          <li>
          <button
              // style={{
              //   width: "150px",
              //   borderRadius: "3px",
              //   letterSpacing: "1.5px",
              //   marginTop: "1rem"
              // }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
    <br/>
    <Route path="/dashboard" exact component={LadderList} />
    <Route path="/create" component={CreateLadder} /> 
    <Route path="/view" component={LadderView}/>
  </div>
</Router>
     
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);