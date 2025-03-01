import SideBar from "@/components/sidebar";

export default function PlantDashboard() {
  return (
    <div className="flex bg-gray-200 min-h-screen">
      <SideBar />

      <div className="flex-1 p-6 ml-64">
        <div className="flex items-center justify-between ml-4 mb-16">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Plant Name</h1>
            <p className="text-gray-600">Plant Type</p>
          </div>
          <div className="space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Remove</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow-md p-4 rounded-lg h-48 flex items-center justify-center">
            <span className="text-gray-600">Moisture Graph Placeholder</span>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg h-48 flex items-center justify-center">
            <span className="text-gray-600">Temperature Graph Placeholder</span>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg h-48 flex items-center justify-center">
            <span className="text-gray-600">pH Graph Placeholder</span>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification History</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-green-900 text-white">
                <tr>
                  <th className="text-left p-3">Date & Time</th>
                  <th className="text-left p-3">Recommendation</th>
                  <th className="text-left p-3">Resolved?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-300 bg-green-100">
                  <td className="p-3 text-gray-800">2025-03-01 12:30 PM</td>
                  <td className="p-3 text-gray-800">Water the plant</td>
                  <td className="p-3 text-gray-800">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
