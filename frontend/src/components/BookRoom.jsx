import React from 'react';

const BookRoom = () => {
  return (
    <div id="BookRoom" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Book Your Room</h2>
          <p>Welcome to the booking page. Please fill out the form below to book your room.</p>
        </div>
        {/* Add your booking form or other content here */}
        <form>
          <div className="form-group">
            <label for="name">Name:</label>
            <input type="text" className="form-control" id="name" />
          </div>
          <div className="form-group">
            <label for="email">Email:</label>
            <input type="email" className="form-control" id="email" />
          </div>
          <div className="form-group">
            <label for="date">Date:</label>
            <input type="date" className="form-control" id="date" />
          </div>
          <button type="submit" className="btn btn-custom btn-lg">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default BookRoom;
