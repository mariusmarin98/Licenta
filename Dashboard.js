import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { USER_ROLE_STUDENT, USER_ROLE_TEACHER } from "../../utils/constants";

class Dashboard extends Component {
  render() {
    const { auth = {} } = this.props;
    const { user = {} } = auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              Welcome to <b>Homework App</b>, {user.name}
            </h4>
            <p className="flow-text grey-text text-darken-1">
              {user.role === USER_ROLE_STUDENT ? (
                <span>
                  As a Student you can enroll to specific courses and upload
                  your homework in each one of them
                </span>
              ) : user.role === USER_ROLE_TEACHER ? (
                <span>
                  As a Teacher you can create courses, enroll students to
                  specific courses and view their homework
                </span>
              ) : (
                <span>Sorry, but you don't have a role assigned</span>
              )}
            </p>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
