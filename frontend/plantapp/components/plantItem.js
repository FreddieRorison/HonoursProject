export default function plantItem() {
    return (
        <div className="max-w-xl mb-4 bg-green-950 text-white p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="font-semibold">Plant Name</p>
          <p className="text-sm">Device Name</p>
          <p className="text-sm">Plant Type</p>
        </div>
        <span className="w-4 h-4 bg-green-500 rounded-full"></span>
      </div>
    );
    }