"use client";
import { useState } from "react";
import Modal from "./ui/Modal";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

const SellerManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSeller, setEditingSeller] = useState(null);

  // Dummy data - replace with actual API call
  const [sellers] = useState([
    {
      id: 1,
      businessName: "Horse Equipment Pro",
      contactPerson: "Jane Smith",
      email: "jane@horseequip.com",
      phone: "+1 234-567-8900",
      status: "active",
      productsCount: 45,
      totalSales: 125000,
    },
    {
      id: 2,
      businessName: "Pet Nutrition Co",
      contactPerson: "Mike Johnson",
      email: "mike@petnutrition.com",
      phone: "+1 234-567-8901",
      status: "pending",
      productsCount: 28,
      totalSales: 75000,
    },
    {
      id: 3,
      businessName: "Safety First Ltd",
      contactPerson: "Sarah Wilson",
      email: "sarah@safetyfirst.com",
      phone: "+1 234-567-8902",
      status: "inactive",
      productsCount: 15,
      totalSales: 45000,
    },
  ]);

  const handleEdit = (seller) => {
    setEditingSeller(seller);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setEditingSeller(null);
  };

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Seller Management
        </h2>
        <p className="text-gray-600">
          Manage your marketplace sellers and their accounts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Total Sellers</div>
          <div className="text-2xl font-bold text-gray-800">
            {sellers.length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Active Sellers</div>
          <div className="text-2xl font-bold text-gray-800">
            {sellers.filter((s) => s.status === "active").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Total Products</div>
          <div className="text-2xl font-bold text-gray-800">
            {sellers.reduce((acc, s) => acc + s.productsCount, 0)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Total Sales</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatCurrency(sellers.reduce((acc, s) => acc + s.totalSales, 0))}
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
              placeholder="Search sellers..."
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
            <span>Add New Seller</span>
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
                  Business
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Contact
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Products
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Sales
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
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-600">{seller.id}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium mr-3">
                        {seller.businessName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {seller.businessName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {seller.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800">
                      {seller.contactPerson}
                    </div>
                    <div className="text-xs text-gray-500">{seller.phone}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {seller.productsCount}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-800">
                    {formatCurrency(seller.totalSales)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        seller.status
                      )}`}
                    >
                      {seller.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(seller)}
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
          setEditingSeller(null);
        }}
        title={editingSeller ? "Edit Seller" : "Add New Seller"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingSeller?.businessName}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingSeller?.contactPerson}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingSeller?.phone}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingSeller?.email}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingSeller?.status}
              required
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
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
              {editingSeller ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SellerManagement;
