
import React from 'react';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AdminHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="px-4 py-3 flex items-center gap-3">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-green-600">Admin Panel</h1>
      </div>
    </header>
  );
};

export default AdminHeader;
