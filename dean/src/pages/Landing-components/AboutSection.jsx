import React, { useState, useEffect } from "react";
import { 
  Users, Target, Lightbulb, Rocket, 
  Heart, Zap, Sparkles
} from "lucide-react";

const AboutSection = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  const cards = [
    {
      icon: Target,
      title: "Our Mission",
      description: "Empowering students and educators to collaborate seamlessly, breaking down barriers to teamwork and innovation in academia.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description: "A world where every student finds the perfect teammates, every project reaches its potential, and collaboration knows no bounds.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "Built on trust, transparency, and community. We believe in making education collaborative, accessible, and inspiring for everyone.",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: Rocket,
      title: "Our Impact",
      description: "Connecting thousands of students daily, fostering innovation through hackathons, research projects, and academic collaborations worldwide.",
      gradient: "from-green-500 to-green-600"
    }
  ];

  useEffect(() => {
    const shuffleInterval = setInterval(() => {
      setIsShuffling(true);
      
      setTimeout(() => {
        setActiveCardIndex((prev) => (prev + 1) % cards.length);
        setIsShuffling(false);
      }, 300);
    }, 3500);

    return () => clearInterval(shuffleInterval);
  }, [cards.length]);

  return (
    <section id="about-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">About JoinEazy</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4">
            Where Collaboration Meets Innovation
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Building the future of academic teamwork, one connection at a time
          </p>
        </div>

        {/* Single Card Carousel */}
        <div className="relative max-w-3xl mx-auto">
          <div className="relative h-[300px] overflow-hidden">
            {cards.map((card, index) => {
              const Icon = card.icon;
              const isActive = index === activeCardIndex;
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    isActive 
                      ? 'translate-x-0 opacity-100' 
                      : index < activeCardIndex 
                        ? '-translate-x-full opacity-0' 
                        : 'translate-x-full opacity-0'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-2 border-gray-200 h-full flex flex-col">
                    {/* Icon and Heading on same line */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg flex-shrink-0`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {card.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-lg leading-relaxed flex-1">
                      {card.description}
                    </p>

                    {/* Card indicator at bottom */}
                    <div className="flex items-center gap-3 mt-6 pt-6 border-t-2 border-gray-100">
                      {cards.map((c, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            i === index
                              ? `w-12 bg-gradient-to-r ${card.gradient}`
                              : 'w-2 bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {cards.map((card, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsShuffling(true);
                  setTimeout(() => {
                    setActiveCardIndex(index);
                    setIsShuffling(false);
                  }, 300);
                }}
                className={`transition-all duration-300 rounded-full ${
                  activeCardIndex === index
                    ? `w-12 h-3.5 bg-gradient-to-r ${card.gradient} shadow-lg`
                    : 'w-3.5 h-3.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;