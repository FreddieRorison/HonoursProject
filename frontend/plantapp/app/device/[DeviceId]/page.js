"use client";

import SideBar from "@/components/sidebar";
import { useState } from "react";

export default function DeviceDashboard() {
  const [token, setToken] = useState("N/A");
  const [revealed, setRevealed] = useState(false);

  const handleRegenerate = () => {
    setToken("NEW_SECRET_TOKEN"); // Replace with actual token generation logic
    setRevealed(false);
  };

  const handleReveal = () => {
    setRevealed(!revealed);
  };

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <SideBar />

      <div className="flex-1 p-6 ml-64">
        <div className="flex items-center justify-between p-4 rounded-lg mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Device Name</h1>
            <p className="text-gray-600">Description</p>
          </div>
          <div className="space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Remove</button>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg max-w-md">
          <label className="block text-gray-700 font-semibold mb-2">Secret Token</label>
          <div className="flex items-center space-x-2 mb-4">
            <input 
              type="text" 
              value={revealed ? token : "*********************"} 
              readOnly 
              className="w-full p-2 border rounded bg-gray-300 text-gray-800" 
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleRegenerate} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Regenerate
            </button>
            <button 
              onClick={handleReveal} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {revealed ? "Hide" : "Reveal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
