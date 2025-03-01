import Sidebar from "@/components/sidebar";
import Deviceitem from "@/components/deviceItem";

export default function DeviceMain() {
  
  

    return (
        <div className="flex h-screen bg-gray-300">
        <Sidebar />
        
        <div className="ml-80 mt-8 flex-1 p-6">
          <div className="flex justify-left items-center mb-6">
            <h1 className="text-2xl font-bold">My Devices</h1>
            <a href="/device/add"><button className="bg-green-600 text-white px-4 ml-8 py-2 rounded">+ Add</button></a>
          </div>

          <a href="/device/1"><Deviceitem /></a>
          <Deviceitem />
          <Deviceitem />
          <Deviceitem />

        </div>
      </div>
    );
  }
  