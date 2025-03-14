export default function SideBar() {
    return (
      <div className="h-screen w-64 bg-green-900 text-white fixed top-0 left-0 flex flex-col p-4 shadow-lg">
      <img src="/logo.png" alt="Logo" className="w-24 h-24 mx-auto mb-6" />
      <nav className="flex flex-col space-y-4">
        <a href="/home" className="hover:bg-green-700 p-2 rounded">Home</a>
        <a href="/plant" className="hover:bg-green-700 p-2 rounded">My Plants</a>
        <a href="/device" className="hover:bg-green-700 p-2 rounded">My Devices</a>
      </nav>
    </div>
    );
  }
  