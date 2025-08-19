import React from "react";
import PageHeader from "../components/PageHeader";
import {
  PlusCircle,
  Edit,
  Trash2,
  Bell,
  Search,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import AdminService from "../../../services/api/AdminService";
import { toast } from "react-toastify";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Load announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAnnouncements();
      // Map backend response to frontend format
      const mappedAnnouncements = response.map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        date: announcement.createdAt
          ? announcement.createdAt.split("T")[0]
          : "", // Format date
        expiryDate: announcement.expiryDate,
        status: announcement.active ? "Active" : "Archived",
      }));
      setAnnouncements(mappedAnnouncements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter(
    (ann) =>
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAnnouncement = () => {
    setCurrentAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEditAnnouncement = (ann) => {
    setCurrentAnnouncement(ann);
    setIsModalOpen(true);
  };

  const handleSaveAnnouncement = async (annData) => {
    try {
      setLoading(true);

      // Prepare data for backend
      const backendData = {
        title: annData.title,
        content: annData.content,
        expiryDate: annData.expiryDate || null,
      };

      if (annData.id) {
        // Edit existing announcement
        const response = await AdminService.updateAnnouncement(
          annData.id,
          backendData
        );
        toast.success("Announcement updated successfully");
      } else {
        // Add new announcement
        const response = await AdminService.addAnnouncement(backendData);
        toast.success(response.message || "Announcement added successfully");
      }

      // Refresh the announcements list
      await fetchAnnouncements();
      setIsModalOpen(false);
      setCurrentAnnouncement(null);
    } catch (error) {
      console.error("Error saving announcement:", error);
      toast.error(error.message || "Failed to save announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (annId) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        setLoading(true);
        await AdminService.deleteAnnouncement(annId);
        toast.success("Announcement deleted successfully");
        await fetchAnnouncements();
      } catch (error) {
        console.error("Error deleting announcement:", error);
        toast.error(error.message || "Failed to delete announcement");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (annId) => {
    try {
      setLoading(true);
      await AdminService.toggleAnnouncementStatus(annId);
      toast.success("Announcement status updated successfully");
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error toggling announcement status:", error);
      toast.error(error.message || "Failed to update announcement status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <PageHeader
        icon={Bell}
        title="Announcements"
        subtitle="Manage system-wide announcements for users and pharmacies."
      />

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search announcements by title or content..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={handleAddAnnouncement}
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <PlusCircle className="mr-2" size={20} /> Add New Announcement
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading announcements...</p>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Content
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Published Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Expiry Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((ann) => (
                <tr key={ann.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ann.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {ann.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ann.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ann.expiryDate || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ann.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ann.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditAnnouncement(ann)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50"
                        title="Edit Announcement"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(ann.id)}
                        disabled={loading}
                        className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
                          ann.status === "Active"
                            ? "text-orange-600 hover:text-orange-900 hover:bg-orange-100"
                            : "text-green-600 hover:text-green-900 hover:bg-green-100"
                        }`}
                        title={
                          ann.status === "Active"
                            ? "Archive Announcement"
                            : "Activate Announcement"
                        }
                      >
                        {ann.status === "Active" ? (
                          <XCircle size={18} />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        disabled={loading}
                        className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                        title="Delete Announcement"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                >
                  {loading
                    ? "Loading..."
                    : "No announcements found matching your criteria."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {currentAnnouncement
                ? "Edit Announcement"
                : "Add New Announcement"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const annData = {
                  id: currentAnnouncement ? currentAnnouncement.id : null,
                  title: formData.get("title"),
                  content: formData.get("content"),
                  expiryDate: formData.get("expiryDate") || null,
                };
                handleSaveAnnouncement(annData);
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={currentAnnouncement?.title || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows="4"
                  defaultValue={currentAnnouncement?.content || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  min={new Date().toISOString().split('T')[0]} // Prevent selecting dates before today
                  defaultValue={currentAnnouncement?.expiryDate || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : currentAnnouncement
                    ? "Save Changes"
                    : "Add Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
