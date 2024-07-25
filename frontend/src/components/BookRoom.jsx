import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navigation from './navigation';




const BookRoom = () => {
  const location = useLocation();
  const { roomType, roomCapacity } = location.state || {};
  const [userID, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    roomType: roomType || "",
    roomCapacity: roomCapacity || "",
    userId: userID,
    bookingdate_from: '',
    bookingdate_to: '',
    name: '',
    email: '',
    date: '',
  });

  const [responseMessage, setResponseMessage] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [roomData, setRoomData] = useState([]);

  useEffect (() => {
    const storedUserId = localStorage.getItem('user_id');
    setUserId(storedUserId);
    const form = formData;
    form['userId'] = userID;
    setFormData(form);
  }, [])
  useEffect(() => {
    
    const fetchRoomTypesAndCapacities = async () => {
      try {
        const response = await axios.get('https://ppigrmkljgdivxgyil2tj26edi0ecevi.lambda-url.us-east-1.on.aws/', {
          params: {
            operation: 'get-room-types-capacities'
          }
        });
        const data = response.data;
        console.log(data)
       
        const uniqueRoomTypes = Array.from(new Set(data.map(item => item.Type)));
        setRoomTypes(uniqueRoomTypes);
        setRoomData(data); // Set the fetched data to state
 
        if (uniqueRoomTypes.length > 0) {
          const initialRoomType = uniqueRoomTypes[0];
          const initialCapacities = data
            .filter(item => item.Type === initialRoomType)
            .map(item => item.Capacity);
          setCapacities(initialCapacities);
 
          setFormData(prevData => ({
            ...prevData,
            roomType: roomType || initialRoomType,
            roomCapacity: roomCapacity || initialCapacities[0]
          }));
        }
      } catch (error) {
        console.error('Error fetching room types and capacities:', error);
      }
    };
    fetchRoomTypesAndCapacities();
  }, [roomType, roomCapacity]);
  
 
  useEffect(() => {
    if (formData.roomType && roomData.length > 0) {
      const selectedCapacities = roomData
        .filter(item => item.Type === formData.roomType)
        .map(item => item.Capacity);
      setCapacities(selectedCapacities);
      setFormData(prevData => ({
        ...prevData,
        roomCapacity: selectedCapacities[0]
      }));
    }
  }, [formData.roomType, roomData]);

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
      bookingdate_from: formData.bookingdate_from,
      bookingdate_to: formData.bookingdate_to,
    };
    
    try {
      const response = await axios.post('https://foiiqhsc96.execute-api.us-east-1.amazonaws.com/development/booking', bookingData);
      console.log('Booking successful:', response.data);
      const cleanedResponseMessage = response.data.body.replace(/\\|"|'/g, '');
      setResponseMessage(cleanedResponseMessage);
    } catch (error) {
      console.error('Error booking room:', error);
      setResponseMessage('Error booking room. Please try again.');
    }
  };

  return (
    <>
    <Navigation />
      <div id="BookRoom" className="text-center" style={{ paddingTop: '6%' }}>
        <div>
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
                  {roomTypes.map((type) => (
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
                  {capacities.map((capacity) => (
                    <option key={capacity} value={capacity}>
                      {capacity}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date">From Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="bookingdate_from"
                  value={formData.bookingdate_from}
                  onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="date">To Date:</label>
                <input
                  type="date"
                  className="form-control"
                  id="bookingdate_to"
                  value={formData.bookingdate_to}
                  onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleChange} />
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
      </div>
    </>
  );
};

export default BookRoom;