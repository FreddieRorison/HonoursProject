import Sidebar from "@/components/sidebar";
import Plantitem from "@/components/plantItem";

export default function DeviceMain() {
  
  

    return (
        <div className="flex h-screen bg-gray-300">
        <Sidebar />
        
        <div className="ml-80 mt-8 flex-1 p-6">
          <div className="flex justify-left items-center mb-6">
            <h1 className="text-2xl font-bold">My Plants</h1>
            <button className="bg-green-600 text-white px-4 ml-8 py-2 rounded">+ Add</button>
          </div>
          <Plantitem />
          <Plantitem />
          <Plantitem />
          <Plantitem />
        </div>
      </div>
    );
  }
  