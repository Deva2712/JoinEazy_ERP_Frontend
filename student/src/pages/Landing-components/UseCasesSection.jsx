import React, { useState, useEffect } from "react";
import { 
  GraduationCap, Brain, Building2, Sparkles
} from "lucide-react";

const UseCasesSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeIcons, setActiveIcons] = useState([]);

  useEffect(() => {
    // Random floating icons animation
    const iconInterval = setInterval(() => {
      const randomIcon = Math.floor(Math.random() * 3);
      setActiveIcons(prev => [...prev, { id: Date.now(), type: randomIcon }]);
      
      setTimeout(() => {
        setActiveIcons(prev => prev.slice(1));
      }, 3000);
    }, 1500);

    return () => clearInterval(iconInterval);
  }, []);

  const useCases = [
    {
      title: "Students",
      icon: GraduationCap,
      color: "from-orange-400 via-red-400 to-pink-500",
      bgColor: "from-orange-50 to-pink-50",
      shape: "rounded-tl-[80px] rounded-br-[80px] rounded-tr-3xl rounded-bl-3xl",
      rotation: "-3deg",
      floatingEmoji: "🎓"
    },
    {
      title: "Professors",
      icon: Brain,
      color: "from-violet-400 via-purple-400 to-fuchsia-500",
      bgColor: "from-violet-50 to-fuchsia-50",
      shape: "rounded-tr-[80px] rounded-bl-[80px] rounded-tl-3xl rounded-br-3xl",
      rotation: "2deg",
      floatingEmoji: "👨‍🏫"
    },
    {
      title: "Universities",
      icon: Building2,
      color: "from-emerald-400 via-teal-400 to-cyan-500",
      bgColor: "from-emerald-50 to-cyan-50",
      shape: "rounded-tl-[80px] rounded-br-[80px] rounded-tr-3xl rounded-bl-3xl",
      rotation: "-2deg",
      floatingEmoji: "🏛️"
    }
  ];

  return (
    <section id="use-cases-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-purple-200 to-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Floating icons */}
      {activeIcons.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl opacity-20 pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: 'float-up 3s ease-out forwards'
          }}
        >
          {useCases[item.type].floatingEmoji}
        </div>
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border-2 border-orange-200">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-700">Built for Academia</span>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Everyone Collaborates
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From solo learners to entire institutions—discover how JoinEazy transforms collaboration
          </p>
        </div>

        {/* Shaped Cards in Single Row */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center max-w-4xl mx-auto">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={index}
                className="relative w-full lg:w-64 group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.2}s both`
                }}
              >
                {/* Floating emoji */}
                <div 
                  className="absolute -top-6 -right-6 text-6xl z-20 transition-all duration-500"
                  style={{
                    transform: isHovered ? 'scale(1.2) rotate(15deg)' : 'scale(1) rotate(0deg)'
                  }}
                >
                  {useCase.floatingEmoji}
                </div>

                {/* Card */}
                <div
                  className={`relative bg-gradient-to-br ${useCase.bgColor} ${useCase.shape} p-8 shadow-2xl border-4 border-white transition-all duration-500 overflow-hidden ${
                    isHovered ? 'scale-105 shadow-3xl' : ''
                  }`}
                  style={{
                    transform: isHovered ? 'rotate(0deg)' : `rotate(${useCase.rotation})`,
                    minHeight: '200px'
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 transition-opacity duration-500 ${
                    isHovered ? 'opacity-10' : ''
                  }`}></div>

                  {/* Icon and Title centered */}
                  <div className="flex flex-col items-center justify-center h-full">
                    {/* Icon */}
                    <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${useCase.color} rounded-3xl shadow-xl mb-4 transition-all duration-500 ${
                      isHovered ? 'scale-110 rotate-12' : ''
                    }`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold text-gray-900 text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {useCase.title}
                    </h3>
                  </div>

                  {/* Decorative corner accent */}
                  <div className={`absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br ${useCase.color} rounded-full blur-2xl opacity-30 transition-all duration-500 ${
                    isHovered ? 'scale-150' : 'scale-100'
                  }`}></div>
                </div>

                {/* Shadow effect */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${useCase.color} ${useCase.shape} -z-10 blur-xl transition-opacity duration-500 ${
                    isHovered ? 'opacity-30' : 'opacity-0'
                  }`}
                  style={{ transform: 'scale(0.95)' }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Bottom stat ticker */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg border-2 border-orange-100">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-semibold">50,000+ Active Users</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg border-2 border-purple-100">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="text-gray-700 font-semibold">10,000+ Teams Formed</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg border-2 border-cyan-100">
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span className="text-gray-700 font-semibold">50+ Universities</span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float-up {
          from {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          to {
            transform: translateY(-100px) rotate(180deg);
            opacity: 0;
          }
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </section>
  );
};

export default UseCasesSection;