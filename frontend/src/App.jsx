import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { Booking } from "./components/booking";
// import { Services } from "./components/services";
// import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
// import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import BookRoom from "./components/BookRoom";
import RoomList from "./components/RoomList";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import SignIn from './components/SignIn';
import SecurityQuestionAnswer from './components/SecurityQuestionAnswer';
import CaesarCipherAuth from './components/CeaserCipherAuth';
import SecurityQuestionSetup from './components/SecurityQuestion';
import ChatKommunicate from "./components/chatkummunicate";
import AddRoom from "./components/roomModify";
import AdminDashboard from './components/AdminDashboard';
import DeleteRoom from './components/DeleteRoom';
import Chat from './components/chat'; 
import RoomListAdmin from "./components/roomListAdmin";
import AddNewRoom from "./components/AddNewRoom";
import DashboardStatisticts from "./components/dashboard_statistics";
import FeedbackList from "./pages/FeedbackList";
import ConvoList from "./components/ConvoList";
import ProtectedRoute from "./components/ProtectedRoute";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('encrypted_id_token');
    localStorage.removeItem('encrypted_access_token');
    localStorage.removeItem('encrypted_refresh_token');
    localStorage.removeItem('user_id');
  
    setUserId(null);
    const signOutUrl = `https://register-customers.auth.us-east-1.amazoncognito.com/logout?client_id=44netf2dipspddsebq3vmq8pmn&logout_uri=http%3A%2F%2Flocalhost%3A3000`;
    window.location.assign(signOutUrl);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navigation userId={userId} handleSignOut={handleSignOut}/>
            <Header data={landingPageData.Header} />
            <Features data={landingPageData.Features} />
            <Booking data={landingPageData.Booking} />
            {/* <Services data={landingPageData.Services} /> */}
            {/* <Gallery data={landingPageData.Gallery} /> */}
            <Testimonials data={landingPageData.Testimonials} />
            {/* <Team data={landingPageData.Team} /> */}
            <Contact data={landingPageData.Contact} />
            
            <ChatKommunicate />
          </>
        } />
        <Route path="/AddRoom" element={<ProtectedRoute><AddRoom /></ProtectedRoute>}/>
        <Route path="/book-room" element={<BookRoom />} />
        <Route path="/show-room" element={<RoomList />} />
        <Route path="/show-roomadmin" element={<ProtectedRoute><RoomListAdmin /></ProtectedRoute>} />
        <Route path="/security-question-setup" element={<ProtectedRoute><SecurityQuestionSetup userId={userId} /></ProtectedRoute>} />
        <Route path="/security-question-answer" element={<ProtectedRoute><SecurityQuestionAnswer userId={userId} /></ProtectedRoute>} />
        <Route path="/signin" element={<SignIn setUserId={setUserId} />} />
        <Route path="/solveceaser" element={<ProtectedRoute><CaesarCipherAuth userId={userId} /></ProtectedRoute>} />
        <Route path="/admin_dashboard" element={<ProtectedRoute><AdminDashboard handleSignOut={handleSignOut} /></ProtectedRoute>} >
        <Route path="AddRoom" element={<ProtectedRoute><AddRoom /></ProtectedRoute>} />
          <Route path="DeleteRoom" element={<ProtectedRoute><DeleteRoom /></ProtectedRoute>} />
          <Route path="AddNewRoom" element={<ProtectedRoute><AddNewRoom /></ProtectedRoute>} />
          <Route path="Statistics" element={<ProtectedRoute><DashboardStatisticts /></ProtectedRoute>} />
          <Route path = "Convo-list" element = {<ProtectedRoute><ConvoList/></ProtectedRoute>}/>
        </Route>
        {/* Route for Chat component with dynamic conversation ID */}
        <Route path="/chat/:conversationId/:usertype" element={<Chat />} />
        <Route path="/feedback" element={<FeedbackList userId={userId} handleSignOut={handleSignOut} />} />
      </Routes>
    </Router>
  );
};

export default App;
