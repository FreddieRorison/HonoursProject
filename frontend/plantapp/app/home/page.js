import Sidebar from "@/components/sidebar";

export default function PlantMain() {
  

    return (
        <div className="flex h-screen bg-gray-300">
        <Sidebar />
        
        <div className="ml-80 mt-8 flex-1 p-6">
          <div className="flex justify-left items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome, Firstname!</h1>
          </div>

        </div>
      </div>
    );
  }
  