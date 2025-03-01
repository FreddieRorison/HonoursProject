"use client";

import SideBar from "@/components/sidebar";

export default function AddDevice() {
  return (
    <div className="flex bg-gray-200 min-h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 p-6 ml-80 mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Device</h1>
        
        <div className="bg-white shadow-md p-6 rounded-lg max-w-lg">
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded bg-gray-300" 
            />
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea 
              className="w-full p-2 border rounded bg-gray-300 h-24"
            ></textarea>
          </div>

          {/* Create Button */}
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
