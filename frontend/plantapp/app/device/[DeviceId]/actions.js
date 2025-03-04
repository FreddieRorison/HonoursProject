'use server'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function regenrateToken(data) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cookieStore = await cookies();
    const cookie = cookieStore.get("jwt")?.value
    
    const generateNewToken = async () => {
        const response = await fetch(apiUrl + '/generateNewDeviceToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({jwt: cookie, deviceId: data})
        })
        return await response.json();
      }

    const result = await generateNewToken()

    return result.accessKey;
}

export async function deleteDevice(Id) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt")?.value

  const deleteDevice = async () => {
    const response = await fetch(apiUrl + '/removeDevice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({jwt: cookie, deviceId: Id})
    })
    return response.ok;
  }

  const result = await deleteDevice();

  redirect('/device')
}