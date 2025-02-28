import HeroSection from "../components/HeroSection";
import SearchTours from "../components/SearchTours";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import FeaturedDestinationsSection from "../components/FeaturedDestinationsSection";
import CulturalHighlightsSection from "../components/CulturalHighlightsSection";
import PopularTours from "../components/PopularTours";
import TravelTipsSection from "../components/TravelTipsSection";
import Gallery from "../components/Gallery";
import InteractiveMapSection from "../components/InteractiveMapSection";
import CallToActionSection from "../components/CallToActionSection";
import TestimonialsSection from "../components/TestimonialsSection";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <HeroSection />
      <SearchTours />
      <AboutSection />
      <ServicesSection />
      <FeaturedDestinationsSection />
      <CulturalHighlightsSection />
      <PopularTours />
      <TestimonialsSection />
      <TravelTipsSection />
      <Gallery />
      <InteractiveMapSection />
      <CallToActionSection />
    </div>
  );
};

export default Home;
