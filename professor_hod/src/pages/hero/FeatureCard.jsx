import React from "react";
import { ArrowUpRight } from "lucide-react";

// Feature Card Component
const FeatureCard = ({ title, description, icon: Icon }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard; 