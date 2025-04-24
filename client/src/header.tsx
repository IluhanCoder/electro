import { observer } from "mobx-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import authStore from "./auth/auth-store";
import authService from "./auth/auth-service";

const Header = observer(() => {
  const user = authStore.user;
  const location = useLocation();
  const navigate = useNavigate();
  const [showAnalytics, setShowAnalytics] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  if (!user || ["/", "/registration", "/login"].includes(location.pathname)) return null;

  const menuItems: { label: string; to: string; roles: string[] }[] = [
    { label: "Дані", to: "/data", roles: ["user", "admin"] },
    { label: "Обʼєкти", to: "/objects", roles: ["user", "admin"] },
    { label: "Лічильник", to: "/generation", roles: ["user"] },
    { label: "Поради", to: "/tips", roles: ["user"] },
    { label: "Лічильники", to: "/counter", roles: ["service"] },
    { label: "Сповіщення", to: "/notifications", roles: ["user"] },
    { label: "Профіль", to: "/profile", roles: ["user"] },
  ];

  const analyticsDropdown = (user.role === "admin") ? [
    { label: "Загальна аналітика", to: "/analytics" },
    { label: "Середні значення", to: "/average-analytics" },
    { label: "Категоризовані витрати", to: "/categorised-amount-analytics" },
  ] : [
    { label: "Загальна аналітика", to: "/analytics" },
    { label: "Середні значення", to: "/average-analytics" },
    { label: "Категоризовані витрати", to: "/categorised-amount-analytics" },
    { label: "Реальний час", to: "/realtime" },
    { label: "Теплокарта", to: "/heatmap" },
    { label: "Регресія", to: "/regression" },
  ];

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <div className="flex w-full justify-between items-center px-6 py-3 bg-white border-b shadow-sm">
      <div className="text-lg font-semibold">Програма</div>

      <div className="flex items-center gap-6">
        {menuItems
          .filter((item) => item.roles.includes(user.role))
          .map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`hover:underline ${
                isActive(item.to) ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}

        {(user.role === "user" || user.role === "admin") && (
          <div className="relative">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-1 hover:underline"
            >
              Аналітика
              <ChevronDown size={16} />
            </button>

            {showAnalytics && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-10"
                onMouseLeave={() => setShowAnalytics(false)}
              >
                {analyticsDropdown.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-gray-700 font-medium">
        <div>{user.nickname}</div>
        <button
          onClick={handleLogout}
          title="Вийти"
          className="text-red-600 hover:text-red-800"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
});

export default Header;
