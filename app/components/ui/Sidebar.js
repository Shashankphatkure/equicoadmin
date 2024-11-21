"use client";
import { useState } from "react";
import {
  UserIcon,
  BellIcon,
  ShoppingBagIcon,
  CalendarIcon,
  UsersIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "users", label: "Users", icon: UserIcon },
    { id: "horses", label: "Horses", icon: UsersIcon },
    { id: "events", label: "Events", icon: CalendarIcon },
    { id: "products", label: "Products", icon: ShoppingBagIcon },
    { id: "sellers", label: "Sellers", icon: UsersIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
  ];

  return (
    <div
      className={`bg-white h-screen shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } fixed left-0 top-0`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        )}
      </div>

      <nav className="p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-2 p-3 rounded-lg mb-1 transition-colors ${
              activeTab === item.id
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-6 h-6" />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
