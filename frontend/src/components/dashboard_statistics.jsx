import React from 'react';

/**
 * DashboardStatistics Component
 * This component renders an iframe that displays a Google Looker Studio report.
 * 
 * @returns {JSX.Element} The iframe element to be rendered.
 */
const DashboardStatistics = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <iframe 
                title="Google Looker Studio Dashboard for Admins"
                width="1000" 
                height="750" 
                src="https://lookerstudio.google.com/embed/reporting/c045220f-3d08-457f-ba20-7cbff431d1b6/page/Ex66D" 
                frameBorder="0" 
                style={{ border: '0' }} 
                allowFullScreen 
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
            </iframe>
        </div>
    );
}

export default DashboardStatistics;
