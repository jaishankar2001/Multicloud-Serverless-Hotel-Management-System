import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddRoom = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [formData, setFormData] = useState({
    roomType: '',
    capacity: '',
    features: '',
    availableRooms: 0,
    cost: 0
  });
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        const response = await axios.get('https://6lc6xoke5sxjyhoqn5rvxkhffq0xepmf.lambda-url.us-east-1.on.aws/');
        const rooms = response.data;
        setAllRooms(rooms);

        const uniqueRoomTypes = [...new Set(rooms.map(room => room.Type))];
        setRoomTypes(uniqueRoomTypes);

        if (uniqueRoomTypes.length > 0) {
          setFormData(prevData => ({
            ...prevData,
            roomType: uniqueRoomTypes[0]
          }));
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };

    fetchAllRooms();
  }, []);

  useEffect(() => {
    if (formData.roomType) {
      const filteredCapacities = allRooms
        .filter(room => room.Type === formData.roomType)
        .map(room => room.Capacity);

      setCapacities(filteredCapacities);

      if (filteredCapacities.length > 0) {
        setFormData(prevData => ({
          ...prevData,
          capacity: filteredCapacities[0]
        }));
      }
    }
  }, [formData.roomType, allRooms]);

  useEffect(() => {
    if (formData.roomType && formData.capacity) {
      const selectedRoom = allRooms.find(room => room.Type === formData.roomType && room.Capacity === formData.capacity);

      if (selectedRoom) {
        setFormData(prevData => ({
          ...prevData,
          features: selectedRoom.Features || '',
          availableRooms: selectedRoom['Available Rooms'] || 0,
          cost: selectedRoom.Cost || 0
        }));
      }
    }
  }, [formData.roomType, formData.capacity, allRooms]);

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
      Cost: formData.cost 
    };
    
    try {
      const response = await axios.post('https://6qev4yi4cr2ygvqidi6wk72xvm0ennnr.lambda-url.us-east-1.on.aws/', {
        room_data: roomData
      });
      console.log('Room updated successfully:', response.data);
      // const cleanedResponseMessage = response.data.body.replace(/\\|"|'/g, '');
      setResponseMessage("Data Updated Successfully");
    } catch (error) {
      console.error('Error updating room:', error);
      setResponseMessage('Error updating room. Please try again.');
    }
  };

  return (
    <div id="AddRoom" className="text-center" style={{ textAlign: 'center' }}>
      <div className="container" style={{ margin: 'auto', maxWidth: '600px' }}>
        <div className="section-title" style={{ marginBottom: '10px' }}>
          <h2 style={{ marginBottom: '20px' }}>Update Room Quantity</h2>
          <p style={{ marginBottom: '20px' }}>Welcome to the admin page. Please fill out the form below to update room quantities.</p>
          <img
            src="/img/Features/bedroom.jpg"
            alt="Admin"
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '1%',
              objectFit: 'cover',
              display: 'block',
              margin: '10px auto'
            }}
            className="admin-img"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginTop: '10px' }}>
            <label htmlFor="roomType" style={{ display: 'block', marginBottom: '5px' }}>Room Type:</label>
            <select
              className="form-control"
              id="roomType"
              value={formData.roomType}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="capacity" style={{ display: 'block', marginBottom: '5px' }}>Capacity:</label>
            <select
              className="form-control"
              id="capacity"
              value={formData.capacity}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              {capacities.map((capacity) => (
                <option key={capacity} value={capacity}>
                  {capacity}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="features" style={{ display: 'block', marginBottom: '5px' }}>Features:</label>
            <textarea
              className="form-control"
              id="features"
              value={formData.features}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
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
            />
          </div>
          {/* Assuming you have a 'cost' field */}
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
            />
          </div>
          <button type="submit" className="btn btn-custom btn-lg" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Submit
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

export default AddRoom;
