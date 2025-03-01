export default function SideBar() {
    return (
      <div className="h-screen w-64 bg-gray-900 text-white fixed top-0 left-0 flex flex-col p-4 shadow-lg">
      <img src="/logo.png" alt="Logo" className="w-24 h-24 mx-auto mb-6" />
      <nav className="flex flex-col space-y-4">
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Home</a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">About</a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Services</a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Contact</a>
      </nav>
    </div>
    );
  }
  