import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { JSX } from "react";
import { Helmet } from "react-helmet";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Guides from "./pages/Guides";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import { AuthProvider, useAuth } from "./context/AuthContext";
import WrappedBooking from "./components/Booking";
import BookingDetails from "./pages/BookingDetails";

// Simple Not Found component
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
    <p className="mt-4 text-gray-600">
      The page you're looking for doesn't exist.
    </p>
    <a
      href="/"
      className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      Go Home
    </a>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Helmet>
          <title>South Sudan Horizons - Explore the Heart of Africa</title>
          <meta
            name="description"
            content="Discover adventure, cultural, wildlife, and nature tours in South Sudan."
          />
        </Helmet>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <TouristDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/tours/adventure" element={<AdventureTours />} />
          <Route path="/tours/cultural" element={<CulturalTours />} />
          <Route path="/tours/wildlife" element={<WildlifeTours />} />
          <Route path="/tours/nature" element={<NatureTours />} />
          <Route path="/tours/all" element={<AllTours />} />
          <Route path="/tour-details/:id" element={<TourDetails />} />
          <Route
            path="/tours/:tourId/book"
            element={
              <ProtectedRoute>
                <>
                  <WrappedBooking tourId={""} />{" "}
                  {/* tourId will be dynamically set via useParams */}
                </>
              </ProtectedRoute>
            }
          />
          <Route path="/guides/:guideId" element={<GuideProfile />} />
          <Route
            path="/booking-details/:id"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BackToTopButton />
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
