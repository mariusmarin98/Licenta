import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import M from "materialize-css";

import { SERVER_URL, USER_ROLE_STUDENT } from "../../utils/constants";

class Courses extends Component {
  constructor() {
    super();
    this.state = {
      courses: [],
      viewHomeworks: [],
    };
  }

  componentDidMount() {
    const { auth = {} } = this.props;
    const { user = {}, isAuthenticated = false } = auth;
    const { id: userId } = user;

    // Modal init
    M.Modal.init(document.querySelectorAll(".modal"), {});

    if (isAuthenticated && user.role === USER_ROLE_STUDENT) {
      axios
        .get(`${SERVER_URL}/api/courses/get-student`, {
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
          newCourses.splice(courseIndex, 1);
          // Set data
          this.setState({ courses: newCourses });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  onAddFile = (courseId, teacherId, event) => {
    const { auth = {} } = this.props;
    const { user = {} } = auth;
    const { target } = event;
    const { files } = target;

    const formData = new FormData();
    formData.append("files", files[0]);
    formData.append("studentId", user.id);
    formData.append("courseId", courseId);
    formData.append("teacherId", teacherId);

    axios.post(`${SERVER_URL}/api/homeworks/add-file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  onGetFile = (id, filename) => {
    axios
      .get(`${SERVER_URL}/api/homeworks/get-file`, {
        headers: {
          "Content-Type": "application/pdf",
        },
        params: { id },
      })
      .then((res) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };

  onView = (id) => {
    const { auth = {} } = this.props;
    const { user = {} } = auth;

    axios
      .get(`${SERVER_URL}/api/homeworks/get`, {
        params: {
          studentId: user.id,
          courseId: id,
        },
      })
      .then((res) => {
        const { data } = res;

        this.setState({ viewHomeworks: data });
      });
  };

  getRows = () =>
    this.state.courses.map(({ _id, name, teacher }, id) => (
      <tr key={`user-row-${id}`}>
        <td>{_id}</td>
        <td>{name}</td>
        <td>{teacher.name}</td>
        <td>
          <a
            className="waves-effect waves-light btn-small blue"
            onClick={() => {
              document.getElementById(`file-input-${_id}`).click();
            }}
          >
            <i className="material-icons">add</i>
          </a>
          <input
            id={`file-input-${_id}`}
            type="file"
            name="homework"
            style={{ display: "none" }}
            onChange={this.onAddFile.bind(null, _id, teacher._id)}
          />
        </td>
        <td>
          <a
            href="#modal-homeworks"
            className="waves-effect waves-light btn-small green modal-trigger"
            onClick={this.onView.bind(null, _id)}
          >
            <i className="material-icons">remove_red_eye</i>
          </a>
        </td>
        <td>
          <a
            className="waves-effect waves-light btn-small red"
            onClick={this.onLeave.bind(null, _id)}
          >
            <i className="material-icons">delete</i>
          </a>
        </td>
      </tr>
    ));

  getHomeworksRows = () =>
    this.state.viewHomeworks.map(({ _id, originalname, date }, id) => (
      <tr key={`homework-row-${id}`}>
        <td>{originalname}</td>
        <td>{date}</td>
        <td>
          <a
            className="waves-effect waves-light btn-small blue"
            onClick={this.onGetFile.bind(null, _id, originalname)}
          >
            <i className="material-icons">cloud_download</i>
          </a>
        </td>
      </tr>
    ));

  render() {
    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <table className="striped centered">
            <thead>
              <tr>
                <th>Course Id</th>
                <th>Course Name</th>
                <th>Teacher Name</th>
                <th>Add Homework</th>
                <th>View Homework</th>
                <th>Leave Course</th>
              </tr>
            </thead>
            <tbody>{this.getRows()}</tbody>
          </table>
        </div>
        <div id="modal-homeworks" className="modal">
          <div className="modal-content">
            <h4 className="center">Your Homeworks</h4>
            <table className="striped centered">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Date</th>
                  <th>Download</th>
                </tr>
              </thead>

              <tbody>{this.getHomeworksRows()}</tbody>
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
