import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container text-center fs-3">
      <h1>404 Error</h1>
      <p>Sorry, this page does not exist, Go to the Home Page</p>
      <Link to="/">
        <button className="btn btn-info" type="button">
          Home
        </button>
      </Link>
    </div>
  );
}

export default NotFound;