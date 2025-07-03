import React, { useState } from "react";
import Slider from "./Home/Slider";
import CoreFeatures from "./Home/CoreFeatures";
import HowItWorks from "./Home/HowItWorks";
import TrustSafety from "./Home/TrustSafety";
import Statistics from "./Home/Statistics";
import OtcProducts from "./Home/OtcProducts";
import Testimonial from "./Home/Components/Testimonials";
import { Cta } from "./Home/Components/Cta";
import Hero1 from "./Home/Hero1";
import PrescriptionUploadModal from "../components/Prescription/PrescriptionUploadModal";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This function can be passed to any child to open the modal
  const openPrescriptionModal = () => setIsModalOpen(true);

  return (
    <div className="overflow-hidden">
      <Slider openPrescriptionModal={openPrescriptionModal} />
      {/* Remove the prop from HowItWorks */}
      <HowItWorks />
      <CoreFeatures />
      <OtcProducts />
      <Statistics />
      <Testimonial />
      <Cta />
      <PrescriptionUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Home;
