import React from "react";
import { 
  Zap, CheckCircle2, X, Clock, Sparkles, Rocket
} from "lucide-react";

const ComparisonSection = ({ 
  comparisonView, 
  setComparisonView, 
  setIsTransitioning 
}) => {
  return (
    <section id="comparison-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-full font-medium text-sm mb-6 border border-purple-100">
              <Zap className="w-4 h-4" />
              The Transformation
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              From Chaos to Clarity
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Watch how JoinEazy transforms scattered, inefficient teamwork into streamlined collaboration. Every 2 seconds, see the dramatic difference between traditional methods and our intelligent platform.
            </p>

            {/* Key Points */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">One Unified Platform</h4>
                  <p className="text-sm text-gray-600">No more juggling multiple tools and losing information</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">AI-Powered Matching</h4>
                  <p className="text-sm text-gray-600">Find perfect teammates in seconds, not hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Complete Visibility</h4>
                  <p className="text-sm text-gray-600">Track every project milestone in real-time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Compact Card Transition */}
          <div className="relative">
            {/* Traditional Card */}
            <div 
              className={`absolute inset-0 transition-all duration-500 ${
                comparisonView === 'traditional' 
                  ? 'opacity-100 scale-100 rotate-0' 
                  : 'opacity-0 scale-95 -rotate-3'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-2xl shadow-2xl p-6 border-4 border-gray-600">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-600">
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Traditional Way</h3>
                    <p className="text-xs text-gray-700 font-medium">Scattered & Slow</p>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg border-2 border-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900">Multiple scattered apps</span>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg border-2 border-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900">Hours finding teammates</span>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg border-2 border-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900">No project tracking</span>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm p-3 rounded-lg border-2 border-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-gray-900">Missed deadlines</span>
                    </div>
                  </div>
                </div>

                {/* Footer Badge */}
                <div className="mt-5 pt-4 border-t-2 border-gray-600 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-600 rounded-full text-white text-sm font-bold">
                    <Clock className="w-4 h-4" />
                    Frustrating
                  </div>
                </div>
              </div>
            </div>

            {/* JoinEazy Card */}
            <div 
              className={`transition-all duration-500 ${
                comparisonView === 'joineazy' 
                  ? 'opacity-100 scale-100 rotate-0' 
                  : 'opacity-0 scale-95 rotate-3'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-2xl p-6 border-4 border-blue-400">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-blue-400">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">JoinEazy Way</h3>
                    <p className="text-xs text-blue-100 font-medium">Smart & Fast</p>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-lg border-2 border-white/30">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-white">One unified platform</span>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-lg border-2 border-white/30">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-white">AI instant matching</span>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-lg border-2 border-white/30">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-white">Real-time dashboards</span>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-lg border-2 border-white/30">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-white">Smart reminders</span>
                    </div>
                  </div>
                </div>

                {/* Footer Badge */}
                <div className="mt-5 pt-4 border-t-2 border-blue-400 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-bold">
                    <Rocket className="w-4 h-4" />
                    Efficient
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setComparisonView('traditional');
                    setIsTransitioning(false);
                  }, 400);
                }}
                className={`transition-all duration-300 rounded-full ${
                  comparisonView === 'traditional' 
                    ? 'w-8 h-2.5 bg-gray-600' 
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
              <button
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setComparisonView('joineazy');
                    setIsTransitioning(false);
                  }, 400);
                }}
                className={`transition-all duration-300 rounded-full ${
                  comparisonView === 'joineazy' 
                    ? 'w-8 h-2.5 bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-blue-300'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;