'use server'

import { cookies } from "next/headers";
import { DeviceSchema } from "@/app/_lib/definitions"
import { redirect } from 'next/navigation';

export async function addDevice(Name, Description) {
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

    const addDevice = async () => {
        const response = await fetch(apiUrl + '/createDevice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, name: Name, description: Description})
        })
        return await response.json();
    }

    const result = await addDevice();

    redirect("/device/" + result.DeviceId)
}