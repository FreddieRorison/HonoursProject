import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import SideBar from "@/components/sidebar";
import RemovePlant from "@/components/removePlant";
import NotificationHistoryTile from '@/components/notificationHistoryTile';
import Chart from '@/components/chart';

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

  const getMoistureData = async () => {
    const response = await fetch(apiUrl + '/getPlantMoistureData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({jwt: cookie, plantId: plant.Id})
    })
    return await response.json();
  }

  const getTemperatureData = async () => {
    const response = await fetch(apiUrl + '/getPlantTemperatureData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({jwt: cookie, plantId: plant.Id})
    })
    return await response.json();
  }

  const getPhData = async () => {
    const response = await fetch(apiUrl + '/getPlantPhData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({jwt: cookie, plantId: plant.Id})
    })
    return await response.json();
  }

  const moistureData = await getMoistureData()
  const temperatureData = await getTemperatureData()
  const phData = await getPhData()

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
          {plant.Moisture && (<Chart title={"Moisture Graph"} label={"Moisture (%)"} data={moistureData.Data} limits={[]}/>)}

          {plant.Temperature && (<Chart title={"Temperature Graph"} label={"Temperature (C)"} data={temperatureData.Data} limits={[type.MinTemp]}/>)}

          {plant.Ph == 1 && (<Chart title={"Ph Graph"} label={"Ph Level"} data={phData.Data} limits={[type.MaxPh, type.MinPh]}/>)}

        </div>

        <NotificationHistoryTile Id={plant.Id} />
      </div>
    </div>
  );
}
