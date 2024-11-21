"use client";
import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";

const ProductManagement = () => {
  const supabase = createClientComponentClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.error("Error loading products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const productData = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
      sub_category: formData.get("sub_category"),
      description: formData.get("description"),
      quantity: parseInt(formData.get("quantity")),
      status: formData.get("status"),
      specifications: {
        size: formData.get("size"),
        material: formData.get("material"),
        weight: formData.get("weight"),
      },
      seller_info: {
        name: formData.get("seller_name"),
        verified: false,
      },
      shipping_info: {
        free: formData.get("free_shipping") === "true",
        methods: ["Standard"],
      },
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([productData]);

        if (error) throw error;
        toast.success("Product created successfully");
      }

      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error(
        editingProduct ? "Error updating product" : "Error creating product"
      );
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product: " + error.message);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
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
          Product Management
        </h2>
        <p className="text-gray-600">
          Manage your product inventory and listings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Total Products</div>
          <div className="text-2xl font-bold text-gray-800">
            {products.length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Published</div>
          <div className="text-2xl font-bold text-gray-800">
            {products.filter((p) => p.status === "published").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Out of Stock</div>
          <div className="text-2xl font-bold text-gray-800">
            {products.filter((p) => !p.in_stock).length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Total Value</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatPrice(
              products.reduce((acc, p) => acc + p.price * (p.quantity || 0), 0)
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
              placeholder="Search products..."
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
            <span>Add New Product</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-100">
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Product
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Price
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-600">
                  Stock
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium mr-3">
                        {product.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.description?.substring(0, 50)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {product.category}
                    {product.sub_category && (
                      <span className="text-xs text-gray-500 block">
                        {product.sub_category}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-800">
                    {formatPrice(product.price)}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {product.quantity}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
          setEditingProduct(null);
        }}
        title={editingProduct ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              name="name"
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingProduct?.name}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingProduct?.category}
                required
              >
                <option value="Equipment">Equipment</option>
                <option value="Food">Food</option>
                <option value="Safety">Safety</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub Category
              </label>
              <input
                name="sub_category"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingProduct?.sub_category}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingProduct?.price}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                name="quantity"
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={editingProduct?.quantity}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingProduct?.status || "draft"}
              required
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={editingProduct?.description}
              rows={3}
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
              {editingProduct ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
