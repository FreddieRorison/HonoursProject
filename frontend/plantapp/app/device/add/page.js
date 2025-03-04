"use client";

import SideBar from "@/components/sidebar";
import AddDeviceTile from "@/components/addDeviceTile";

export default function AddDevice() {
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <SideBar />

      <div className="flex-1 p-6 ml-80 mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Device</h1>
        
        <AddDeviceTile />
      </div>
    </div>
  );
}
