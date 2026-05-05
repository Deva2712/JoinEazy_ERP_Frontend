import React, { useState } from "react";
import { Linkedin, Github, Mail, Coffee } from "lucide-react";

const TeamSection = () => {
  const [hoveredMember, setHoveredMember] = useState(null);

  const team = [
    {
      name: "Suhitha",
      role: "Founder & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suhitha&backgroundColor=b6e3f4",
      bio: "Former student who struggled to find hackathon teammates",
      linkedin: "#",
      github: "#",
      email: "suhitha@joineazy.com",
      color: "blue",
      rotation: "-2deg",
      funFact: "Coffee addict ☕"
    },
    {
      name: "Siddhartha",
      role: "Head of Engineering",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siddhartha&backgroundColor=ffd5dc",
      bio: "Built matching algorithms that connected 10K+ students",
      linkedin: "#",
      github: "#",
      email: "siddhartha@joineazy.com",
      color: "pink",
      rotation: "1.5deg",
      funFact: "Loves debugging at 3am 🌙"
    },
    {
      name: "Emil",
      role: "Head of Design",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=c0aede",
      bio: "Designs interfaces that students actually want to use",
      linkedin: "#",
      github: "#",
      email: "marcus@joineazy.com",
      color: "purple",
      rotation: "-1deg",
      funFact: "Pixel perfectionist 🎨"
    },
    {
      name: "esh",
      role: "Community Lead",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=d1f4dd",
      bio: "Connects students globally, one team at a time",
      linkedin: "#",
      github: "#",
      email: "sofia@joineazy.com",
      color: "green",
      rotation: "2deg",
      funFact: "Team builder extraordinaire 🚀"
    }
  ];

  return (
    <section id="team-section" className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 relative overflow-hidden">
      {/* Decorative doodles */}
      <div className="absolute top-10 left-10 w-20 h-20 border-4 border-blue-300 rounded-full opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 border-4 border-cyan-300 rotate-45 opacity-20"></div>
      <div className="absolute top-40 right-40 text-6xl opacity-10">✨</div>
      <div className="absolute bottom-40 left-40 text-5xl opacity-10">💡</div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with handwritten style */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Caveat', cursive" }}>
              Meet the Dreamers
            </h2>
            {/* Underline scribble */}
            <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
              <path d="M0,7 Q50,3 100,7 T200,7" stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-base text-gray-600 mt-4 max-w-2xl mx-auto">
            We're students who've been there. Now we're building the platform we always wished we had.
          </p>
        </div>

        {/* Polaroid-style cards */}
        <div className="flex gap-6 max-w-7xl mx-auto overflow-x-auto pb-4 px-4 justify-center">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative flex-shrink-0 w-52"
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
              style={{
                transform: `rotate(${member.rotation})`,
                transition: 'all 0.3s ease'
              }}
            >
              {/* Polaroid card */}
              <div className={`bg-white p-3 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                hoveredMember === index ? 'scale-105 rotate-0 z-10' : ''
              }`}>
                {/* Photo */}
                <div className="bg-gray-100 mb-3 overflow-hidden aspect-square">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Handwritten note style info */}
                <div className="space-y-1.5 mb-2">
                  <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Caveat', cursive" }}>
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Fun fact sticky note */}
                <div className="bg-yellow-100 p-1.5 -rotate-1 mb-2 border-l-2 border-yellow-400">
                  <p className="text-xs text-gray-700" style={{ fontFamily: "'Caveat', cursive" }}>
                    {member.funFact}
                  </p>
                </div>

                {/* Social links */}
                <div className="flex gap-1.5 pt-2 border-t border-gray-200">
                  <a 
                    href={member.linkedin}
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-blue-100 transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-gray-700" />
                  </a>
                  <a 
                    href={member.github}
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-3.5 h-3.5 text-gray-700" />
                  </a>
                  <a 
                    href={`mailto:${member.email}`}
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-green-100 transition-colors"
                    title="Email"
                  >
                    <Mail className="w-3.5 h-3.5 text-gray-700" />
                  </a>
                </div>
              </div>

              {/* Tape effect */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-5 bg-blue-100 opacity-70 rotate-180 shadow-sm"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 mb-3">Want to join our mission?</p>
        </div>
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
      `}</style>
    </section>
  );
};

export default TeamSection;