import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Linkedin, Youtube, X } from "lucide-react";
import LOGO_JOINEAZY from "../../assets/images/Joineazy final-01.png";

// Cool Footer Component
const Footer = () => {
  const [showVideo, setShowVideo] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCreateTeamClick = (e) => {
    e.preventDefault();
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
  };

  return (
    <>
      <footer className="relative z-10 bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800 border-t border-blue-200">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50"></div>
        <div className="relative z-10 px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-x-2.5 mb-6 cursor-pointer hover:opacity-80 transition-opacity duration-300" onClick={scrollToTop}>
                  <img className="h-32 w-auto" src={LOGO_JOINEAZY} alt="Joineazy Logo" />
                </div>
                <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                  JoinEazy is the modern platform that makes team collaboration effortless and intuitive. Connect with like-minded individuals and build amazing projects together.
                </p>
                
                {/* Social Media Icons */}
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/joineazy/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                  <a href="https://x.com/joineazy" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                  <a href="https://www.facebook.com/Joineazy/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a href="https://www.linkedin.com/company/joineazy/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                  <a href="https://www.youtube.com/channel/UCDWYP1-BdDG1wYuz67962Xg" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <Youtube className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/home" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Home</Link></li>
                  <li><button onClick={handleCreateTeamClick} className="text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer">Create Team</button></li>
                  <li><Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Login</Link></li>
                  <li><Link to="/signup" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Sign Up</Link></li>
                </ul>
              </div>
              
              {/* Support */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Support</h3>
                <ul className="space-y-2">
                  <li><Link to="/help" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Help Center</Link></li>
                  <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Contact Us</Link></li>
                  <li><Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors duration-300">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-blue-200 mt-12 pt-8 text-center">
              <p className="text-gray-500">
                © 2024 JoinEazy. All rights reserved. Made with ❤️ for teams everywhere.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeVideo}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <video
              className="w-full h-auto rounded-lg shadow-2xl"
              controls
              autoPlay
            >
              <source src="/src/assets/videos/create team video - Made with Clipchamp.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer; 