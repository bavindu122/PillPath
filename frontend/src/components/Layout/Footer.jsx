import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { Mail, Phone, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <div className="md:mx-10  rounded-2xl bg-white/90 backdrop-blur-lg p-5 shadow-lg">
      <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 my-10 mt-10 text-sm">
        {/*1*/}
        <div>
          <img className="mb-5 w-40 h-15" src={assets.logo1} alt="logo" />
          <p className="w-full md:w-2/3 text-gray-700 leading-6">
            Your trusted partner in healthcare delivery.
            <br /> Providing genuine medicines with fast,
            <br /> reliable service since 2020.
          </p>

          <div className="flex flex-cols gap-4 mt-2 ml-5 text-pButton hover:text-pButtonH animate-pulse">
            <Facebook />
            <Twitter />
            <Instagram />
          </div>
        </div>

        {/*2*/}
        <div>
          <p className="text-xl font-medium mb-5 text-semibold">Quick Links</p>
          <ul className="flex flex-col gap-2 text-gray-800 ">
            <NavLink to={"/"}>
              <li className="hover:text-pButtonH cursor-pointer">Home</li>
            </NavLink>
            <NavLink to={"/about"}>
              <li className="hover:thover:text-pButtonH cursor-pointer">
                About us
              </li>
            </NavLink>

            <li className="hover:hover:text-pButtonH cursor-pointer">
              Pharmacies
            </li>

            <NavLink to={"/contact"}>
              <li className="hover:text-pButtonH cursor-pointer">Contact us</li>
            </NavLink>
          </ul>
        </div>

        {/*3*/}
        <div>
          <p className="text-xl font-medium mb-5 text-semibold ">Services</p>
          <ul className="flex flex-col gap-2 text-gray-800 hover:hover:text-pButtonH cursor-pointer">
            <li>Prescription Management</li>
            <li>Pharmacy Matching</li>
            <li>Order Preview</li>
            <li>OTC Storefront</li>
            <li>SMS Alerts</li>
            <li>Family Profile Management</li>
          </ul>
        </div>

        {/*4*/}
        <div>
          <p className="text-xl font-medium mb-5 text-semibold">Contact Info</p>
          <div className="flex flex-col gap-3">
            <p className="flex flex-cols gap-2 text-gray-800 hover:hover:text-pButtonH cursor-pointer">
              <Mail /> pillpath@gmail.com
            </p>
            <p className="flex flex-cols gap-2 text-gray-800 hover:hover:text-pButtonH cursor-pointer">
              <Phone /> +9411321489
            </p>
          </div>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-3 text-sm text-center">
          Copyright © 2025 PillPath - All Right Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
