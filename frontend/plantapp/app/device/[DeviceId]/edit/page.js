import SideBar from "@/components/sidebar";
import Editdevice from "@/components/editDevice";
import { cookies } from 'next/headers';

export default async function EditDevice({ params }) {
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
      return await response.json();
    }
  
    const device = await getDevice();

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <SideBar />

      <div className="flex-1 p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Device</h1>
        
        <Editdevice Description={device.Description} Name={device.Name} Id={device.Id} />
      </div>
    </div>
  );
}
