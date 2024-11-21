"use client";
import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";

const PostManagement = () => {
  const supabase = createClientComponentClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast.error("Error loading posts: " + error.message);
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

      const postData = {
        user_id: user.id,
        content: formData.get("content"),
        type: formData.get("type"),
        location: formData.get("location"),
        tags:
          formData
            .get("tags")
            ?.split(",")
            .map((tag) => tag.trim()) || [],
        mentions:
          formData
            .get("mentions")
            ?.split(",")
            .map((mention) => mention.trim()) || [],
        background_color: formData.get("background_color"),
        media: formData.get("media") ? JSON.parse(formData.get("media")) : [],
        user_info: {
          name: user.user_metadata?.full_name || user.email,
          avatar_url: user.user_metadata?.avatar_url,
        },
        is_verified: false,
      };

      if (editingPost) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", editingPost.id)
          .eq("user_id", user.id);

        if (error) throw error;
        toast.success("Post updated successfully");
      } else {
        const { error } = await supabase.from("posts").insert([postData]);

        if (error) throw error;
        toast.success("Post created successfully");
      }

      fetchPosts();
      setIsModalOpen(false);
      setEditingPost(null);
    } catch (error) {
      toast.error(
        `Error ${editingPost ? "updating" : "creating"} post: ${error.message}`
      );
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) throw error;
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      toast.error("Error deleting post: " + error.message);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  const renderForm = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          name="content"
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue={editingPost?.content}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue={editingPost?.type || "text"}
            required
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            name="location"
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            defaultValue={editingPost?.location}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma-separated)
        </label>
        <input
          name="tags"
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue={editingPost?.tags?.join(", ")}
          placeholder="e.g., horses, training, health"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mentions (comma-separated)
        </label>
        <input
          name="mentions"
          type="text"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue={editingPost?.mentions?.join(", ")}
          placeholder="e.g., @user1, @user2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <input
          name="background_color"
          type="color"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue={editingPost?.background_color || "#ffffff"}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Media URLs (JSON array)
        </label>
        <textarea
          name="media"
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          defaultValue={
            editingPost?.media ? JSON.stringify(editingPost.media) : "[]"
          }
          placeholder='["https://example.com/image1.jpg"]'
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(false);
            setEditingPost(null);
          }}
          className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {editingPost ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );

  const renderTable = (
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50 border-y border-gray-100">
          <th className="text-left p-4 text-sm font-medium text-gray-600">
            Content
          </th>
          <th className="text-left p-4 text-sm font-medium text-gray-600">
            Type
          </th>
          <th className="text-left p-4 text-sm font-medium text-gray-600">
            Engagement
          </th>
          <th className="text-left p-4 text-sm font-medium text-gray-600">
            Created
          </th>
          <th className="text-left p-4 text-sm font-medium text-gray-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {posts.map((post) => (
          <tr key={post.id} className="hover:bg-gray-50">
            <td className="p-4">
              <div className="text-sm text-gray-800">
                {post.content?.substring(0, 100)}...
              </div>
              {post.location && (
                <div className="text-xs text-gray-500">📍 {post.location}</div>
              )}
            </td>
            <td className="p-4">
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                {post.type}
              </span>
            </td>
            <td className="p-4">
              <div className="text-sm space-y-1">
                <div>👍 {post.likes || 0} likes</div>
                <div>💬 {post.comments?.length || 0} comments</div>
                <div>🔄 {post.shares || 0} shares</div>
              </div>
            </td>
            <td className="p-4 text-sm text-gray-600">
              {new Date(post.created_at).toLocaleDateString()}
            </td>
            <td className="p-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingPost(post);
                    setIsModalOpen(true);
                  }}
                  className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
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
  );

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Post Management
        </h2>
        <p className="text-gray-600">Manage your blog posts and articles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Total Posts</div>
          <div className="text-2xl font-bold text-gray-800">{posts.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Published</div>
          <div className="text-2xl font-bold text-gray-800">
            {posts.filter((p) => p.status === "published").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Drafts</div>
          <div className="text-2xl font-bold text-gray-800">
            {posts.filter((p) => p.status === "draft").length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm mb-2">Categories</div>
          <div className="text-2xl font-bold text-gray-800">
            {new Set(posts.map((p) => p.category)).size}
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
              placeholder="Search posts..."
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
            <span>Add New Post</span>
          </button>
        </div>

        <div className="overflow-x-auto">{renderTable}</div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
        }}
        title={editingPost ? "Edit Post" : "Add New Post"}
      >
        {renderForm}
      </Modal>
    </div>
  );
};

export default PostManagement;
