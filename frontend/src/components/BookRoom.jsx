import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const roomCapacities = {
  "Bedroom": [2, 4],
  "Conference Hall": [100],
  "Theaterroom": [10]
};

const availableRoomTypes = Object.keys(roomCapacities);

const BookRoom = () => {
  const location = useLocation();
  const { roomType, roomCapacity } = location.state || {};

  const [formData, setFormData] = useState({
    roomType: roomType || availableRoomTypes[0],
    roomCapacity: roomCapacity || roomCapacities[roomType || availableRoomTypes[0]][0],
    userId: '',
    bookingDate: '',
    name: '',
    email: '',
    date: '',
  });

  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    if (formData.roomType) {
      const newCapacity = roomCapacities[formData.roomType][0];
      setFormData(prevData => ({
        ...prevData,
        roomCapacity: newCapacity
      }));
    }
  }, [formData.roomType]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      room_type: formData.roomType,
      room_cap: formData.roomCapacity,
      userID: formData.userId,
      bookingdate: formData.date,
    };
    
    try {
      const response = await axios.post('https://07w8z7y6x3.execute-api.us-east-1.amazonaws.com/trial/create-booking', bookingData);
      console.log('Booking successful:', response.data);
      const cleanedResponseMessage = response.data.body.replace(/\\|"|'/g, '');
      setResponseMessage(cleanedResponseMessage);
    } catch (error) {
      console.error('Error booking room:', error);
      setResponseMessage('Error booking room. Please try again.');
    }
  };

  return (
    <div id="BookRoom" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Book Your Room</h2>
          <p>Welcome to the booking page. Please fill out the form below to book your room.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="roomType">Room Type:</label>
            <select
              className="form-control"
              id="roomType"
              value={formData.roomType}
              onChange={handleChange}
            >
              {availableRoomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="roomCapacity">Room Capacity:</label>
            <select
              className="form-control"
              id="roomCapacity"
              value={formData.roomCapacity}
              onChange={handleChange}
            >
              {roomCapacities[formData.roomType].map((capacity) => (
                <option key={capacity} value={capacity}>
                  {capacity}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="userId">User ID:</label>
            <input
              type="text"
              className="form-control"
              id="userId"
              value={formData.userId}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Booking Date:</label>
            <input
              type="date"
              className="form-control"
              id="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-custom btn-lg">
            Submit
          </button>
        </form>
        {responseMessage && (
          <div className="response-message">
            <p>{responseMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRoom;