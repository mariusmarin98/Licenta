import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import { SERVER_URL, USER_ROLE_STUDENT } from "../../utils/constants";

class Courses extends Component {
  constructor() {
    super();
    this.state = {
      courses: [],
    };
  }

  componentDidMount() {
    const { auth = {} } = this.props;
    const { user = {}, isAuthenticated = false } = auth;
    const { id: userId } = user;

    if (isAuthenticated) {
      axios
        .get(`${SERVER_URL}/api/courses/get-all`, {
          params: { userId },
        })
        .then((res) => {
          // Get data
          const courses = res.data;

          // Set data
          this.setState({ courses });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  onEnroll = (id) => {
    const { auth = {} } = this.props;
    const { user = {} } = auth;

    if (id && user.id) {
      axios
        .patch(`${SERVER_URL}/api/courses/self-enroll`, {
          userId: this.props.auth.user.id,
          courseId: id,
        })
        .then(() => {
          const newCourses = [...this.state.courses];
          const courseIndex = newCourses.findIndex(({ _id }) => _id === id);
          newCourses[courseIndex].isEnrolled = true;
          // Set data
          this.setState({ courses: newCourses });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  onLeave = (id) => {
    const { auth = {} } = this.props;
    const { user = {} } = auth;

    if (id && user.id) {
      axios
        .patch(`${SERVER_URL}/api/courses/self-leave`, {
          userId: user.id,
          courseId: id,
        })
        .then(() => {
          const newCourses = [...this.state.courses];
          const courseIndex = newCourses.findIndex(({ _id }) => _id === id);
          newCourses[courseIndex].isEnrolled = false;
          // Set data
          this.setState({ courses: newCourses });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  getRows = () => {
    const { auth = {} } = this.props;
    const { user = {} } = auth;

    return this.state.courses.map(({ _id, name, teacher, isEnrolled }, id) => (
      <tr key={`user-row-${id}`}>
        <td>{_id}</td>
        <td>{name}</td>
        <td>{teacher.name}</td>

        {user.role === USER_ROLE_STUDENT &&
          (isEnrolled ? (
            <td>
              <a
                className="waves-effect waves-light btn-small red"
                onClick={this.onLeave.bind(null, _id)}
              >
                <i className="material-icons">delete</i>
              </a>
            </td>
          ) : (
            <td>
              <a
                className="waves-effect waves-light btn-small blue"
                onClick={this.onEnroll.bind(null, _id)}
              >
                <i className="material-icons">add</i>
              </a>
            </td>
          ))}
      </tr>
    ));
  };

  render() {
    const { auth = {} } = this.props;
    const { user = {} } = auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <table className="striped centered">
            <thead>
              <tr>
                <th>Course Id</th>
                <th>Course Name</th>
                <th>Teacher Name</th>
                {user.role === USER_ROLE_STUDENT && <th>Enroll/Leave</th>}
              </tr>
            </thead>
            <tbody>{this.getRows()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

Courses.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Courses);
