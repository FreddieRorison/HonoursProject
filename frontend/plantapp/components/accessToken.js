"use client"

import { useState } from "react";
import { regenrateToken } from "@/app/device/[DeviceId]/actions";

export default function accessToken({AccessToken, Id}) {
  const hiddenValue = "*******************"
  const [accessKey, setAccessKey] = useState(AccessToken);
  const [value, setValue] = useState(hiddenValue);
  const [revealed, setRevealed] = useState(false);
  const [ButtonText, setButtonText] = useState("Reveal")
  const [regenButton, setRegenButton] = useState("Regenerate")

  function toggleReveal() {
    if (revealed) {
      setRevealed(false);
      setValue(hiddenValue)
      setButtonText("Reveal")
    } else {
      setRevealed(true);
      setValue(accessKey)
      setButtonText("Hide")
    }
  }
  
   function regenerate() {
    setRegenButton("Regenerating...")
    regenrateToken(Id).then((result) => {
      if (revealed) {
        toggleReveal()
      }
      console.log(result)
      setAccessKey(result)
      setRegenButton("Regenerate")
    })
  }

    return (
        <div className="bg-white shadow-md p-4 rounded-lg max-w-md">
        <label className="block text-gray-700 font-semibold mb-2">Secret Token</label>
        <div className="flex items-center space-x-2 mb-4">
          <input 
            type="text" 
            value={value}
            id="token"
            readOnly 
            className="w-full p-2 border rounded bg-gray-300 text-gray-800" 
          />
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => regenerate()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            {regenButton}
          </button>
          <button 
            onClick={() => toggleReveal()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {ButtonText}
          </button>
        </div>
      </div>
    );
}

