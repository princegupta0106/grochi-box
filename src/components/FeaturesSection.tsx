
import React from 'react';
import { Leaf, Shield, Tractor } from 'lucide-react';

const features = [
  {
    icon: <Leaf className="w-12 h-12 text-amber-700" />,
    title: "100% Organic",
    subtitle: "Certified natural growth",
    description: "No artificial additives, pure ingredients."
  },
  {
    icon: <Shield className="w-12 h-12 text-amber-700" />,
    title: "Chemical-Free", 
    subtitle: "No harmful residues",
    description: "Grown cleanly for your well-being."
  },
  {
    icon: <Tractor className="w-12 h-12 text-amber-700" />,
    title: "Pesticide-Free",
    subtitle: "Safe for you & earth", 
    description: "Supporting local eco-systems."
  },
  {
    icon: <Leaf className="w-12 h-12 text-amber-700" />,
    title: "Farm Fresh",
    subtitle: "Directly from our fields",
    description: "Packed to preserve natural goodness."
  }
];

const FeaturesSection = () => {
  return (
    <div className="px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 hover:shadow-md transition-all duration-200 text-center"
          >
            <div className="flex justify-center mb-3">
              {feature.icon}
            </div>
            <h3 className="font-bold text-amber-900 text-sm mb-1">
              {feature.title}
            </h3>
            <p className="text-xs text-amber-700 mb-2">
              {feature.subtitle}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
