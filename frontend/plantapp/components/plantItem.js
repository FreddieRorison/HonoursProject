export default function plantItem({id, PlantName, DeviceName, PlantTypeName}) {

    return (
      <a href={"/plant/" + id}>
        <div className="max-w-xl mb-4 bg-green-950 text-white p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="font-semibold">{PlantName}</p>
          <p className="text-sm">Connected Device: <b>{DeviceName}</b></p>
          <p className="text-sm">Plant Type: <b>{PlantTypeName}</b></p>
        </div>
        <span className="w-4 h-4 bg-green-500 rounded-full"></span>
      </div>
      </a>
    );
}