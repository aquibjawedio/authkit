import Footer from "./components/shared/Footer";
import HeroSection from "./components/shared/HeroSection";
import SecurityFeatures from "./components/shared/SecurityFeatures";

const App = () => {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col max-w-6xl mx-auto">
      <HeroSection />

      <SecurityFeatures />

      <Footer />
    </div>
  );
};

export default App;
