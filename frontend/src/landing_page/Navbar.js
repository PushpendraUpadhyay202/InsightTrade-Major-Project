import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom ml-4 mb-5 p-3"
      style={{
        backgroundColor: "#FFF",
        height: "90px",
        width: "100%",
        position: "sticky",
        zIndex: "50",
        top: "0",
      }}
    >
      <div className="container p-2">
        <Link className="navbar-brand" to="/">
          <img src="/images/logo" style={{ width: "25%" }} alt="Logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="col-2"></div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex" role="search">
            <ul className="navbar-nav mb-lg-0">
              <li className=" text-muted">
                <Link
                  className="active"
                  aria-current="page"
                  to="/signup"
                  style={{
                    textDecoration: "none",
                    paddingLeft: "100px",
                    fontSize: "1.2rem",
                    color: "#666",
                  }}
                >
                  Signup
                </Link>
              </li>
              <li className="text-muted">
                <Link
                  className="active"
                  to="/about"
                  style={{
                    textDecoration: "none",
                    paddingLeft: "90px",
                    fontSize: "1.2rem",
                    color: "#666",
                  }}
                >
                  About
                </Link>
              </li>
              {/* <li className="text-muted">
                <Link
                  className=" active"
                  style={{
                    textDecoration: "none",
                    paddingLeft: "48px",
                    fontSize: "1.2rem",
                    color: "#666",
                  }}
                  to="/products"
                >
                  Product
                </Link>
              </li> */}
              {/* <li className=" text-muted  ">
                <Link
                  className=" active"
                  style={{
                    textDecoration: "none",
                    paddingLeft: "48px",
                    fontSize: "1.2rem",
                    color: "#666",
                  }}
                  to="/pricing"
                >
                  Pricing
                </Link>
              </li> */}
              <li className="nav-item">
                <Link
                  className="active"
                  style={{
                    textDecoration: "none",
                    paddingLeft: "90px",
                    fontSize: "1.2rem",
                    color: "#666",
                  }}
                  to="/support"
                >
                  Support
                </Link>

                <Link
                  className="active"
                  style={{
                    textDecoration: "none",
                    paddingLeft: "90px",
                    fontSize: "1.2rem",
                    color: "#666",
                  }}
                  to="/support"
                >
                </Link>
              </li>
               <li className=" text-muted  ">
                <Link
                  className=" active"
                  style={{
                    textDecoration: "none",
                    paddingLeft: "20px",
                    fontSize: "1.2rem",
                    color: "#666",
                  }}
                  to="/login"
                >
                  Login
                </Link>
              </li>
            </ul>
          </form>
          <i
            className="fa-solid fa-bars fs-4 "
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              paddingLeft: "35px",
            }}
          ></i>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;