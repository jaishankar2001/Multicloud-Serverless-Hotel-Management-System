import React from "react";
import { useNavigate } from 'react-router-dom';
import validateToken from './validateToken';

export const Booking = (props) => {
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    // navigate('/show-room');
    try {
      // Validate the token
      const isValid = await validateToken();

      if (isValid) {
        // Proceed to the next page or booking logic
        navigate('/show-room');
      } else {
        // Token validation failed, handle accordingly (e.g., show error message)
        alert('Please sign in first to book a room.');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      // Handle error (e.g., show error message)
      alert('Error validating token. Please try again later.');
    }
  };
  return (
    <div id="Booking">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6">
            {" "}
            <img src="img/about.jpg" className="img-responsive" alt="" />{" "}
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="Booking-text">
              <h2>Book a room</h2>
              <p>{props.data ? props.data.paragraph : "loading..."}</p>
              <button onClick={handleButtonClick}>Click here to book</button>
              <div className="list-style">
                <div className="col-lg-6 col-sm-6 col-xs-12">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
