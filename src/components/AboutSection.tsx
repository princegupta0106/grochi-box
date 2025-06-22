
import React from 'react';
import { Leaf, Tractor, Shield } from 'lucide-react';

const AboutSection = () => {
  return (
    <div className="px-4 py-8 bg-white rounded-xl shadow-sm my-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Purely Sustainable
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed max-w-3xl mx-auto">
            Our commitment is to 100% natural cultivation. By avoiding all pesticides and
            chemicals, we ensure the purest ingredients, nurtured solely by sun, water, and healthy
            soil.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-6 bg-amber-50 rounded-lg border border-amber-100">
            <Leaf className="w-12 h-12 text-amber-700 mb-4" />
            <h3 className="font-semibold text-amber-900 mb-2">Natural Farming</h3>
            <p className="text-sm text-gray-600">Grown without synthetic inputs</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-amber-50 rounded-lg border border-amber-100">
            <Tractor className="w-12 h-12 text-amber-700 mb-4" />
            <h3 className="font-semibold text-amber-900 mb-2">Healthy Soil</h3>
            <p className="text-sm text-gray-600">Nurtured for nutrient density</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-amber-50 rounded-lg border border-amber-100">
            <Shield className="w-12 h-12 text-amber-700 mb-4" />
            <h3 className="font-semibold text-amber-900 mb-2">Eco-Conscious</h3>
            <p className="text-sm text-gray-600">Sustainable, earth-friendly methods</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 bg-amber-50 rounded-lg border border-amber-100">
            <Leaf className="w-12 h-12 text-amber-700 mb-4" />
            <h3 className="font-semibold text-amber-900 mb-2">Hand-Harvested</h3>
            <p className="text-sm text-gray-600">Picked with care for quality</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
