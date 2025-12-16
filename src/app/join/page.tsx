"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Facebook,
  Instagram,
  X,
  Play,
} from "lucide-react";

// --- Navbar Component ---
const Navbar = () => (
  <nav className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-50 border-b border-gray-100">
    <div className="flex flex-col items-center leading-none cursor-pointer">
      <img src="/PGPlogo.svg" alt="PGP Logo" className="w-[114px] h-[60px] object-cover" />
    </div>
    <div className="hidden lg:flex gap-8 items-center text-sm font-medium text-gray-600">
      {['Home', 'About', 'Constitution', 'Donate', 'Declaration'].map((link) => {
        const getHref = (linkName: string) => {
          switch(linkName) {
            case 'Home': return '/';
            case 'About': return '/about';
            case 'Constitution': return '/constitution';
            case 'Donate': return '/donation';
            case 'Declaration': return '/declaration';
            default: return '#';
          }
        };
        return (
          <a key={link} href={getHref(link)} className="hover:text-green-700 transition-colors">{link}</a>
        );
      })}
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-gray-300 rounded overflow-hidden h-8">
        <button className="px-2 text-xs font-medium hover:bg-gray-50 h-full">हि</button>
        <div className="w-px h-full bg-gray-300"></div>
        <button className="px-2 text-xs font-bold bg-green-50 text-green-800 h-full">En</button>
      </div>
      <button className="px-5 py-1.5 bg-green-900 text-white text-sm font-medium rounded hover:bg-green-800">Join Us</button>
      <button className="px-5 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50">Login</button>
    </div>
  </nav>
);

const JoinPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-14">
        {/* Title */}
        <section className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800">
            Join Peoples Green Party
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-600">
            Unite for Progress, Stand for a Better Tomorrow
          </p>
        </section>

        {/* Top: Image + Form */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch md:h-[450px] lg:h-[698px]">
          {/* Left: Image with play button */}
          <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-sm border border-gray-200">
            <img
              src="/Frame 2087326335.svg"
              alt="People gathering"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              // CHANGED: Smaller button on mobile (w-12), larger on desktop (lg:w-16)
              className="absolute inset-0 m-auto flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/90 shadow-md hover:scale-105 transition-transform"
            >
              <Play className="w-6 h-6 lg:w-8 lg:h-8 text-green-700 ml-1" />
            </button>
          </div>

          {/* Right: Registration form */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 lg:p-6 h-full flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              Registration Form
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Fill the form below to begin your journey with us.
            </p>

            <form
              className="space-y-4 flex-1 overflow-y-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              {/* First / Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <select className="w-20 md:w-24 rounded-md border border-gray-300 px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent">
                    <option>+91</option>
                    <option>+1</option>
                    <option>+44</option>
                  </select>
                  <input
                    type="tel"
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Mobile Number"
                  />
                </div>
              </div>

              {/* State / District */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    State
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent">
                    <option value="">Select State</option>
                    <option>Rajasthan</option>
                    <option>Uttar Pradesh</option>
                    <option>Maharashtra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    District
                  </label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent">
                    <option value="">Select District</option>
                    <option>Jaipur</option>
                    <option>Ajmer</option>
                    <option>Kota</option>
                  </select>
                </div>
              </div>

              {/* Constituency */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Your legislative assembly constituency
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Enter your constituency"
                />
              </div>

              {/* ZIP */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Postal Code"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-1">
                <label className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-green-700 focus:ring-green-600"
                  />
                  <span className="leading-snug">Do you agree to join the party?</span>
                </label>
                <label className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-green-700 focus:ring-green-600"
                  />
                  <span className="leading-snug">
                    Do you want to take any responsibility or position in the
                    party?
                  </span>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-green-700 text-white text-sm font-semibold py-3 md:py-2.5 hover:bg-green-800 transition-colors"
              >
                Join Us
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-10 bg-white border-t border-gray-200 pt-10 pb-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Socials */}
          <div className="space-y-6">
            <div className="flex flex-col items-start leading-none">
              <img src="/PGPlogo.svg" alt="PGP Logo" className="w-32 md:w-40 h-auto" />
            </div>

            <div>
              <h4 className="font-bold text-base md:text-lg mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <SocialIcon Icon={Linkedin} />
                <SocialIcon Icon={Facebook} />
                <SocialIcon Icon={Instagram} />
                <SocialIcon Icon={X} />
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-3 text-gray-900">
              Useful Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <FooterLink text="Home" />
              <FooterLink text="About" />
              <FooterLink text="Constitution" />
              <FooterLink text="Join Us" />
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-3 text-gray-900">
              Additional Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <FooterLink text="Audit Report and Information About Donation" />
              <FooterLink text="ECI Disclosure" />
              <FooterLink text="Declaration about criminal antecedents of candidates set up by the party" />
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-base md:text-lg mb-3 text-gray-900">
              Contact Us
            </h4>
            <div className="space-y-4 text-sm text-gray-600 font-medium">
              <div className="flex gap-3 items-start">
                <div className="p-2 border border-gray-200 rounded text-green-800 shrink-0">
                  <MapPin size={18} />
                </div>
                <p>
                  Ham Badlenge Bhawan, 02 Mission Compound,
                  <br />
                  Ajmer Puliya, Jaipur, Rajasthan
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 border border-gray-200 rounded text-green-800 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p>9521627701</p>
                  <p>9950008786</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 border border-gray-200 rounded text-green-800 shrink-0">
                  <Mail size={18} />
                </div>
                <p className="break-all">joinus@peoplesgreen.org</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper components
const SocialIcon = ({ Icon }: { Icon: React.ComponentType<{ size?: number }> }) => (
  <a
    href="#"
    className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-green-900 transition-colors"
  >
    <Icon size={18} />
  </a>
);

const FooterLink = ({ text }: { text: string }) => (
  <li>
    <a href="#" className="hover:text-green-700 font-medium transition-colors">
      {text}
    </a>
  </li>
);

export default JoinPage;