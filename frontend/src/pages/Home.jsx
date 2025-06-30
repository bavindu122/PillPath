import React from "react";
import Slider from "./Home/Slider";
import CoreFeatures from "./Home/CoreFeatures";
import HowItWorks from "./Home/HowItWorks";
import TrustSafety from "./Home/TrustSafety";
import Statistics from "./Home/Statistics";
import Benefits from "./Home/Benefits";


const Home = () => {
  return (
    <div className="overflow-hidden">
      <Slider />  
      <HowItWorks />
      <CoreFeatures />
      <TrustSafety />
      <Statistics />
      <Benefits />
    </div>
  );
};

export default Home;