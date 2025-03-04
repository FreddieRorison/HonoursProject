'use server'

import { cookies } from "next/headers";
import { PlantSchema } from "@/app/_lib/definitions"
import { redirect } from 'next/navigation';

export async function editPlant(Name, SpeciesType, Moisture, Temperature, Ph) {
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

    
}