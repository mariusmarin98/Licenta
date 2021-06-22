import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import M from "materialize-css";
import { logoutUser } from "../../actions/authActions";
import { USER_ROLE_STUDENT, USER_ROLE_TEACHER } from "../../utils/constants";

class Navbar extends Component {
  componentDidMount() {
    M.Sidenav.init(document.querySelectorAll(".sidenav"), {});
  }

  getRoutes = (user, isAuthenticated) =>
    isAuthenticated ? (
      <>
        {user.role === USER_ROLE_TEACHER ? (
          <>
            <li>
              <Link to="/teacher-courses">My Courses</Link>
            </li>
            <li>
              <Link to="/students">Students</Link>
            </li>
          </>
        ) : user.role === USER_ROLE_STUDENT ? (
          <>
            <li>
              <Link to="/student-courses">My Courses</Link>
            </li>
            <li>
              <Link to="/teachers">Teachers</Link>
            </li>
          </>
        ) : null}
        <li>
          <Link to="/courses">Courses</Link>
        </li>
        <li>
          <a onClick={this.onLogoutClick}>Log Out</a>
        </li>
      </>
    ) : (
      <>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Log In</Link>
        </li>
      </>
    );

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { auth = {} } = this.props;
    const { user = {}, isAuthenticated = false } = auth;

    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper black">
            <Link to="/" className="brand-logo">
              Homework App
            </Link>
            <a data-target="mobile-demo" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              {this.getRoutes(user, isAuthenticated)}
            </ul>
          </div>
        </nav>
        <ul className="sidenav" id="mobile-demo">
          {this.getRoutes(user, isAuthenticated)}
        </ul>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
