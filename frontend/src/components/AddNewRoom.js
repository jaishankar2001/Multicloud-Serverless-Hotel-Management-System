import React, { useState } from 'react';
import axios from 'axios';

const AddNewRoom = () => {
  const [formData, setFormData] = useState({
    roomType: '',
    capacity: '',
    features: '',
    availableRooms: 0,
    cost: 0,
  });
  const [responseMessage, setResponseMessage] = useState(null);

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
      Type: formData.roomType,
      Capacity: formData.capacity,
      Features: formData.features,
      "Available Rooms": formData.availableRooms,
      Cost: formData.cost,
    };

    try {
      const response = await axios.post('https://m6heu7xccnygolsf2vxiecp4wa0qgueh.lambda-url.us-east-1.on.aws/', {
        operation: 'add-new-room',
        room_data: roomData,
      });
      console.log('Room added successfully:', response.data);
      setResponseMessage('Room added successfully!');
    } catch (error) {
      console.error('Error adding room:', error);
      setResponseMessage('Error adding room. Please try again.');
    }
  };

  return (
    <div id="AddNewRoom" className="text-center" style={{ textAlign: 'center' }}>
      <div className="container" style={{ margin: 'auto', maxWidth: '600px' }}>
        <div className="section-title" style={{ marginBottom: '10px' }}>
          <h2 style={{ marginBottom: '20px' }}>Add New Room</h2>
          <p style={{ marginBottom: '20px' }}>Please fill out the form below to add a new room.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label htmlFor="roomType" style={{ display: 'block', marginBottom: '5px' }}>Room Type:</label>
            <input
              type="text"
              className="form-control"
              id="roomType"
              value={formData.roomType}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="capacity" style={{ display: 'block', marginBottom: '5px' }}>Capacity:</label>
            <input
              type="text"
              className="form-control"
              id="capacity"
              value={formData.capacity}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="features" style={{ display: 'block', marginBottom: '5px' }}>Features:</label>
            <textarea
              className="form-control"
              id="features"
              value={formData.features}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="availableRooms" style={{ display: 'block', marginBottom: '5px' }}>Available Rooms:</label>
            <input
              type="number"
              className="form-control"
              id="availableRooms"
              value={formData.availableRooms}
              onChange={handleChange}
              min="0"
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cost" style={{ display: 'block', marginBottom: '5px' }}>Cost:</label>
            <input
              type="number"
              className="form-control"
              id="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button type="submit" className="btn btn-custom btn-lg" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add Room
          </button>
        </form>
        {responseMessage && (
          <div className="response-message" style={{ marginTop: '20px' }}>
            <p style={{ color: '#333' }}>{responseMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewRoom;
