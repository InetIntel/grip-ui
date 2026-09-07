import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Page Components
import EventsList from "./pages/events_list";
import EventDetails from "./pages/event_details";
import PfxEventDetails from "./pages/pfx_event_details";
import EventTags from "./pages/event_tags";
import Acknowledgement from "./pages/ack";
import Contacts from "./pages/contacts";
import AboutPage from "./pages/about";
import AcceptableUsePolicy from "./pages/aup";

// Layout/Template Components
import Nav from "./templates/nav";
import Footer from "./templates/footer";

function App() {
  return (
    <div className="app-container">
      <Nav />
      <div className="content-wrapper">
        <Routes>
          {/* Legacy Routes */}
          <Route
            path="/legacy/events/:eventType/:eventId/:pfxEventId"
            element={<PfxEventDetails />}
          />
          <Route
            path="/legacy/events/:eventType/:eventId"
            element={<EventDetails />}
          />
          <Route path="/legacy/events" element={<EventsList />} />
          
          {/* Standard Routes */}
          <Route
            path="/events/:eventType/:eventId/:pfxEventId"
            element={<PfxEventDetails />}
          />
          <Route
            path="/events/:eventType/:eventId"
            element={<EventDetails />}
          />
          <Route path="/ack" element={<Acknowledgement />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/aup" element={<AcceptableUsePolicy />} />
          <Route path="/tags" element={<EventTags />} />
          <Route path="/events" element={<EventsList />} />
          {/* Fallback for the root route */}
          <Route path="/" element={<EventsList />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function HijacksApp() {
  return (
    <BrowserRouter basename={process.env.APP_BASENAME}>
      <App />
    </BrowserRouter>
  );
}

export default HijacksApp;
