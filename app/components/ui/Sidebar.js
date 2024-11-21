"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  UserIcon,
  BellIcon,
  ShoppingBagIcon,
  CalendarIcon,
  UsersIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const menuItems = [
    { id: "users", label: "Users", icon: UserIcon },
    { id: "horses", label: "Horses", icon: UsersIcon },
    { id: "events", label: "Events", icon: CalendarIcon },
    { id: "products", label: "Products", icon: ShoppingBagIcon },
    { id: "orders", label: "Orders", icon: ShoppingCartIcon },
    { id: "posts", label: "Posts", icon: DocumentTextIcon },
    { id: "sellers", label: "Sellers", icon: UsersIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
  ];

  return (
    <div
      className={`bg-white h-screen shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } fixed left-0 top-0 flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-gray-800">Equico</h1>
        )}
      </div>

      <nav className="p-2 flex-grow">
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

      {user && (
        <div className="p-2 border-t">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2 p-3 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
