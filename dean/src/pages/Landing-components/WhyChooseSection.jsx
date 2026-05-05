import React from "react";
import { 
  Zap, CheckCircle2, Users, UserPlus, Code, Award, Target
} from "lucide-react";

const WhyChooseSection = ({ 
  typedText, 
  isTypingComplete, 
  whyChooseFeatures,
  connections,
  messages
}) => {
  return (
    <section id="why-choose" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium text-sm mb-4 border border-blue-200">
              <Zap className="w-4 h-4" />
              Why Choose Us
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight min-h-[2.75rem]">
              {typedText}
              <span className={`inline-block w-1 h-10 bg-blue-600 ml-1 ${isTypingComplete ? 'animate-blink' : 'animate-pulse'}`}></span>
            </h2>
            
            <p className="text-base text-gray-700 mb-6 leading-relaxed">
              JoinEazy is designed specifically for academic collaboration. From hackathons to research projects, we help students and educators work together seamlessly.
            </p>

            <div className="space-y-3 mb-6">
              {whyChooseFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Collaboration Visualizer */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl p-6 shadow-xl border border-blue-400/20">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-white">Live Academic Collaboration</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-100">5 users collaborating</span>
                  </div>
                </div>
                <p className="text-xs text-blue-100">Teachers guiding students, teams forming in real-time</p>
              </div>

              {/* Network Visualization */}
              <div className="relative h-64 bg-white/10 backdrop-blur-sm rounded-xl p-6 overflow-hidden border border-white/20">
                {/* Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {connections.map((conn) => {
                    const positions = [
                      { x: 25, y: 25 },
                      { x: 75, y: 25 },
                      { x: 25, y: 75 },
                      { x: 75, y: 75 }
                    ];
                    
                    const from = positions[conn.from];
                    const to = positions[conn.to];
                    
                    return (
                      <line
                        key={conn.id}
                        x1={`${from.x}%`}
                        y1={`${from.y}%`}
                        x2={`${to.x}%`}
                        y2={`${to.y}%`}
                        stroke="url(#blueGradient)"
                        strokeWidth="2.5"
                        className="animate-pulse"
                        opacity="0.8"
                      />
                    );
                  })}
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Student Node 1 */}
                <div className="absolute top-[15%] left-[15%] transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-blue-300 rounded-full blur-lg opacity-60 group-hover:opacity-90 animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/30">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs font-medium text-white bg-blue-500/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">Student Group</span>
                    </div>
                  </div>
                </div>

                {/* Teacher Node */}
                <div className="absolute top-[15%] right-[15%] transform translate-x-1/2 -translate-y-1/2">
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-lg opacity-60 group-hover:opacity-90 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/40 border-2 border-white">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs font-bold text-white bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">Teacher</span>
                    </div>
                  </div>
                </div>

                {/* Student Node 2 */}
                <div className="absolute bottom-[15%] left-[15%] transform -translate-x-1/2 translate-y-1/2">
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-cyan-300 rounded-full blur-lg opacity-60 group-hover:opacity-90 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/30">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs font-medium text-white bg-cyan-500/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">New Student</span>
                    </div>
                  </div>
                </div>

                {/* Student Node 3 */}
                <div className="absolute bottom-[15%] right-[15%] transform translate-x-1/2 translate-y-1/2">
                  <div className="relative group cursor-pointer">
                    <div className="absolute inset-0 bg-indigo-300 rounded-full blur-lg opacity-60 group-hover:opacity-90 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/30">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs font-medium text-white bg-indigo-500/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">CS Student</span>
                    </div>
                  </div>
                </div>

                {/* Central Hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-400 to-indigo-400 rounded-2xl blur-2xl opacity-40 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-2xl flex flex-col items-center justify-center shadow-2xl transform rotate-12 border-2 border-white/30">
                      <Target className="w-10 h-10 text-white mb-1" />
                      <span className="text-xs font-bold text-white">Team Up</span>
                    </div>
                  </div>
                </div>

                {/* Floating particles */}
                <div className="absolute top-[30%] left-[40%] w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-[60%] right-[35%] w-2 h-2 bg-cyan-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-[40%] left-[30%] w-2 h-2 bg-indigo-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }}></div>
              </div>

              {/* Activity Feed */}
              <div className="mt-3 space-y-2 h-20 overflow-hidden">
                {messages.slice(-2).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-white/30 animate-slide-up`}
                  >
                    <span className="text-base">{msg.icon}</span>
                    <span className="text-xs text-white font-medium">{msg.text}</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      msg.color === 'green' ? 'bg-green-400/30 text-green-100 border border-green-400/50' :
                      msg.color === 'blue' ? 'bg-blue-400/30 text-blue-100 border border-blue-400/50' :
                      msg.color === 'purple' ? 'bg-purple-400/30 text-purple-100 border border-purple-400/50' :
                      'bg-orange-400/30 text-orange-100 border border-orange-400/50'
                    }`}>
                      Now
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-3 -right-3 bg-white rounded-xl shadow-xl p-3 border border-gray-100 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Teams Formed</div>
                  <div className="text-base font-bold text-gray-900">124</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-xl p-3 border border-gray-100 animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Active Now</div>
                  <div className="text-base font-bold text-gray-900">47</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;