import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";

class EditClient extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  };

  //method from Will's comments in the chat thread.
  componentDidUpdate() {
    const { client } = this.props;
    //the if statement needs to be there to make sure you don't keep updating state, you'll get errors otherwise. That should let it run only the once, and once the client is loaded.
    if (
      client &&
      //The Object.keys() method returns an array of a given object's own property names, in the same order as we get with a normal loop.
      //The every() method tests whether all elements in the array pass the test implemented by the provided function.

      Object.keys(this.state).every(index => this.state[index].length === 0)
    ) {
      this.setState(state => ({ ...client }));
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const { client, firestore, history } = this.props;
    const { firstName, lastName, email, phone } = this.state;

    let clientEdits = {
      //If something is put in the input field, added to the clientEdits object. Otherwise the value is not changed from what is in Firestore (aka client.whatever).
      firstName: firstName === "" ? client.firstName : firstName,
      lastName: lastName === "" ? client.lastName : lastName,
      email: email === "" ? client.email : email,
      phone: phone === "" ? client.phone : phone
    };

    //Update the info in Firestore
    firestore
      .update({ collection: "clients", doc: client.id }, clientEdits)
      .then(() => history.push(`/`));
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { client } = this.props;
    const { firstName, lastName, email, phone } = this.state;

    if (client) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/" className="btn btn-link">
                <i className="fas fa-arrow-circle-left" />
                Return to Dashboard
              </Link>
            </div>
          </div>
          <div className="card">
            <div className="card-header">Edit Client</div>
            <div className="card-body">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="firstName" className="htmlFor">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    minLength="2"
                    onChange={this.onChange}
                    placeholder={client.firstName}
                    value={firstName}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="htmlFor">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    minLength="2"
                    onChange={this.onChange}
                    placeholder={client.lastName}
                    value={lastName}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="htmlFor">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    minLength="2"
                    // required
                    onChange={this.onChange}
                    placeholder={client.email}
                    value={email}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="htmlFor">
                    Phone
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    minLength="10"
                    // required
                    onChange={this.onChange}
                    placeholder={client.phone}
                    value={phone}
                  />
                </div>

                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

EditClient.propTypes = {
  firestore: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(props => [
    //we already have "clients" from Clients.js, and we only need one here, so we will get the client id from URL and store the respective client data as "client"
    { collection: "clients", storeAs: "client", doc: props.match.params.id }
  ]),
  //Below we are replacing the "state" param with destructuring of state.firestore.ordered, which if broken out would look like this:
  // { firestore } = state
  // and then
  // { ordered } = firestore
  // So when you use the "ordered" variable, it reflects state.firestore.ordered
  connect(({ firestore: { ordered } }, props) => ({
    client: ordered.client && ordered.client[0]
  }))
)(EditClient);
