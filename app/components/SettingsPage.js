"use client";
import { useState } from "react";

const SettingsPage = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Horse Management System",
    timezone: "UTC",
    language: "en",
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle settings update
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
        <p className="text-gray-600">
          Manage your system settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-medium mb-4">General Settings</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={generalSettings.siteName}
                onChange={(e) =>
                  setGeneralSettings({
                    ...generalSettings,
                    siteName: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={generalSettings.timezone}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      timezone: e.target.value,
                    })
                  }
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={generalSettings.language}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      language: e.target.value,
                    })
                  }
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  checked={generalSettings.emailNotifications}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      emailNotifications: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="emailNotifications"
                  className="ml-2 text-sm text-gray-700"
                >
                  Enable Email Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pushNotifications"
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  checked={generalSettings.pushNotifications}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      pushNotifications: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="pushNotifications"
                  className="ml-2 text-sm text-gray-700"
                >
                  Enable Push Notifications
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                Configure
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Session Management
                </h4>
                <p className="text-sm text-gray-500">
                  Manage your active sessions
                </p>
              </div>
              <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
                View Sessions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
