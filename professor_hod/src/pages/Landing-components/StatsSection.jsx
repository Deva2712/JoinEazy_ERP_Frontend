import React from "react";
import { Users, Target, Rocket } from "lucide-react";

const StatsSection = ({ statsInView, animatedStats }) => {
  return (
    <section id="stats-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group cursor-default">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2 tabular-nums">
              {statsInView ? animatedStats.users.toLocaleString() : '0'}+
            </div>
            <div className="text-gray-600 font-medium">Active Students & Educators</div>
            <div className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Growing daily
            </div>
          </div>

          <div className="text-center group cursor-default">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2 tabular-nums">
              {statsInView ? animatedStats.teams.toLocaleString() : '0'}+
            </div>
            <div className="text-gray-600 font-medium">Teams Formed</div>
            <div className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Growing daily
            </div>
          </div>

          <div className="text-center group cursor-default">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2 tabular-nums">
              {statsInView ? animatedStats.projects.toLocaleString() : '0'}+
            </div>
            <div className="text-gray-600 font-medium">Projects Completed</div>
            <div className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Growing daily
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;