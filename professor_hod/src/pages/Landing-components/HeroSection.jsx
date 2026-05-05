import React from "react";
import { 
  BarChart3, Star, ArrowRight, Award, UserPlus
} from "lucide-react";

const HeroSection = ({
  teamMembers,
  setTeamMembers,
  hoveredMember,
  setHoveredMember,
  chartHeights,
  scrollToFAQ,
  addTeamMember,
  removeTeamMember
}) => {
  return (
    <section id="hero-section" className="relative bg-white overflow-hidden -mt-20 pt-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full mb-6">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ students & educators</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Course Management{" "}
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Made Effortless.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
              The ultimate platform for students, teachers, and teams to collaborate on projects, hackathons, research, and academic initiatives.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <a 
                href="/login" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button 
                onClick={scrollToFAQ}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer shadow-md"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column - Animated Dashboard */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Team Dashboard</div>
                      <div className="text-xs text-gray-500">Live Analytics</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="text-2xl font-bold text-blue-900">87%</div>
                    <div className="text-xs text-blue-700">Completion Rate</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-900">24</div>
                    <div className="text-xs text-purple-700">Active Projects</div>
                  </div>
                </div>

                {/* Animated Chart */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {chartHeights.map((height, i) => (
                      <div 
                        key={i}
                        className={`flex-1 rounded-t-lg transition-all duration-1000 ease-out bg-gradient-to-t ${
                          i === 0 ? 'from-blue-600 to-blue-400' :
                          i === 1 ? 'from-purple-600 to-purple-400' :
                          i === 2 ? 'from-green-600 to-green-400' :
                          i === 3 ? 'from-orange-600 to-orange-400' :
                          'from-pink-600 to-pink-400'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Interactive Team Builder */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900">Build Your Team</span>
                    <button
                      onClick={addTeamMember}
                      disabled={teamMembers.length >= 4}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                        teamMembers.length >= 4
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      }`}
                    >
                      {teamMembers.length >= 4 ? '✓ Complete' : '+ Add'}
                    </button>
                  </div>
                  
                  <div className="flex -space-x-3 mb-3">
                    {teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="group relative cursor-pointer"
                        onMouseEnter={() => setHoveredMember(index)}
                        onMouseLeave={() => setHoveredMember(null)}
                      >
                        <div className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br ${member.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                          <span className="text-white text-xs font-bold">{member.name.substring(0, 2)}</span>
                        </div>
                        {hoveredMember === index && (
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap z-10">
                            {member.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTeamMember(index);
                              }}
                              className="ml-2 text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {teamMembers.length < 4 && (
                      <div className="w-10 h-10 rounded-full border-2 border-gray-300 border-dashed bg-gray-100 flex items-center justify-center text-gray-400">
                        <UserPlus className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progress</span>
                      <span>{teamMembers.length}/4</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
                        style={{ width: `${(teamMembers.length / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-90 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-full h-full flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-90 shadow-xl animate-pulse"></div>
            <div className="absolute top-1/2 -left-8 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-lg opacity-90 shadow-xl animate-bounce" style={{ animationDuration: '4s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;