import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navigation from './navigation';
import validateToken from './validateToken';

const imageStyle = {
  width: "120px", 
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover" 
};

const RoomList = () => {
  const [roomsData, setRoomsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.post("https://foiiqhsc96.execute-api.us-east-1.amazonaws.com/development/show-rooms");

        const parsedData = JSON.parse(response.data.body);

        if (Array.isArray(parsedData)) {
          setRoomsData(parsedData);
        } else {
          console.error("Invalid data format received:", parsedData);
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
      }
    };

    fetchRoomDetails();
  }, []); 

  const handleRoomClick = async (room_type, room_cap) => {
    const isValid = await validateToken();
    console.log(isValid);
    if (isValid) {
      console.log(isValid);
      console.log(`Clicked room with type ${room_type} and capacity ${room_cap}`);
      navigate("/book-room", { state: { roomType: room_type, roomCapacity: room_cap } });
    } else {
      alert('Please sign in first to book a room.');
    }
  };

  return (
    <>
      <Navigation />
      <div id="room-list" className="text-center" style={{ paddingTop: '8%' }}>
        <div className="container">
          <div className="col-md-10 col-md-offset-1 section-title">
            <h2>Rooms Available</h2>
          </div>
          <div className="row justify-content-center">
            {roomsData.length > 0 ? (
              roomsData.map((room, index) => (
                <div key={index} className="col-xs-12 col-md-4 d-flex justify-content-center mb-4">
                  <div className="room-item d-flex flex-column align-items-center" style={{ backgroundColor: "white", padding: "20px", marginBottom: "20px", borderRadius: "10px", textAlign: "center"}}>
                    <button onClick={() => handleRoomClick(room.Type, room.Capacity )} style={{ width: "100%", height: "40%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "inherit" }}>
                      <div className="room-image">
                        <img
                          src={`/img/Features/${room.Type}.jpg`} 
                          alt={room.Type}
                          style={imageStyle} 
                          className="room-img"
                        />
                      </div>
                      <h3>{room.Type}</h3>
                      <p>Capacity: {room.Capacity}</p>
                      <p>Total Available Rooms: {room["Available Rooms"]}</p>
                      <p>Cost per room: ${room["Cost"]}</p>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-md-12">
                <p>Loading...</p>
              </div>
            )}
          </div>
        </div>
    </div>
  </>
  );
};

export default RoomList;
