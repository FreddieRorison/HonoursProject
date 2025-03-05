'use server'

import { cookies } from "next/headers";
import { PlantSchema } from "@/app/_lib/definitions"
import { redirect } from 'next/navigation';

export async function addPlant(Name, SpeciesType, Moisture, Temperature, Ph, Device) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cookieStore = await cookies();
    const cookie = cookieStore.get("jwt")?.value

    let deviceId = Device;

    const validateRes = PlantSchema.safeParse({
        name: Name,
        moisture: Moisture,
        temperature: Temperature,
        ph: Ph
    })

    if (!validateRes.success) {
        return false;
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

    const getDevice = async () => {
        const response = await fetch(apiUrl + '/getDeviceById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jwt: cookie,
                deviceId: Device
            })
        })
        const result = await response;
        if (result.ok) {
            return result.json();
        } else {
            return false;
        }
    }

    if (Device) {
        deviceId = await getDevice().Id;
    } else {
        deviceId = null;
    }

    console.log(Device)

    const speciesResult = await getSpecies();

    if (!speciesResult) {
        return false;
    }

    const addPlant = async () => {
        const response = await fetch(apiUrl + '/createPlant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            jwt: cookie,
            name: Name,
            plantInfoId: SpeciesType,
            moisture: Moisture,
            temperature: Temperature,
            ph: Ph,
            device: deviceId
        })
        })
        return await response.json();
    }

    const result = await addPlant();

    redirect("/plant/" + result.plantId)
}