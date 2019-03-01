import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// import { compose } from "redux";
// import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
// import Spinner from "../layout/Spinner";

class LogIn extends Component {
  state = {
    email: "",
    password: ""
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();

    const { firebase, history } = this.props;
    const { email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user);
        history.push("/");
      })
      .catch(error => alert("Invalid login credentials"));
  };

  onCreate = e => {
    e.preventDefault();
    const { firestore, firebase } = this.props;
    const { email, password } = this.state;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        let user_id = user.user.uid;
        firestore
          .collection("clients")
          .doc(user_id)
          .set({ user_id: user_id, email, password });
      })
      .catch(error => alert(error));
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              <h1 className="text-center pb-4 pt-3">
                <span className="text-primary">
                  <i className="fas fa-lock" /> CREATE ACCOUNT
                </span>
              </h1>
              <form onSubmit={this.onCreate}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    required
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="text"
                    className="form-control"
                    name="password"
                    required
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                </div>
                {/* <input
                  type="submit"
                  value="Login"
                  className="btn btn-primary btn-block"
                /> */}
                <input
                  type="submit"
                  value="CREATE"
                  className="btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LogIn.propTypes = {
  firebase: PropTypes.object.isRequired
};

export default firestoreConnect()(LogIn);
