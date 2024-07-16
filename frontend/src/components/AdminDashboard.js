// AdminDashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../css/AdminDashboard.css';

const AdminDashboard = ({ handleSignOut }) => {
    return (
        <div className="admin-dashboard">
            <Sidebar handleSignOut={handleSignOut} />
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;
