import React from "react";
import { Link } from "react-router-dom";

// Hero Section Component
const HeroSection = () => {
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Badge above main heading */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-sm font-medium text-purple-700 border border-purple-200">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          ✨ The Future of Team Collaboration
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              JoinEazy
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The modern platform that makes collaboration effortless and intuitive for teams everywhere.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
          <Link
            to="/home"
            className="px-8 py-4 border border-gray-300 bg-white/50 backdrop-blur-sm text-gray-700 rounded-xl font-semibold hover:bg-white/80 transition-all duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 