// AdminDashboard.js
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../css/AdminDashboard.css';

import axios from 'axios';

const AdminDashboard = ({ handleSignOut }) => {
    useEffect(() => {
        const updateDashboardData = async () => {
            try {
                const response = await axios.get('https://uurygjhr5c.execute-api.us-east-1.amazonaws.com/dev/v1');
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        updateDashboardData();
    }, []);

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
