import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import { SERVER_URL, USER_ROLE_TEACHER } from "../../utils/constants";

class Students extends Component {
  constructor() {
    super();
    this.state = {
      students: [],
    };
  }

  componentDidMount() {
    const { auth = {} } = this.props;
    const { user = {}, isAuthenticated = false } = auth;
    const { id: userId } = user;

    if (isAuthenticated && user.role === USER_ROLE_TEACHER) {
      axios
        .get(`${SERVER_URL}/api/users/get-students`, {
          params: {
            userId,
          },
        })
        .then((res) => {
          // Get data
          const students = res.data;

          // Set data
          this.setState({ students });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  getRows = () =>
    this.state.students.map(({ _id, name }, id) => (
      <tr key={`user-row-${id}`}>
        <td>{_id}</td>
        <td>{name}</td>
      </tr>
    ));

  render() {
    const { auth = {} } = this.props;
    const { user = {} } = auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          {user.role === USER_ROLE_TEACHER ? (
            <table className="striped centered">
              <thead>
                <tr>
                  <th>Student Id</th>
                  <th>Student Name</th>
                </tr>
              </thead>
              <tbody>{this.getRows()}</tbody>
            </table>
          ) : null}
        </div>
      </div>
    );
  }
}

Students.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Students);
