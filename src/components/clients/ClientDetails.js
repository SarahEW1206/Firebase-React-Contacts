import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";

class ClientDetails extends Component {
  render() {
    const { client } = this.props;

    if (client) {
      return (
        <div className="row">
          <div className="col-md-6">
            <Link to="/" className="btn btn-link">
              <i className="fas fa-arrow-circle-left" />
              Back to Dashboard
            </Link>
          </div>
          <div className="col-md-6">
            <div className="btn-group float-right">
              <Link to={`/client/edit/${client.id}`} className="btn btn-dark">
                edit
              </Link>
              <button className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

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
)(ClientDetails);
