import { cookies } from 'next/headers';

import Sidebar from "@/components/sidebar";
import Plantitem from "@/components/plantItem";

export default async function PlantMain() {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt")?.value

  const getPlants = async () => {
    const response = await fetch(apiUrl + '/getUserPlants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({jwt: cookie})
    })
    return await response.json();
  }

  const plants = await getPlants()

    return (
        <div className="flex h-screen bg-gray-300">
        <Sidebar />
        
        <div className="ml-80 mt-8 flex-1 p-6">
          <div className="flex justify-left items-center mb-6">
            <h1 className="text-2xl font-bold">My Plants</h1>
            <a href="/plant/add"><button className="bg-green-600 text-white px-4 ml-8 py-2 rounded">+ Add</button></a>
          </div>

          {plants.map((plant) => (
            <Plantitem key={plant.Id} id={plant.Id} PlantTypeName={plant.Type} DeviceName={plant.Device} PlantName={plant.Name}/>
          ))}

        </div>
      </div>
    );
  }
  