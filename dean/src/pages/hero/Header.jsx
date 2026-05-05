import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";
import LOGO_FINAL from "../../assets/images/Joineazy final-01.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactDropdownOpen, setContactDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setContactDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    // Small delay to allow menu to close before scrolling
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        const headerOffset = 100; // Account for fixed header height
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50"> 
      {/* Backdrop blur layer */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-xl" 
           style={{ 
             backdropFilter: 'blur(40px) saturate(180%)', 
             WebkitBackdropFilter: 'blur(40px) saturate(180%)' 
           }}>
      </div>
      
      {/* Content */}
      <div className={`relative transition-all duration-300 ${
          scrolled 
            ? 'shadow-lg border-b border-gray-200' 
            : 'shadow-md border-b border-gray-100'
        }`}>
        <div className="max-w-screen-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-3 group relative z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <img 
                  className="h-20 w-auto relative z-10 transition-transform duration-300 group-hover:scale-105" 
                  src={LOGO_FINAL} 
                  alt="JoinEazy Logo" 
                />
              </div>
            </a>
            
            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
              <button
                onClick={() => scrollToSection('hero-section')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group rounded-lg hover:bg-blue-50"
              >
                Home
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </button>
              <button
                onClick={() => scrollToSection('about-section')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group rounded-lg hover:bg-blue-50"
              >
                About
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </button>
              <button
                onClick={() => scrollToSection('use-cases-section')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group rounded-lg hover:bg-blue-50"
              >
                Use Cases
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </button>
              <button
                onClick={() => scrollToSection('why-choose')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group rounded-lg hover:bg-blue-50"
              >
                Why Us
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </button>
              <button
                onClick={() => scrollToSection('team-section')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group rounded-lg hover:bg-blue-50"
              >
                Team
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </button>
              <button
                onClick={() => scrollToSection('faq-section')}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group rounded-lg hover:bg-blue-50"
              >
                FAQ
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </button>
              
              {/* Contact Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setContactDropdownOpen(!contactDropdownOpen)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative group rounded-lg hover:bg-blue-50 flex items-center gap-1"
                >
                  Contact
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${contactDropdownOpen ? 'rotate-180' : ''}`} />
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
                </button>
                
                {/* Dropdown Menu */}
                {contactDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-3 px-4 animate-slide-down">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Email us at:</p>
                    <a
                      href="mailto:siddhartha20ucse210@mahindrauniversity.edu.in"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm break-all transition-colors duration-200"
                      onClick={() => setContactDropdownOpen(false)}
                    >
                      siddhartha20ucse210@mahindrauniversity.edu.in
                    </a>
                  </div>
                )}
              </div>
            </nav>
            
            {/* Desktop Login Button */}
            <div className="hidden lg:flex items-center">
              <a
                href="/login"
                className="group relative flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">Log in</span>
                <Sparkles className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-300 relative z-10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden relative bg-white shadow-xl border-b border-gray-200 animate-slide-down">
          <div className="max-w-screen-2xl mx-auto px-6">
            <nav className="flex flex-col py-4 space-y-2">
              <button
                onClick={() => scrollToSection('hero-section')}
                className="text-left text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl transition-all duration-300"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('about-section')}
                className="text-left text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl transition-all duration-300"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('use-cases-section')}
                className="text-left text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl transition-all duration-300"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection('why-choose')}
                className="text-left text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl transition-all duration-300"
              >
                Why Us
              </button>
              <button
                onClick={() => scrollToSection('team-section')}
                className="text-left text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl transition-all duration-300"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection('faq-section')}
                className="text-left text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl transition-all duration-300"
              >
                FAQ
              </button>
              
              {/* Mobile Contact */}
              <div className="bg-blue-50 rounded-xl p-4 mt-2">
                <p className="text-xs text-gray-600 mb-2 font-medium">Email us at:</p>
                <a
                  href="mailto:siddhartha20ucse210@mahindrauniversity.edu.in"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm break-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  siddhartha20ucse210@mahindrauniversity.edu.in
                </a>
              </div>
              
              <a
                href="/login"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl hover:shadow-lg font-semibold transition-all duration-300 mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
                <Sparkles className="w-4 h-4" />
              </a>
            </nav>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;