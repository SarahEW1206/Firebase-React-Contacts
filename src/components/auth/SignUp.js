import React, { Component } from "react";
import PropTypes from "prop-types";
import { firestoreConnect } from "react-redux-firebase";

class SignUp extends Component {
  state = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    balance: "0"
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onCreate = e => {
    e.preventDefault();
    const { firestore, firebase, history } = this.props;
    const { email, password, lastName, firstName, balance } = this.state;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        let user_id = user.user.uid;
        firestore
          .collection("clients")
          .doc(user_id)
          .set({
            user_id: user_id,
            email,
            password,
            firstName,
            lastName,
            balance
          })
          .then(() => history.push(`/client/edit/${user_id}`));
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
                  <label htmlFor="firstName">First</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    required
                    value={this.state.firstName}
                    onChange={this.onChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    required
                    value={this.state.lastName}
                    onChange={this.onChange}
                  />
                </div>

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

SignUp.propTypes = {
  firebase: PropTypes.object.isRequired
};

export default firestoreConnect()(SignUp);
