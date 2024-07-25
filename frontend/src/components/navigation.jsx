import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// const userId = localStorage.getItem('user_id')
// console.log(userId)
export const Navigation = ({ handleSignOut }) => {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    setUserId(storedUserId);
  }, []);
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="#page-top" style={{ marginLeft: '-50px' }}>
            Dal Vacation Home
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">
                Features
              </a>
            </li>
            <li>
              <a href="#booking" className="page-scroll">
                Booking
              </a>
            </li>
            {/* <li>
              <a href="#services" className="page-scroll">
                Services
              </a>
            </li> */}
            {/* <li>
              <a href="#portfolio" className="page-scroll">
                Gallery
              </a>
            </li> */}
            <li>
              <a href="#testimonials" className="page-scroll">
                Testimonials
              </a>
            </li>
            {/* <li>
              <a href="#team" className="page-scroll">
                Team
              </a>
            </li> */}
            <li>
              <Link to="/feedback" className="page-scroll">
                Feedback
              </Link>
            </li>
            <li>
              <a href="#contact" className="page-scroll">
                Contact
              </a>
            </li>
            <li>
            {userId ? (
              <Link to="/" onClick={handleSignOut} style={{color:'red'}} className="page-scroll">
                Sign Out
              </Link>
            ) : (
              <Link to="/signin" className="page-scroll">Sign In</Link>
            )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
