'use server'
import { cookies } from 'next/headers';

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