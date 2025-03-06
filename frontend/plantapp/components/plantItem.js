import { cookies } from 'next/headers';

export default async function plantItem({id, PlantName, DeviceName, PlantTypeName}) {

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const cookieStore = await cookies();
      const cookie = cookieStore.get("jwt")?.value

      const trClass = "w-4 h-4 rounded-full ";
      const colourMap = {
        1: trClass + "bg-green-400",
        2: trClass + "bg-yellow-400",
        3: trClass + "bg-red-400"
      }
    
      const getStatus = async () => {
        const response = await fetch(apiUrl + '/getPlantStatus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, plantId: id})
        })
        return await response.json();
      }

      const status = await getStatus();

    return (
      <a href={"/plant/" + id}>
        <div className="max-w-xl mb-4 bg-green-950 text-white p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="font-semibold">{PlantName}</p>
          <p className="text-sm">Connected Device: <b>{DeviceName}</b></p>
          <p className="text-sm">Plant Type: <b>{PlantTypeName}</b></p>
        </div>
        <span className={`${colourMap[status.currentStatus]}`}></span>
      </div>
      </a>
    );
}