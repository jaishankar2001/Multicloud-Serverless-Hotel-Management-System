import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { Booking } from "./components/booking";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import BookRoom from "./components/BookRoom"; // Add this import
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import ChatbotIcon from './components/ChatbotIcon';
import ChatWindow from './components/ChatWindow';
import "./App.css";
import SignIn from './components/SignIn';
import SecurityQuestionAnswer from './components/SecurityQuestionAnswer';
import CaesarCipherAuth from './components/CeaserCipherAuth';
import SecurityQuestionSetup from './components/SecurityQuestion';

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  const toggleChatWindow = () => {
    setIsChatWindowOpen(!isChatWindowOpen);
  };

  const handleSignOut = () => {
    // Clear tokens from localStorage or sessionStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  
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
            <Services data={landingPageData.Services} />
            <Gallery data={landingPageData.Gallery} />
            <Testimonials data={landingPageData.Testimonials} />
            <Team data={landingPageData.Team} />
            <Contact data={landingPageData.Contact} />
            <ChatbotIcon onClick={toggleChatWindow} />
            {isChatWindowOpen && <ChatWindow onClose={toggleChatWindow} />}
          </>
        } />
        <Route path="/book-room" element={<BookRoom />} />
        <Route path="/security-question-setup" element={<SecurityQuestionSetup userId={userId} />} />
        <Route path="/security-question-answer" element={<SecurityQuestionAnswer userId={userId} />} />
        <Route path="/signin" element={<SignIn setUserId={setUserId} />} />
        <Route path="/solveceaser" element={<CaesarCipherAuth userId={userId} />} />
      </Routes>
    </Router>
  );
};

export default App;
