import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        const response = await axios.post("https://07w8z7y6x3.execute-api.us-east-1.amazonaws.com/trial/show-rooms");

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

  const handleRoomClick = (room_type, room_cap) => {
    console.log(`Clicked room with type ${room_type} and capacity ${room_cap}`);
    navigate("/book-room", { state: { roomType: room_type, roomCapacity: room_cap } });
  };

  return (
    <div id="room-list" className="text-center">
      <div className="container">
        <div className="col-md-10 col-md-offset-1 section-title">
          <h2>Rooms Available</h2>
        </div>
        <div className="row">
          {roomsData.length > 0 ? (
            roomsData.map((room, index) => (
              <div key={index} className="col-xs-12 col-md-4">
                <div className="room-item" style={{ backgroundColor: "white", padding: "20px", marginBottom: "20px", borderRadius: "10px" }}>
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
                    <p>Available: {room["Available Rooms"]}</p>
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
  );
};

export default RoomList;
