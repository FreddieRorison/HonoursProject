"use client";
import { useState } from "react";
import { addPlant } from "@/app/plant/add/actions";

export default function EditPlantTile({ Name, Species, SelectedSpecies, Moisture, Temperature, Ph }) {
    const [name, setName] = useState(Name);
    const [species, setSpecies] = useState(SelectedSpecies);
    const [moisture, setMoisture] = useState(Moisture);
    const [temperature, setTemperature] = useState(Temperature);
    const [ph, setPh] = useState(Ph);

    const [disabled, setDisabled] = useState(false)
    const [buttonText, setbuttonText] = useState("Create")

    function toggleEnabled() {
        if (disabled) {
            setbuttonText("Create")
            setDisabled(false)
        } else {
            setbuttonText("Creating...")
            setDisabled(true)
        }
    }
    
    function submit() {
        toggleEnabled()
        console.log(species)
        addPlant(name, species, moisture, temperature, ph)
    }

    return (
        <div className="bg-white shadow-md p-6 rounded-lg max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input 
              type="text" 
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)} 
              className="w-full p-2 border rounded bg-gray-300" 
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Plant Species</label>
            <select 
              value={species} 
              onChange={(e) => setSpecies(e.target.value)} 
              className="w-full p-2 border rounded bg-gray-300"
            >
                {Species.map((type, i) => (
                    <option key={i} value={type.Id}>{type.CommonName}</option>
                ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Tracked Metrics</label>
            <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={moisture} 
                    onChange={(event) => setMoisture(event.target.checked)} 
                    className="form-checkbox bg-gray-300 border-gray-400"
                  />
                  <span className="text-gray-700 capitalize">Moisture</span>
                </label>
            </div>
            <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={temperature} 
                    onChange={(event) => setTemperature(event.target.checked)} 
                    className="form-checkbox bg-gray-300 border-gray-400"
                  />
                  <span className="text-gray-700 capitalize">Temperature</span>
                </label>
            </div>
            <div className="flex flex-col space-y-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={ph} 
                    onChange={(event) => setPh(event.target.checked)} 
                    className="form-checkbox bg-gray-300 border-gray-400"
                  />
                  <span className="text-gray-700 capitalize">Ph</span>
                </label>
            </div>
          </div>
          

          <button disabled={disabled} onClick={() => submit()}className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {buttonText}
          </button>
        </div>
    )
}