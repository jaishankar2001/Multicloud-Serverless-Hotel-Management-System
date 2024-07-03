import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  const toggleChatWindow = () => {
    setIsChatWindowOpen(!isChatWindowOpen);
  };

  return (
<<<<<<< HEAD
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navigation />
            <Header data={landingPageData.Header} />
            <Features data={landingPageData.Features} />
            <Booking data={landingPageData.Booking} />
            <Services data={landingPageData.Services} />
            <Gallery data={landingPageData.Gallery} />
            <Testimonials data={landingPageData.Testimonials} />
            <Team data={landingPageData.Team} />
            <Contact data={landingPageData.Contact} />
          </>
        } />
        <Route path="/book-room" element={<BookRoom />} />
      </Routes>
    </Router>
=======
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features} />
      <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      <Gallery data={landingPageData.Gallery} />
      <Testimonials data={landingPageData.Testimonials} />
      <Team data={landingPageData.Team} />
      <Contact data={landingPageData.Contact} />
      <ChatbotIcon onClick={toggleChatWindow} />
      {isChatWindowOpen && <ChatWindow onClose={toggleChatWindow} />}
    </div>
>>>>>>> main
  );
};

export default App;
