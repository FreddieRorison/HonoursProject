'use server'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function deletePlant(Id) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt")?.value

  const DeletePlant = async () => {
    const response = await fetch(apiUrl + '/removePlant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({jwt: cookie, plantId: Id})
    })
    return response;
  }

  const result = await DeletePlant();
  console.log(result)

  redirect('/plant')
}