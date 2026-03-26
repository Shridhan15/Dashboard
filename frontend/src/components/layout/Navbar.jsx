import { Bell, Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search companies or roles..."
          className="bg-transparent border-none outline-none text-sm w-full"
        />
      </div>
      <div className="flex items-center gap-4 text-gray-500">
        <button className="hover:text-gray-700 transition">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}
