import React from "react";
import { Sparkles } from "lucide-react";

const FeaturesSection = ({ features }) => {
  return (
    <section id="features-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Everything You Need for Academic Success
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Powerful tools designed for students and educators to excel in projects, hackathons, research, and teamwork.
          </p>
        </div>

        {/* Infinite Scrolling Container */}
        <div className="relative">
          {/* Gradient Overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-blue-700 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-700 to-transparent z-10 pointer-events-none"></div>

          <div className="overflow-hidden">
            <div className="flex animate-scroll-left hover:pause-animation">
              {/* Duplicate features array for seamless loop */}
              {[...features, ...features].map((feature, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 mx-3"
                >
                  <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full">
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-gradient-to-br ${feature.gradient}`} style={{ zIndex: -1 }} />
                    
                    {/* Icon and Title on the same line */}
                    <div className="flex items-center gap-4 mb-4">
                      {/* Icon Container */}
                      <div className="relative flex-shrink-0">
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity`} />
                        <div className={`relative w-14 h-14 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <feature.icon className="w-7 h-7 text-blue-600" />
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-white flex-1">
                        {feature.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className="text-blue-100 leading-relaxed text-sm">
                      {feature.description}
                    </p>

                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-bl-full`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }

        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;