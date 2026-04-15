import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/report", label: "Report", icon: "📝" },
    { path: "/map", label: "Map", icon: "🗺️" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/admin", label: "Admin", icon: "⚙️" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-3 max-w-screen-lg mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition duration-200 ${
              isActive(item.path)
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}