import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SideBar from "@/components/sidebar";
import Accesstoken from "@/components/accessToken";
import RemoveDevice from '@/components/removeDevice';

export default async function DeviceDashboard({params}) {
  const { DeviceId } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt")?.value

  const getDevice = async () => {
    const response = await fetch(apiUrl + '/getDeviceById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({jwt: cookie, deviceId: DeviceId})
    })
    const result = await response;
    if (result.ok) {
      return await result.json();
    } else {
      return redirect('/device')
    }
  }

  const device = await getDevice();

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <SideBar />

      <div className="flex-1 p-6 ml-64">
        <div className="flex items-center justify-between p-4 rounded-lg mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{device.Name}</h1>
            <p className="text-gray-600">{device.Description}</p>
          </div>
          <div className="space-x-2">
            <a href={"/device/"+device.Id+"/edit"}><button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button></a>
            <RemoveDevice Id={device.Id} />
          </div>
        </div>
        <Accesstoken AccessToken={device.AccessKey} Id={device.Id} />
      </div>
    </div>
  );
}
