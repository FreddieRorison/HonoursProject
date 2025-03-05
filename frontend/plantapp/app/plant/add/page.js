import { cookies } from 'next/headers';

import SideBar from "@/components/sidebar";
import AddPlantTile from "@/components/addPlantTile";

export default async function AddPlant() {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt")?.value

  const getTypes = async () => {
      const response = await fetch(apiUrl + '/getPlantTypes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({jwt: cookie})
      })
      return response.json();
    }

    const getDevices = async () => {
      const response = await fetch(apiUrl + '/getUnassignedUserDevices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({jwt: cookie})
      })
      const res = await response;
      if (res.ok) {
        return response.json();
      } else {
        return false;
      }
      
    }

  const types = await getTypes();

  const devices = await getDevices();

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <SideBar />

      <div className="flex-1 p-6 ml-80 mt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Plant</h1>
        <AddPlantTile Species={types} Devices={devices.devices} />
      </div>
    </div>
  );
}
