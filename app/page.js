"use client";
import { useState } from "react";
import UserManagement from "./components/UserManagement";
import HorseManagement from "./components/HorseManagement";
import EventManagement from "./components/EventManagement";
import ProductManagement from "./components/ProductManagement";
import SellerManagement from "./components/SellerManagement";
import NotificationManagement from "./components/NotificationManagement";
import OrderManagement from "./components/OrderManagement";
import PostManagement from "./components/PostManagement";
import Sidebar from "./components/ui/Sidebar";
import Dropdown from "./components/ui/Dropdown";
import {
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import SettingsPage from "./components/SettingsPage";
import ProfilePage from "./components/ProfilePage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagement />;
      case "horses":
        return <HorseManagement />;
      case "events":
        return <EventManagement />;
      case "products":
        return <ProductManagement />;
      case "sellers":
        return <SellerManagement />;
      case "notifications":
        return <NotificationManagement />;
      case "orders":
        return <OrderManagement />;
      case "posts":
        return <PostManagement />;
      case "settings":
        return <SettingsPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
              </button>
              <Dropdown
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
              >
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    setIsSettingsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  General Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                  Security Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
                  System Preferences
                </button>
              </Dropdown>
            </div>

            <div className="relative border-l pl-4">
              <button
                className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-1"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <UserCircleIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">
                    Admin
                  </span>
                  <span className="text-xs text-gray-500">
                    admin@example.com
                  </span>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </button>
              <Dropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">Signed in as</p>
                  <p className="text-sm text-gray-500">admin@example.com</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  Your Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center text-red-600">
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </Dropdown>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="bg-white rounded-lg shadow">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
