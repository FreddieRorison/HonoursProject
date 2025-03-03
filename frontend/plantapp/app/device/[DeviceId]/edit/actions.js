'use server'

import { cookies } from "next/headers";
import { DeviceSchema } from "@/app/_lib/definitions"
import { redirect } from 'next/navigation';

export async function editDevice(Id, Name, Description) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cookieStore = await cookies();
    const cookie = cookieStore.get("jwt")?.value

    const validateRes = DeviceSchema.safeParse({
        name: Name,
        description: Description
    })
    
    if (!validateRes.success) {
        return false;
    }

    const getDevice = async () => {
        const response = await fetch(apiUrl + '/getDeviceById', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, deviceId: Id})
        })
        return await response.json();
    }
    
    const editName = async () => {
        const response = await fetch(apiUrl + '/editDeviceName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, deviceId: Id, name: Name})
        })
        return await response;
    }

    const editDescription = async () => {
        const response = await fetch(apiUrl + '/editDeviceDescription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, deviceId: Id, description: Description})
        })
        return await response;
    }

    const device = await getDevice()

    if (device.Name !== Name) {
        console.log( await editName())
    }

    if (device.Description !== Description) {
        console.log(await editDescription())
    }

   redirect('/device/' + Id)
}