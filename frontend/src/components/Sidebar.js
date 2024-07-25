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
                    <Link to="/admin_dashboard/AddNewRoom">Add Room</Link>
                </li>
                <li>
                    <Link to="/admin_dashboard/AddRoom">Update Room</Link>
                </li>
                <li>
                    <Link to="/admin_dashboard/DeleteRoom">Delete Room</Link>
                </li>
                <li>
                    <Link to="/admin_dashboard/Statistics">Statistics</Link>
                </li>
                <li>
                    <Link to="/admin_dashboard/Convo-list">Conversations</Link>
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
