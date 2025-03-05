'use server'

import { cookies } from "next/headers";
import { PlantSchema } from "@/app/_lib/definitions"
import { redirect } from 'next/navigation';

export async function editPlant(Id, Name, SpeciesType, Moisture, Temperature, Ph, Device, PreviousDevice) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cookieStore = await cookies();
    const cookie = cookieStore.get("jwt")?.value

    const validateRes = PlantSchema.safeParse({
        name: Name,
        moisture: Moisture,
        temperature: Temperature,
        ph: Ph
    })

    if (!validateRes.success) {
        return false;
    }

    const getPlant = async () => {
        const response = await fetch(apiUrl + '/getPlantById', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, plantId: Id})
        })
        return await response.json();
    }

    const getDevice = async () => {
      const response = await fetch(apiUrl + '/getDeviceById', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({jwt: cookie, deviceId: Device})
      })
      return await response.json();
  }

    const getSpecies = async () => {
        const response = await fetch(apiUrl + '/getPlantInfoById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jwt: cookie,
                plantInfoId: SpeciesType
            })
        })
        const result = await response;
        if (result.ok) {
            return result.json();
        } else {
            return false;
        }
    }

    const editName = async () => {
        const response = await fetch(apiUrl + '/editPlantName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, plantId: Id, name: Name})
        })
        return await response;
    }

    const editSpecies = async () => {
        const response = await fetch(apiUrl + '/editPlantInfoId', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, plantId: Id, plantInfoId: SpeciesType})
        })
        return await response;
    }

    const editMoisture = async () => {
        const response = await fetch(apiUrl + '/editPlantMoisture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, plantId: Id, moisture: Moisture})
        })
        return await response;
    }

    const editTemperature = async () => {
        const response = await fetch(apiUrl + '/editPlantTemperature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, plantId: Id, temperature: Temperature})
        })
        return await response;
    }

    const editPh = async () => {
        const response = await fetch(apiUrl + '/editPlantPh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, plantId: Id, ph: Ph})
        })
        return await response;
    }

    const editDevice = async () => {
      const response = await fetch(apiUrl + '/changeDevicePlant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({jwt: cookie, deviceId: Device, userPlantId: Id})
      })
      return await response;
  }

    const plant = await getPlant();
    const species = await getSpecies();

    console.log(Device, PreviousDevice)

    if (Device !== "none" && Device !== PreviousDevice) {
      const device = await getDevice()
      if (device) {
        console.log(await editDevice())
      }
    } else if (Device == "none" && Device !== PreviousDevice) {
      await editDevice()
    }
     

    if (!species) {
        return false;
    }

    if (plant.Name !== Name) {
        await editName()
    }

    if (plant.PlantInfoId !== SpeciesType) {
        await editSpecies()
    }

    if (plant.Moisture !== Moisture) {
        await editMoisture()
    }


    if (plant.Temperature !== Temperature) {
        await editTemperature()
    }

    if (plant.Ph !== Ph) {
        await editPh();
    }

    if (plant.PlantInfoId !== species) {
        await editSpecies()
    }

    redirect('/plant/' + Id)
    
}