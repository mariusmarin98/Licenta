import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import { SERVER_URL, USER_ROLE_STUDENT } from "../../utils/constants";

class Teachers extends Component {
  constructor() {
    super();
    this.state = {
      teachers: [],
    };
  }

  componentDidMount() {
    const { auth = {} } = this.props;
    const { user = {}, isAuthenticated = false } = auth;
    const { id: userId } = user;

    if (isAuthenticated && user.role === USER_ROLE_STUDENT) {
      axios
        .get(`${SERVER_URL}/api/users/get-teachers`, {
          params: {
            userId,
          },
        })
        .then((res) => {
          // Get data
          const teachers = res.data;

          // Set data
          this.setState({ teachers });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  getRows = () =>
    this.state.teachers.map(({ _id, name }, id) => (
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
          {user.role === USER_ROLE_STUDENT ? (
            <table className="striped centered">
              <thead>
                <tr>
                  <th>Teacher Id</th>
                  <th>Teacher Name</th>
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

Teachers.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Teachers);
