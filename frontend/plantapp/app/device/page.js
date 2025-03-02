import { cookies } from 'next/headers';

import Sidebar from "@/components/sidebar";
import Deviceitem from "@/components/deviceItem";

export default async function DeviceMain() {
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt")?.value

  const getDevices = async () => {
    const response = await fetch(apiUrl + '/getUserDevices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({jwt: cookie})
    })
    return await response.json();
    
  }

  const devices = await getDevices()

    return (
        <div className="flex h-screen bg-gray-300">
        <Sidebar />
        
        <div className="ml-80 mt-8 flex-1 p-6">
          <div className="flex justify-left items-center mb-6">
            <h1 className="text-2xl font-bold">My Devices</h1>
            <a href="/device/add"><button className="bg-green-600 text-white px-4 ml-8 py-2 rounded">+ Add</button></a>
          </div>

          {devices.map((device) => (
            <Deviceitem key={device.Id} id={device.Id} DeviceName={device.Name} LastOnline={device.LastOnline} ConnectedTo={device.ConnectedTo}/>
          ))}


        </div>
      </div>
    );
  }
  