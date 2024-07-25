import React, { useState } from "react";
import axios from "axios";

const user = localStorage.getItem('user_id');

const initialState = {
  userID: user,
  booking_ID: "",
  message: ""
};


export const Contact = (props) => {
  const [{ userID, booking_ID, message }, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const clearState = () => setState({ ...initialState });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userID, booking_ID, message); // For debugging

    const payload = {
      userid: userID,
      booking_id: booking_ID,
      content: { sender: "user", message: message }
    };

    try {
      const response = await axios.post("https://foiiqhsc96.execute-api.us-east-1.amazonaws.com/development/convo-req", payload, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      if(response.data.body === '{"message": "No agents available."}')
      {
        alert("no agents are currently available please try again later.")
      }
      console.log(response.data);
      clearState(); // Clear form fields after successful submission
      // Optionally, provide user feedback (success message, etc.)
    } catch (error) {
      console.log(error);
      // Handle errors (e.g., display error message to user)
    }
  };

  return (
    <div>
      <div id="contact">
        <div className="container">
          <div className="col-md-8">
            <div className="row">
              <div className="section-title">
                <h2>Get In Touch</h2>
                <p>
                  Please fill out the form below to send us a query and we will
                  get back to you as soon as possible.
                </p>
              </div>
              <form name="contactForm" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        id="userID"
                        name="userID"
                        className="form-control"
                        placeholder="User ID"
                        value={userID}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input
                        type="text"
                        id="booking_ID"
                        name="booking_ID"
                        className="form-control"
                        placeholder="Booking ID"
                        value={booking_ID}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows="4"
                    placeholder="Message"
                    value={message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-custom btn-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-3 col-md-offset-1 contact-info">
            <div className="contact-item">
              <h3>Contact Info</h3>
              <p>
                <span>
                  <i className="fa fa-map-marker"></i> Address
                </span>
                {props.data ? props.data.address : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-phone"></i> Phone
                </span>{" "}
                {props.data ? props.data.phone : "loading"}
              </p>
            </div>
            <div className="contact-item">
              <p>
                <span>
                  <i className="fa fa-envelope-o"></i> Email
                </span>{" "}
                {props.data ? props.data.email : "loading"}
              </p>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="social">
                <ul>
                  <li>
                    <a href={props.data ? props.data.facebook : "/"}>
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.twitter : "/"}>
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href={props.data ? props.data.youtube : "/"}>
                      <i className="fa fa-youtube"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer">
      </div>
    </div>
  );
};
