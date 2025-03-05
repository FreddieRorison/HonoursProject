export default function deviceItem({id, DeviceName, LastOnline, ConnectedTo}) {
    return (
      <a href={"/device/"+id}>
        <div className="max-w-xl mb-4 bg-green-950 text-white p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="font-semibold">{DeviceName}</p>
          <p className="text-sm">Last Online: <b>{LastOnline}</b></p>
        </div>
      </div>
      </a>
    );
}