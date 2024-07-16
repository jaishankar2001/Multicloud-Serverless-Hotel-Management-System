// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Sidebar.css'

const Sidebar = ({ handleSignOut }) => {
    return (
        <div className="sidebar">
            <h3>Admin Menu</h3>
            <ul>
                <li>
                    <Link to="/admin_dashboard/add-room">Add Room</Link>
                </li>
                <li>
                    <Link to="#">Delete Room</Link>
                </li>
                <li>
                    <Link to="#">Statistics</Link>
                </li>
                <li>
                    <button onClick={handleSignOut} className="sign-out-button">
                        Sign Out
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
