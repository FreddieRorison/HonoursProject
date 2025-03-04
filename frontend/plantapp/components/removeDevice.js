"use client"

import { deleteDevice } from "@/app/device/[DeviceId]/actions";

export default function removeDevice({Id}) {

    return (
      <button onClick={() => deleteDevice(Id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Remove</button>
    );
}