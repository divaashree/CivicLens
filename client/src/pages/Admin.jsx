import { useState, useEffect } from "react";
import API from "../services/api";

export default function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({});

  const departmentMap = {
    pothole: "PWD",
    garbage: "Waste Management",
    streetlight: "Electricity",
    water: "Water Supply",
    parking: "Traffic Police",
    dumping: "Municipal Corp",
    other: "Unassigned",
  };

  const statusColors = {
    submitted: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };

  const categoryEmojis = {
    pothole: "🕳️",
    garbage: "🗑️",
    streetlight: "💡",
    water: "💧",
    parking: "🚗",
    dumping: "🚫",
    other: "📌",
  };

  // Fetch all complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await API.get("/complaints");
        setComplaints(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch complaints");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Handle status/department update
  const handleUpdate = async (complaintId, status, department) => {
    try {
      const response = await API.put(`/complaints/${complaintId}`, {
        status,
        department,
      });

      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? response.data : c))
      );
      setUpdateStatus({});
    } catch (err) {
      console.error("Failed to update complaint:", err);
      alert("Failed to update complaint");
    }
  };

  if (loading) {
    return (
      <div className="p-4 pb-24">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Manage all civic complaints</p>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-blue-600">{complaints.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Submitted</p>
          <p className="text-2xl font-bold text-yellow-600">
            {complaints.filter((c) => c.status === "submitted").length}
          </p>
        </div>
        <div className="bg-sky-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-sky-600">
            {complaints.filter((c) => c.status === "in_progress").length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Resolved</p>
          <p className="text-2xl font-bold text-green-600">
            {complaints.filter((c) => c.status === "resolved").length}
          </p>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Department
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Upvotes
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr
                key={complaint._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {complaint.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {complaint.location?.address || "No location"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {categoryEmojis[complaint.category]} {complaint.category}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      statusColors[complaint.status]
                    }`}
                  >
                    {complaint.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {complaint.department}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  👍 {complaint.upvotes}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === complaint._id ? null : complaint._id
                      )
                    }
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    {expandedId === complaint._id ? "Close" : "Edit"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Panel */}
      {expandedId && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          {complaints.find((c) => c._id === expandedId) && (
            <AdminEditPanel
              complaint={complaints.find((c) => c._id === expandedId)}
              onUpdate={handleUpdate}
              departmentMap={departmentMap}
              onClose={() => setExpandedId(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function AdminEditPanel({ complaint, onUpdate, departmentMap, onClose }) {
  const [status, setStatus] = useState(complaint.status);
  const [department, setDepartment] = useState(
    complaint.department || "Unassigned"
  );

  const handleSubmit = () => {
    onUpdate(complaint._id, status, department);
    onClose();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Update Complaint: {complaint.title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="submitted">Submitted</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Unassigned">Unassigned</option>
            <option value="PWD">🛣️ PWD</option>
            <option value="Waste Management">🗑️ Waste Management</option>
            <option value="Electricity">💡 Electricity</option>
            <option value="Water Supply">🚰 Water Supply</option>
            <option value="Traffic Police">🚓 Traffic Police</option>
            <option value="Municipal Corp">🏗️ Municipal Corp</option>
          </select>
        </div>
      </div>

      {/* Complaint Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-2">Complaint Details</h4>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Description:</strong> {complaint.description}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Created:</strong>{" "}
          {new Date(complaint.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Comments:</strong> {complaint.comments?.length || 0}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Save Changes
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold rounded-lg transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
