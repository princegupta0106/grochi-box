
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf, Heart, Award, Users } from 'lucide-react';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-100">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 hover:bg-amber-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-amber-700" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-amber-800">About Us</h1>
              <p className="text-xs text-gray-500">Learn about our story</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Welcome to DesiCart Bazaar
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Your trusted source for authentic Rajasthani raw foods & masalas
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-amber-100">
          <h3 className="text-2xl font-bold text-amber-900 mb-6">Our Story</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Born from a deep love for traditional Rajasthani cuisine and the rich agricultural heritage 
            of our land, DesiCart Bazaar was founded with a simple mission: to bring authentic, 
            naturally-grown foods from our farms directly to your kitchen.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our journey began in the heart of Rajasthan, where generations of farmers have cultivated 
            the finest spices, grains, and organic produce using time-honored methods passed down 
            through centuries. We believe in preserving these traditional practices while ensuring 
            the highest quality standards for our customers.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Every product in our collection is carefully sourced from local farmers who share our 
            commitment to natural, chemical-free cultivation. We are not just a marketplace; we are 
            a bridge connecting conscious consumers with the authentic flavors and nutrition of 
            traditional Rajasthani agriculture.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Leaf className="w-6 h-6 text-amber-700" />
              </div>
              <h4 className="text-xl font-bold text-amber-900">100% Natural</h4>
            </div>
            <p className="text-gray-700 leading-relaxed">
              All our products are grown without synthetic pesticides, chemicals, or artificial additives. 
              We believe in the power of nature to provide the purest nutrition.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Heart className="w-6 h-6 text-amber-700" />
              </div>
              <h4 className="text-xl font-bold text-amber-900">Farm to Home</h4>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We work directly with local farmers, ensuring fair prices for growers and the freshest 
              products for our customers. No middlemen, just honest trade.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Award className="w-6 h-6 text-amber-700" />
              </div>
              <h4 className="text-xl font-bold text-amber-900">Quality Assured</h4>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Every batch is carefully inspected and tested to meet our stringent quality standards. 
              Your health and satisfaction are our top priorities.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Users className="w-6 h-6 text-amber-700" />
              </div>
              <h4 className="text-xl font-bold text-amber-900">Community First</h4>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We are committed to supporting local farming communities and preserving traditional 
              agricultural practices for future generations.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8 text-center border border-amber-200">
          <h3 className="text-2xl font-bold text-amber-900 mb-4">Our Mission</h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            To make authentic, naturally-grown Rajasthani foods accessible to every household, 
            while supporting sustainable farming practices and preserving our rich culinary heritage 
            for generations to come.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
