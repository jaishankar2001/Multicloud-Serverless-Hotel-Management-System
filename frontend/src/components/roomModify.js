import React, { useState, useEffect } from 'react';
import axios from 'axios';

const imageStyle = {
  width: "200px",
  height: "200px",
  borderRadius: "1%",
  objectFit: "cover",
  display: "block",
  margin: "10px auto"
};

const sectionTitleStyle = {
  marginBottom: "10px"
};

const AddRoom = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [formData, setFormData] = useState({
    roomType: '',
    features: '',
    quantity: 1,
    availableRooms: 0,
  });
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await axios.get('https://endpoint/room-types');
        setRoomTypes(response.data);
        setFormData(prevData => ({
          ...prevData,
          roomType: response.data[0], 
        }));
      } catch (error) {
        console.error('Error fetching room types:', error);
      }
    };

    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (formData.roomType) {
      const fetchAvailableRooms = async () => {
        try {
          const response = await axios.post('https://endpoint/get-available-rooms', {
            room_type: formData.roomType
          });
          setFormData(prevData => ({
            ...prevData,
            availableRooms: response.data.availableRooms || 0,
          }));
        } catch (error) {
          console.error('Error fetching available rooms:', error);
        }
      };

      fetchAvailableRooms();
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
    const roomData = {
      room_type: formData.roomType,
      features: formData.features,
      quantity: formData.quantity,
      available_rooms: formData.availableRooms,
    };
    
    try {
      const response = await axios.post('https://endpoint/add-room', roomData);
      console.log('Room added successfully:', response.data);
      const cleanedResponseMessage = response.data.body.replace(/\\|"|'/g, '');
      setResponseMessage(cleanedResponseMessage);
    } catch (error) {
      console.error('Error adding room:', error);
      setResponseMessage('Error adding room. Please try again.');
    }
  };

  return (
    <div id="AddRoom" className="text-center">
      <div className="container">
        <div className="section-title" style={sectionTitleStyle}>
          <h2>Add Room Quantity</h2>
          <p>Welcome to the admin page. Please fill out the form below to add room quantities.</p>
          <img
            src="./img/Features/bedroom.jpg"
            alt="Admin"
            style={imageStyle}
            className="admin-img"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginTop: "10px" }}>
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
            <label htmlFor="features">Features:</label>
            <textarea
              className="form-control"
              id="features"
              value={formData.features}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
            />
          </div>
          <div className="form-group">
            <label htmlFor="availableRooms">Available Rooms:</label>
            <input
              type="number"
              className="form-control"
              id="availableRooms"
              value={formData.availableRooms}
              onChange={handleChange}
              min="0"
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

export default AddRoom;
