import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import SideBar from "@/components/sidebar";
import RemovePlant from "@/components/removePlant";
import NotificationHistoryTile from '@/components/notificationHistoryTile';

export default async function PlantDashboard({ params }) {
  const { PlantId } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt")?.value

  const getPlant = async () => {
      const response = await fetch(apiUrl + '/getPlantById', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({jwt: cookie, plantId: PlantId})
      })
      const result = await response;
      console.log(result.status)
      if (result.ok) {
        return await result.json();
      } else {
        return redirect('/plant')
      }
  }

  const plant = await getPlant();

  const getType = async () => {
    const response = await fetch(apiUrl + '/getPlantInfoById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({jwt: cookie, plantInfoId: plant.PlantInfoId})
    })
    return await response.json();
  } 

  
  const type = await getType();

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <SideBar />

      <div className="flex-1 p-6 ml-64">
        <div className="flex items-center justify-between ml-4 mb-16">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{plant.Name}</h1>
            <p className="text-gray-600">{type.CommonName}</p>
          </div>
          <div className="space-x-2">
            <a href={"/plant/"+plant.Id+"/edit"}><button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button></a>
            <RemovePlant Id={plant.Id}/>
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

        <NotificationHistoryTile Id={plant.Id} />
      </div>
    </div>
  );
}
