import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { JSX, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AnimatePresence } from "framer-motion";
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
import AdminDashboard from "./pages/AdminDashboard";
import GuideDashboard from "./pages/GuideDashboard";
import TourDetails from "./pages/TourDetails";
import GuideProfile from "./pages/GuideProfile";
import BackToTopButton from "./components/BackToTopButton";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import WrappedBooking from "./components/Booking";
import BookingDetails from "./pages/BookingDetails";
import PageTransition from "./components/PageTransition";
import LoadingScreen from "./components/LoadingScreen";

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

// Protected Route component with role-based access
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Simulate loading effect
  }, []);

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
        {/* Main container with full screen height and flex layout */}
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {/* This ensures the content grows and pushes the footer to the bottom */}
          <main className="flex-grow">
            {loading ? (
              <LoadingScreen />
            ) : (
              <AnimatePresence mode="wait">
                <RoutesWithTransition />
              </AnimatePresence>
            )}
          </main>
          <Footer />
        </div>
        <BackToTopButton />
      </Router>
    </AuthProvider>
  );
};

// Routes with page transitions
const RoutesWithTransition = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <PageTransition>
            <Home />
          </PageTransition>
        }
      />
      <Route
        path="/guides"
        element={
          <PageTransition>
            <Guides />
          </PageTransition>
        }
      />
      <Route
        path="/about"
        element={
          <PageTransition>
            <About />
          </PageTransition>
        }
      />
      <Route
        path="/contact"
        element={
          <PageTransition>
            <Contact />
          </PageTransition>
        }
      />
      <Route
        path="/login"
        element={
          <PageTransition>
            <Login />
          </PageTransition>
        }
      />
      <Route
        path="/register"
        element={
          <PageTransition>
            <Register />
          </PageTransition>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["tourist"]}>
            <PageTransition>
              <TouristDashboard />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PageTransition>
              <AdminDashboard />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/guide-dashboard"
        element={
          <ProtectedRoute allowedRoles={["guide"]}>
            <PageTransition>
              <GuideDashboard />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tours/adventure"
        element={
          <PageTransition>
            <AdventureTours />
          </PageTransition>
        }
      />
      <Route
        path="/tours/cultural"
        element={
          <PageTransition>
            <CulturalTours />
          </PageTransition>
        }
      />
      <Route
        path="/tours/wildlife"
        element={
          <PageTransition>
            <WildlifeTours />
          </PageTransition>
        }
      />
      <Route
        path="/tours/nature"
        element={
          <PageTransition>
            <NatureTours />
          </PageTransition>
        }
      />
      <Route
        path="/tours/all"
        element={
          <PageTransition>
            <AllTours />
          </PageTransition>
        }
      />
      <Route
        path="/tour-details/:id"
        element={
          <PageTransition>
            <TourDetails />
          </PageTransition>
        }
      />
      <Route
        path="/tours/:tourId/book"
        element={
          <ProtectedRoute allowedRoles={["tourist"]}>
            <PageTransition>
              <WrappedBooking tourId={""} />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="/guides/:guideId"
        element={
          <PageTransition>
            <GuideProfile />
          </PageTransition>
        }
      />
      <Route
        path="/booking-details/:id"
        element={
          <ProtectedRoute allowedRoles={["tourist"]}>
            <PageTransition>
              <BookingDetails />
            </PageTransition>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <PageTransition>
            <NotFound />
          </PageTransition>
        }
      />
    </Routes>
  );
};

export default App;
