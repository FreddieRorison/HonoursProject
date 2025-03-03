"use client";
import { useState } from "react";
import { editDevice } from "@/app/device/[DeviceId]/edit/actions";

export default function Editdevice({Id, Description, Name}) {
    const [name, setName] = useState(Name);
    const [description, setDescription] = useState(Description)
    const [buttonText, setbuttonText] = useState("Update")
    const [disabled, setDisabled] = useState(false)

    function toggleEnabled() {
        if (disabled) {
            setbuttonText("Update")
            setDisabled(false)
        } else {
            setbuttonText("Updating")
            setDisabled(true)
        }
    }
    
    function submit() {
        toggleEnabled()
        editDevice(Id, name, description)
    }

    return (
        <div className="bg-white shadow-md p-6 rounded-lg max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded bg-gray-300"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea 
              className="w-full p-2 border rounded bg-gray-300 h-24"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            ></textarea>
          </div>

          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={disabled} onClick={() => submit()}>
            {buttonText}
          </button>
        </div>
    )
}