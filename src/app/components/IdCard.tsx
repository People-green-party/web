import React from 'react';
import Link from "next/link";
import { 
  Copy, 
  MapPin, 
  Phone, 
  Mail, 
  Linkedin, 
  Facebook, 
  Instagram, 
  X, // Twitter icon
  User,
  Menu
} from 'lucide-react';

// --- Types ---
interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string; // URL
}

// --- Mock Data ---
const currentUser = {
  name: "Dr. Sudhanshu Sharma",
  id: "PGP-MEM-0639",
  role: "Worker",
  ward: "Ward 10 – Bani Park, Jaipur",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" // Placeholder
};

const recruitsList: Member[] = [
  { id: '1', name: 'Vikram Chauhan', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=vikram' },
  { id: '2', name: 'Misthi Sharma', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=misthi' },
  { id: '3', name: 'Vikrant Singh', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=vikrant' },
  { id: '4', name: 'Shreya Ghosal', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=shreya' },
  { id: '5', name: 'Raghav Mehta', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=raghav' },
  { id: '6', name: 'Devesh Yadav', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=devesh' },
  { id: '7', name: 'Rohit Chauhan', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=rohit' },
  { id: '8', name: 'Amit Bansal', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=amit' },
  { id: '9', name: 'Rajat Yadav', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=rajat' },
  { id: '10', name: 'Sushma Singh', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=sushma' },
  { id: '11', name: 'Shobha Jha', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=shobha' },
  { id: '12', name: 'Mahima Singh', role: 'Member', avatar: 'https://i.pravatar.cc/150?u=mahima' },
];

const MemberIdCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Member Identification Card</h2>
      
      {/* Photo */}
      <div className="w-full h-48 mb-6 overflow-hidden rounded-lg bg-gray-100">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-[1fr_2fr] gap-y-3 text-sm">
        <span className="text-gray-500 font-medium">Name</span>
        <span className="font-bold text-gray-800 text-right">{currentUser.name}</span>

        <span className="text-gray-500 font-medium">Membership ID</span>
        <span className="font-bold text-gray-800 text-right">{currentUser.id}</span>

        <span className="text-gray-500 font-medium">Role:</span>
        <span className="font-bold text-gray-800 text-right">{currentUser.role}</span>

        <span className="text-gray-500 font-medium">Ward:</span>
        <span className="font-bold text-gray-800 text-right">{currentUser.ward}</span>
      </div>
    </div>
  );
};

const RecruitsPanel = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Top Section: Header & QR */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div className="w-full md:w-3/4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Recruits</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-600">Referral Code:</span>
            <span className="font-bold text-gray-900">ADMINCODE</span>
            <button className="text-gray-400 hover:text-gray-600">
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            Senior Members target 5 workers. Workers Target 20 members
          </p>

          {/* Progress Bar */}
          <div className="relative w-full h-8 bg-green-100 rounded-md overflow-hidden flex items-center">
            <div className="absolute left-0 top-0 h-full bg-green-600 w-[57%]"></div>
            <span className="relative z-10 pl-3 text-sm font-bold text-white">12/21</span>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
            {/* Using a generic QR code image for visual fidelity */}
           <img 
             src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Example" 
             alt="QR Code" 
             className="w-24 h-24 border border-gray-200" 
           />
        </div>
      </div>

      {/* Recruited Members Grid */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-4">Recruited Members</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recruitsList.map((recruit) => (
            <div key={recruit.id} className="flex items-center gap-3">
              <img 
                src={recruit.avatar} 
                alt={recruit.name} 
                className="w-10 h-10 rounded-lg object-cover bg-gray-200"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">{recruit.name}</span>
                <span className="text-xs text-gray-500">{recruit.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="mt-12 bg-white pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        
        {/* Column 1: Logo & Socials */}
        <div className="space-y-6">
            <div className="flex flex-col items-start leading-none">
              <img src="/PGPlogo.svg" alt="PGP Logo" className="w-40 h-25" />
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Follow Us</h4>
              <div className="flex gap-3">
                <SocialIcon Icon={Linkedin} />
                <SocialIcon Icon={Facebook} />
                <SocialIcon Icon={Instagram} />
                <SocialIcon Icon={X} />
              </div>
            </div>
        </div>

        {/* Column 2: Useful Links */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-gray-900">Useful Links</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <FooterLink text="Home" />
            <FooterLink text="About" />
            <FooterLink text="Constitution" />
            <FooterLink text="Join Us" />
          </ul>
        </div>

        {/* Column 3: Additional Links */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-gray-900">Additional Links</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <FooterLink text="Audit Report and Information About Donation" />
            <FooterLink text="ECI Disclosure" />
            <FooterLink text="Declaration about criminal antecedents of candidates set up by the party" />
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div>
          <h4 className="font-bold text-lg mb-4 text-gray-900">Contact Us</h4>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 border border-gray-200 rounded text-green-800">
                 <MapPin size={20} />
              </div>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Ham Badlenge Bhawan, 02 Mission Compound,<br/>
                Ajmer Puliya, Jaipur, Rajasthan
              </p>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 border border-gray-200 rounded text-green-800">
                 <Phone size={20} />
              </div>
              <div className="text-sm text-gray-600 font-medium">
                <p>9521627701</p>
                <p>9950008786</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 border border-gray-200 rounded text-green-800">
                 <Mail size={20} />
              </div>
              <p className="text-sm text-gray-600 font-medium">joinus@peoplesgreen.org</p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Helper Components for Footer
const SocialIcon = ({ Icon }: { Icon: any }) => (
  <a href="#" className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-green-900">
    <Icon size={18} />
  </a>
);

const FooterLink = ({ text }: { text: string }) => (
  <li>
    <a href="#" className="hover:text-green-700 font-medium">{text}</a>
  </li>
);


// --- Main Layout ---

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <main className="max-w-[1400px] mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Member Card */}
          <div className="lg:col-span-1">
            <MemberIdCard />
          </div>

          {/* Right Column: Recruits Panel */}
          <div className="lg:col-span-2">
            <RecruitsPanel />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}