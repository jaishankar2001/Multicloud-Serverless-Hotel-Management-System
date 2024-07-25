import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteRoom = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [allData, setAllData] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [formData, setFormData] = useState({
    roomType: '',
    capacity: ''
  });
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    const fetchRoomTypesAndCapacities = async () => {
      try {
        const response = await axios.get('https://ppigrmkljgdivxgyil2tj26edi0ecevi.lambda-url.us-east-1.on.aws/', {
          params: {
            operation: 'get-room-types-capacities'
          }
        });
        const data = response.data;
        
        setAllData(data);
        
        const uniqueRoomTypes = Array.from(new Set(data.map(item => item.Type)));
        setRoomTypes(uniqueRoomTypes);

        if (uniqueRoomTypes.length > 0) {
          const initialRoomType = uniqueRoomTypes[0];
          const initialCapacities = data
            .filter(item => item.Type === initialRoomType)
            .map(item => item.Capacity);
          setCapacities(initialCapacities);

          setFormData({
            roomType: initialRoomType,
            capacity: initialCapacities[0]
          });
        }
      } catch (error) {
        console.error('Error fetching room types and capacities:', error);
      }
    };

    fetchRoomTypesAndCapacities();
  }, []);

  useEffect(() => {
    if (formData.roomType) {
      const selectedCapacities = allData
        .filter(room => room.Type === formData.roomType)
        .map(room => room.Capacity);
      setCapacities(selectedCapacities);
      setFormData(prevData => ({
        ...prevData,
        capacity: selectedCapacities[0]
      }));
    }
  }, [formData.roomType, allData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://xgbyyqufvveh5qxpt7faaiwjb40pczxe.lambda-url.us-east-1.on.aws/', {
        operation: 'delete-room',
        room_data: {
          Type: formData.roomType,
          Capacity: formData.capacity
        }
      });
      console.log('Room deleted successfully:', response.data);
      const cleanedResponseMessage = response.data.message.replace(/\\|"|'/g, '');
      setResponseMessage(cleanedResponseMessage);
    } catch (error) {
      console.error('Error deleting room:', error);
      setResponseMessage('Error deleting room. Please try again.');
    }
  };

  return (
    <div id="DeleteRoom" className="text-center" style={{ textAlign: 'center' }}>
      <div className="container" style={{ margin: 'auto', maxWidth: '600px' }}>
        <div className="section-title" style={{ marginBottom: '10px' }}>
          <h2 style={{ marginBottom: '20px' }}>Delete Room</h2>
          <p style={{ marginBottom: '20px' }}>Please select the room type and capacity to delete the room record.</p>
        </div>
        <form onSubmit={handleDelete}>
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
          <button type="submit" className="btn btn-danger btn-lg" style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Delete
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

export default DeleteRoom;
