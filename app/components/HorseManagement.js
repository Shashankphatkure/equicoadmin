"use client";
import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";

const HorseManagement = () => {
  const supabase = createClientComponentClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHorse, setEditingHorse] = useState(null);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHorses();
  }, []);

  const fetchHorses = async () => {
    try {
      const { data, error } = await supabase
        .from("horses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHorses(data || []);
    } catch (error) {
      toast.error("Error loading horses: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const horseData = {
      name: formData.get("name"),
      registered_name: formData.get("registered_name"),
      breed: formData.get("breed"),
      age: parseInt(formData.get("age")),
      gender: formData.get("gender"),
      color: formData.get("color"),
      weight: formData.get("weight"),
      height: formData.get("height"),
      status: [formData.get("status")],
      next_vet: formData.get("next_vet"),
      next_shoe: formData.get("next_shoe"),
      ueln: formData.get("ueln"),
      identification_details: {
        chip_number: formData.get("chip_number"),
        passport_number: formData.get("passport_number"),
      },
      diet: {
        feed_type: formData.get("feed_type"),
        supplements: formData.get("supplements"),
      },
    };

    try {
      if (editingHorse) {
        const { error } = await supabase
          .from("horses")
          .update(horseData)
          .eq("id", editingHorse.id);

        if (error) throw error;
        toast.success("Horse updated successfully");
      } else {
        const { error } = await supabase.from("horses").insert([horseData]);

        if (error) throw error;
        toast.success("Horse created successfully");
      }

      fetchHorses();
      setIsModalOpen(false);
      setEditingHorse(null);
    } catch (error) {
      toast.error(
        editingHorse ? "Error updating horse" : "Error creating horse"
      );
    }
  };

  const handleDelete = async (horseId) => {
    if (!confirm("Are you sure you want to delete this horse?")) return;

    try {
      const { error } = await supabase
        .from("horses")
        .delete()
        .eq("id", horseId);

      if (error) throw error;
      toast.success("Horse deleted successfully");
      fetchHorses();
    } catch (error) {
      toast.error("Error deleting horse: " + error.message);
    }
  };

  const filteredHorses = horses.filter(
    (horse) =>
      horse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      horse.breed?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const mainStatus = Array.isArray(status) ? status[0] : status;
    switch (mainStatus?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "resting":
        return "bg-yellow-100 text-yellow-800";
      case "injured":
        return "bg-red-100 text-red-800";
      case "training":
        return "bg-blue-100 text-blue-800";
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
            {horses.length || 0}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Active</div>
          <div className="text-2xl font-bold text-gray-800">
            {horses.filter((h) => h.status?.includes("Active")).length || 0}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">In Training</div>
          <div className="text-2xl font-bold text-gray-800">
            {horses.filter((h) => h.status?.includes("Training")).length || 0}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Average Age</div>
          <div className="text-2xl font-bold text-gray-800">
            {horses.length > 0
              ? Math.round(
                  horses.reduce((acc, h) => acc + (h.age || 0), 0) /
                    horses.length
                )
              : 0}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.name}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registered Name
              </label>
              <input
                name="registered_name"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.registered_name}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breed
              </label>
              <input
                name="breed"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.breed}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                name="color"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.color}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                name="age"
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.age}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.gender}
                required
              >
                <option value="Mare">Mare</option>
                <option value="Stallion">Stallion</option>
                <option value="Gelding">Gelding</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.status?.[0]}
                required
              >
                <option value="Active">Active</option>
                <option value="Resting">Resting</option>
                <option value="Training">Training</option>
                <option value="Injured">Injured</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Vet Visit
              </label>
              <input
                name="next_vet"
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.next_vet}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Shoeing
              </label>
              <input
                name="next_shoe"
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.next_shoe}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height
              </label>
              <input
                name="height"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.height}
                placeholder="e.g., 16.2 hands"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <input
                name="weight"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingHorse?.weight}
                placeholder="e.g., 1200 lbs"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UELN
            </label>
            <input
              name="ueln"
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingHorse?.ueln}
              maxLength={15}
            />
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
