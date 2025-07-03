import React from "react";
import Slider from "./Home/Slider";
import CoreFeatures from "./Home/CoreFeatures";
import HowItWorks from "./Home/HowItWorks";
import TrustSafety from "./Home/TrustSafety";
import Statistics from "./Home/Statistics";
import OtcProducts from "./Home/OtcProducts";
import Testimonial from "./Home/Components/Testimonials";
import { Cta } from "./Home/Components/Cta";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Slider />
      <HowItWorks />
      <CoreFeatures />
      <OtcProducts />
      <Statistics />
      <Testimonial />
      <Cta />
    </div>
  );
};

export default Home;
