"use client";
import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";

const OrderManagement = () => {
  const supabase = createClientComponentClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast.error("Error loading orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const orderData = {
        user_id: user.id,
        status: formData.get("status"),
        shipping_address: {
          street: formData.get("street"),
          city: formData.get("city"),
          state: formData.get("state"),
          postal_code: formData.get("postal_code"),
          country: formData.get("country"),
        },
        shipping_method: {
          carrier: formData.get("shipping_carrier"),
          method: formData.get("shipping_method"),
          tracking_number: formData.get("tracking_number"),
        },
        payment_method: formData.get("payment_method"),
        items: [], // This should be populated with actual order items
        subtotal: parseFloat(formData.get("subtotal")),
        shipping_cost: parseFloat(formData.get("shipping_cost")),
        tax: parseFloat(formData.get("tax")),
        total: parseFloat(formData.get("total")),
      };

      if (editingOrder) {
        const { error } = await supabase
          .from("orders")
          .update(orderData)
          .eq("id", editingOrder.id)
          .eq("user_id", user.id); // Security check

        if (error) throw error;
        toast.success("Order updated successfully");
      } else {
        const { error } = await supabase.from("orders").insert([orderData]);

        if (error) throw error;
        toast.success("Order created successfully");
      }

      fetchOrders();
      setIsModalOpen(false);
      setEditingOrder(null);
    } catch (error) {
      toast.error(
        `Error ${editingOrder ? "updating" : "creating"} order: ${
          error.message
        }`
      );
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId)
        .eq("user_id", user.id); // Security check

      if (error) throw error;
      toast.success("Order deleted successfully");
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      toast.error("Error deleting order: " + error.message);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Order Management
        </h2>
        <p className="text-gray-600">Manage your customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Total Orders</div>
          <div className="text-2xl font-bold text-gray-800">
            {orders.length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Pending Orders</div>
          <div className="text-2xl font-bold text-gray-800">
            {orders.filter((o) => o.status === "pending").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatPrice(
              orders.reduce((acc, o) => acc + (o.total_amount || 0), 0)
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Average Order Value</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatPrice(
              orders.length
                ? orders.reduce((acc, o) => acc + (o.total_amount || 0), 0) /
                    orders.length
                : 0
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
              placeholder="Search orders..."
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
            <span>Add New Order</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-100">
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Order Info
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Customer
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Payment
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="text-sm font-medium text-gray-800">
                      #{order.order_number}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800">
                      {order.customer_name}
                    </div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-800">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-sm px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                      >
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

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
        }}
        title={editingOrder ? "Edit Order" : "Add New Order"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingOrder?.status || "pending"}
              required
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtotal
              </label>
              <input
                name="subtotal"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingOrder?.subtotal}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Cost
              </label>
              <input
                name="shipping_cost"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingOrder?.shipping_cost}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax
              </label>
              <input
                name="tax"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingOrder?.tax}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total
              </label>
              <input
                name="total"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingOrder?.total}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              name="payment_method"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingOrder?.payment_method}
              required
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street
                </label>
                <input
                  name="street"
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={editingOrder?.shipping_address?.street}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  name="city"
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={editingOrder?.shipping_address?.city}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  name="state"
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={editingOrder?.shipping_address?.state}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  name="postal_code"
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={editingOrder?.shipping_address?.postal_code}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  name="country"
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={editingOrder?.shipping_address?.country}
                  required
                />
              </div>
            </div>
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
              {editingOrder ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrderManagement;
