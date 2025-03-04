import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import SideBar from "@/components/sidebar";
import EditPlantTile from '@/components/editPlantTile';


export default async function EditPlant({ params }) {
  const { PlantId } = await params;

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

  const getPlant = async () => {
    const response = await fetch(apiUrl + '/getPlantById', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({jwt: cookie, plantId: PlantId})
    })
    if (response.ok) {
      return response.json();
    } else {
      redirect('/plant');
    }
  }
  
  const types = await getTypes();
  
  const plant = await getPlant();

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <SideBar />

      <div className="flex-1 p-6 ml-64">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Plant</h1>
        
        <EditPlantTile Id={plant.Id} Name={plant.Name} Moisture={plant.Moisture} Temperature={plant.Temperature} Ph={plant.Ph} Species={types} SelectedSpecies={plant.PlantInfoId} />
      </div>
    </div>
  );
}
