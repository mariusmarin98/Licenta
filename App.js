import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/pages/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Courses from "./components/pages/Courses";
import Students from "./components/pages/Students";
import StudentCourses from "./components/pages/StudentCourses";
import Teachers from "./components/pages/Teachers";
import TeacherCourses from "./components/pages/TeacherCourses";

import "./App.css";
import { USER_ROLE_TEACHER, USER_ROLE_STUDENT } from "./utils/constants";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/courses" component={Courses} />
              <PrivateRoute
                exact
                path="/student-courses"
                component={StudentCourses}
                userRole={USER_ROLE_STUDENT}
              />
              <PrivateRoute
                exact
                path="/teacher-courses"
                component={TeacherCourses}
                userRole={USER_ROLE_TEACHER}
              />
              <PrivateRoute
                exact
                path="/students"
                component={Students}
                userRole={USER_ROLE_TEACHER}
              />
              <PrivateRoute
                exact
                path="/teachers"
                component={Teachers}
                userRole={USER_ROLE_STUDENT}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
