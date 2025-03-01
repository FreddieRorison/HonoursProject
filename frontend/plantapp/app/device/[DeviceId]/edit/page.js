"use client";

import SideBar from "@/components/sidebar";

export default function EditDevice() {
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <SideBar />

      <div className="flex-1 p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Device</h1>
        
        <div className="bg-white shadow-md p-6 rounded-lg max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded bg-gray-300" 
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea 
              className="w-full p-2 border rounded bg-gray-300 h-24"
            ></textarea>
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
