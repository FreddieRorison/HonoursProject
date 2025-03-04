"use client"

import { deletePlant } from "@/app/plant/[PlantId]/actions";

export default function removePlant({Id}) {

    return (
      <button onClick={() => deletePlant(Id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Remove</button>
    );
  }