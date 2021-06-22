import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import M from "materialize-css";

import { SERVER_URL, USER_ROLE_TEACHER } from "../../utils/constants";

class Courses extends Component {
  constructor() {
    super();
    this.state = {
      courses: [],
      courseName: "",
      viewStudents: [],
    };
  }

  componentDidMount() {
    const { auth = {} } = this.props;
    const { user = {}, isAuthenticated = false } = auth;
    const { id: userId } = user;

    // Modal init
    M.Modal.init(document.querySelectorAll(".modal"), {});

    if (isAuthenticated && user.role === USER_ROLE_TEACHER) {
      axios
        .get(`${SERVER_URL}/api/courses/get-teacher`, {
          params: {
            userId,
          },
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

  onChange = (event) => {
    this.setState({ courseName: event.target.value });
  };

  onDelete = (id) => {
    if (id) {
      axios
        .delete(`${SERVER_URL}/api/courses/remove`, {
          params: { id },
        })
        .then(() => {
          // Get data
          const newCourses = [...this.state.courses];
          const courseIndex = newCourses.findIndex(({ _id }) => _id === id);
          newCourses.splice(courseIndex, 1);

          // Set data
          this.setState({ courses: newCourses });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  onSubmit = () => {
    const { auth = {} } = this.props;
    const { user = {} } = auth;
    const { id: userId } = user;
    const { courseName: name } = this.state;

    if (name) {
      axios
        .post(`${SERVER_URL}/api/courses/create`, { userId, name })
        .then((res) => {
          const course = res.data;
          const newCourses = [...this.state.courses];
          newCourses.push(course);
          newCourses.sort(function (a, b) {
            const nameA = a.name;
            const nameB = b.name;
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            // names must be equal
            return 0;
          });
          this.setState({ courses: newCourses, courseName: "" });
        })
        .catch(console.error);
    }
  };

  onView = (id) => {
    const courseIndex = this.state.courses.findIndex(({ _id }) => id === _id);
    const course = this.state.courses[courseIndex] || {};
    this.setState({
      viewStudents: course.students || [],
    });
  };

  getRows = () =>
    this.state.courses.map(({ _id, name }, id) => (
      <tr key={`user-row-${_id}`}>
        <td>{_id}</td>
        <td>{name}</td>
        <td>
          <a
            href="#modal-students"
            className="waves-effect waves-light btn-small green modal-trigger"
            onClick={this.onView.bind(null, _id)}
          >
            <i className="material-icons">remove_red_eye</i>
          </a>
        </td>
        <td>
          <a
            className="waves-effect waves-light btn-small red"
            onClick={this.onDelete.bind(null, _id)}
          >
            <i className="material-icons">delete</i>
          </a>
        </td>
      </tr>
    ));

  getStudentsRows = () =>
    this.state.viewStudents.map(({ _id, name }, id) => (
      <tr key={`student-row-${id}`}>
        <td>{_id}</td>
        <td>{name}</td>
      </tr>
    ));

  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="input-field col s6">
            <input
              id="add-course-name"
              name="courseName"
              type="text"
              className="validate"
              value={this.state.courseName}
              onChange={this.onChange}
            />
            <label htmlFor="add-course-name">Course Name</label>
          </div>
          <div className="input-field col s6">
            <button
              className="btn waves-effect waves-light blue"
              type="submit"
              name="action"
              style={{ marginTop: "10px" }}
              onClick={this.onSubmit}
            >
              Add Course
              <i className="material-icons right">send</i>
            </button>
          </div>
          <table className="striped">
            <thead>
              <tr>
                <th>Course Id</th>
                <th>Course Name</th>
                <th>View Students</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{this.getRows()}</tbody>
          </table>
        </div>
        <div id="modal-students" className="modal">
          <div className="modal-content">
            <h4 className="center">Students Enrolled</h4>
            <table>
              <thead>
                <tr>
                  <th>Student Id</th>
                  <th>Student Name</th>
                </tr>
              </thead>

              <tbody>{this.getStudentsRows()}</tbody>
            </table>
          </div>
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
