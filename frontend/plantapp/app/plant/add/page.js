"use client";

import SideBar from "@/components/sidebar";
import { useState } from "react";

export default function AddPlant() {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [trackedMetrics, setTrackedMetrics] = useState({
    moisture: false,
    temperature: false,
    ph: false,
  });

  const handleMetricChange = (metric) => {
    setTrackedMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <SideBar />

      <div className="flex-1 p-6 ml-80 mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Plant</h1>
        
        <div className="bg-white shadow-md p-6 rounded-lg max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-2 border rounded bg-gray-300" 
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Plant Species</label>
            <select 
              value={species} 
              onChange={(e) => setSpecies(e.target.value)} 
              className="w-full p-2 border rounded bg-gray-300"
            >
              <option value="">Select Species</option>
              <option value="Aloe Vera">Aloe Vera</option>
              <option value="Basil">Basil</option>
              <option value="Cactus">Cactus</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Tracked Metrics</label>
            <div className="flex flex-col space-y-2">
              {Object.keys(trackedMetrics).map((metric) => (
                <label key={metric} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={trackedMetrics[metric]} 
                    onChange={() => handleMetricChange(metric)} 
                    className="form-checkbox bg-gray-300 border-gray-400"
                  />
                  <span className="text-gray-700 capitalize">{metric}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
