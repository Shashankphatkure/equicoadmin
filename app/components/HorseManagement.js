"use client";
import { useState } from "react";
import Modal from "./ui/Modal";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

const HorseManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHorse, setEditingHorse] = useState(null);

  // Dummy data - replace with actual API call
  const [horses] = useState([
    {
      id: 1,
      name: "Thunder",
      breed: "Arabian",
      age: 5,
      owner: "John Doe",
      status: "healthy",
    },
    {
      id: 2,
      name: "Storm",
      breed: "Thoroughbred",
      age: 7,
      owner: "Jane Smith",
      status: "training",
    },
    {
      id: 3,
      name: "Spirit",
      breed: "Mustang",
      age: 4,
      owner: "Bob Wilson",
      status: "resting",
    },
  ]);

  const handleEdit = (horse) => {
    setEditingHorse(horse);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setEditingHorse(null);
  };

  const filteredHorses = horses.filter(
    (horse) =>
      horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "training":
        return "bg-blue-100 text-blue-800";
      case "resting":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Horse Management
        </h2>
        <p className="text-gray-600">Manage your horses and their details</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Total Horses</div>
          <div className="text-2xl font-bold text-gray-800">
            {horses.length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Healthy</div>
          <div className="text-2xl font-bold text-gray-800">
            {horses.filter((h) => h.status === "healthy").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">In Training</div>
          <div className="text-2xl font-bold text-gray-800">
            {horses.filter((h) => h.status === "training").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Average Age</div>
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(
              horses.reduce((acc, h) => acc + h.age, 0) / horses.length
            )}
          </div>
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search horses..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add New Horse</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-100">
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  ID
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Breed
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Age
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Owner
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHorses.map((horse) => (
                <tr key={horse.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-600">{horse.id}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium mr-3">
                        {horse.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {horse.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {horse.breed}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{horse.breed}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {horse.age} years
                  </td>
                  <td className="p-4 text-sm text-gray-600">{horse.owner}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        horse.status
                      )}`}
                    >
                      {horse.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(horse)}
                        className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button className="text-sm px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHorse(null);
        }}
        title={editingHorse ? "Edit Horse" : "Add New Horse"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingHorse?.name}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Breed
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingHorse?.breed}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingHorse?.age}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingHorse?.owner}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingHorse?.status}
              required
            >
              <option value="healthy">Healthy</option>
              <option value="training">Training</option>
              <option value="resting">Resting</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {editingHorse ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HorseManagement;
