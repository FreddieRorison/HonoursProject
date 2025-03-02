"use client"

export default function accessToken({AccessToken}) {
    return (
        <div className="bg-white shadow-md p-4 rounded-lg max-w-md">
        <label className="block text-gray-700 font-semibold mb-2">Secret Token</label>
        <div className="flex items-center space-x-2 mb-4">
          <input 
            type="text" 
            value={AccessToken}
            id="token"
            readOnly 
            className="w-full p-2 border rounded bg-gray-300 text-gray-800" 
          />
        </div>
        <div className="flex space-x-2">
          <button 
            onClick="{regenrateToken}"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Regenerate
          </button>
          <button 
            onClick="{regenrateToken}"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Reveal
          </button>
        </div>
      </div>
    );
}

