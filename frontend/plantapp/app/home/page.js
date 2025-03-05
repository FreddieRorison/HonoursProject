import { cookies } from 'next/headers';
import Sidebar from "@/components/sidebar";

export default async function PlantMain() {
  
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cookieStore = await cookies();
    const cookie = cookieStore.get("jwt")?.value
  
    const getFirstname = async () => {
      const response = await fetch(apiUrl + '/getFirstname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({jwt: cookie})
      })
      return await response.json();
    }

    const firstname = await getFirstname();

    return (
        <div className="flex h-screen bg-gray-300">
        <Sidebar />
        
        <div className="ml-80 mt-8 flex-1 p-6">
          <div className="flex justify-left items-center mb-6">
            <h1 className="text-2xl font-bold">Welcome, {firstname.firstname}!</h1>
          </div>

        </div>
      </div>
    );
  }
  