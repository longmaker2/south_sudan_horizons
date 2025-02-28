import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Guides from "./pages/Guides";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookTour from "./pages/BookTour";
import Footer from "./components/Footer";
import AdventureTours from "./pages/AdventureTours";
import CulturalTours from "./pages/CulturalTours";
import WildlifeTours from "./pages/WildlifeTours";
import NatureTours from "./pages/NatureTours";
import AllTours from "./pages/AllTours";
import TouristDashboard from "./pages/Profile";
import TourDetails from "./pages/TourDetails";
import GuideProfile from "./pages/GuideProfile";
import BackToTopButton from "./components/BackToTopButton";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<TouristDashboard />} />
          <Route path="/book-tour" element={<BookTour />} />
          <Route path="/tours/adventure" element={<AdventureTours />} />
          <Route path="/tours/cultural" element={<CulturalTours />} />
          <Route path="/tours/wildlife" element={<WildlifeTours />} />
          <Route path="/tours/nature" element={<NatureTours />} />
          <Route path="/tours/all" element={<AllTours />} />
          <Route path="/tour-details/:id" element={<TourDetails />} />
          <Route path="/guides/:guideId" element={<GuideProfile />} />
        </Routes>
        <BackToTopButton />
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
