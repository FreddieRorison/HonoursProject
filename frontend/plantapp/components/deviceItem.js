export default function deviceItem() {
    return (
        <div className="max-w-xl mb-4 bg-green-950 text-white p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="font-semibold">Device Name</p>
          <p className="text-sm">Last Online</p>
          <p className="text-sm">Connected To</p>
        </div>
      </div>
    );
}