import { useState, useEffect } from "react";
import API from "../services/api";

export default function Admin() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState({});
  const [editDepartment, setEditDepartment] = useState({});

  const departmentMap = {
    pothole: "PWD",
    garbage: "Waste Management",
    streetlight: "Electricity",
    water: "Water Supply",
    parking: "Traffic Police",
    dumping: "Municipal Corp",
    other: "Unassigned",
  };

  const departmentColors = {
    "PWD": "bg-blue-100 text-blue-800",
    "Waste Management": "bg-green-100 text-green-800",
    "Electricity": "bg-yellow-100 text-yellow-800",
    "Water Supply": "bg-cyan-100 text-cyan-800",
    "Traffic Police": "bg-purple-100 text-purple-800",
    "Municipal Corp": "bg-orange-100 text-orange-800",
    "Unassigned": "bg-gray-100 text-gray-800",
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

  const categories = Object.keys(categoryEmojis);
  const departments = Object.values(departmentMap);
  const statuses = ["submitted", "in_progress", "resolved"];

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

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const statusMatch = statusFilter === "all" || c.status === statusFilter;
    const categoryMatch = categoryFilter === "all" || c.category === categoryFilter;
    const departmentMatch = departmentFilter === "all" || c.department === departmentFilter;
    return statusMatch && categoryMatch && departmentMatch;
  });

  // Calculate stats
  const stats = {
    total: complaints.length,
    submitted: complaints.filter((c) => c.status === "submitted").length,
    inProgress: complaints.filter((c) => c.status === "in_progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  // Handle inline updates
  const handleQuickUpdate = async (complaintId, newStatus, newDepartment) => {
    try {
      const response = await API.put(`/complaints/${complaintId}`, {
        status: newStatus,
        department: newDepartment,
      });

      setComplaints((prev) =>
        prev.map((c) => (c._id === complaintId ? response.data : c))
      );
      setEditingId(null);
      setEditStatus({});
      setEditDepartment({});
    } catch (err) {
      console.error("Failed to update complaint:", err);
      alert("Failed to update complaint");
    }
  };

  if (loading) {
    return (
      <div className="p-6 pb-24">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage all civic complaints efficiently</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📊" label="Total Complaints" value={stats.total} color="blue" />
        <StatCard icon="📝" label="Submitted" value={stats.submitted} color="yellow" />
        <StatCard icon="⚙️" label="In Progress" value={stats.inProgress} color="sky" />
        <StatCard icon="✅" label="Resolved" value={stats.resolved} color="green" />
      </div>

      {/* Mini Insights */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">📈 Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Most Reported:</span>
            <p className="font-semibold text-gray-900">
              {complaints.length > 0
                ? Object.entries(
                    complaints.reduce((acc, c) => {
                      acc[c.category] = (acc[c.category] || 0) + 1;
                      return acc;
                    }, {})
                  ).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
                : "N/A"}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Resolution Rate:</span>
            <p className="font-semibold text-green-600">
              {complaints.length > 0
                ? Math.round((stats.resolved / stats.total) * 100) + "%"
                : "N/A"}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Pending Issues:</span>
            <p className="font-semibold text-yellow-600">{stats.submitted + stats.inProgress}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">🔎 Filter Complaints</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="submitted">📝 Submitted</option>
              <option value="in_progress">⚙️ In Progress</option>
              <option value="resolved">✅ Resolved</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryEmojis[cat]} {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No complaints to manage 🎉</p>
            <p className="text-gray-400 text-sm mt-2">All issues have been resolved or no complaints match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Upvotes
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredComplaints.map((complaint, index) => (
                  <tr
                    key={complaint._id}
                    className="hover:bg-blue-50 transition duration-200 bg-white"
                  >
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{complaint.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {complaint.location?.address || "No location"}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-block text-sm">
                        {categoryEmojis[complaint.category]} {complaint.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {editingId === complaint._id ? (
                        <select
                          value={editStatus[complaint._id] || complaint.status}
                          onChange={(e) =>
                            setEditStatus({
                              ...editStatus,
                              [complaint._id]: e.target.value,
                            })
                          }
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full cursor-pointer hover:opacity-80 ${
                            statusColors[complaint.status]
                          }`}
                          onClick={() => setEditingId(complaint._id)}
                          title="Click to edit"
                        >
                          {complaint.status.replace("_", " ")}
                        </span>
                      )}
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4">
                      {editingId === complaint._id ? (
                        <select
                          value={editDepartment[complaint._id] || complaint.department || "Unassigned"}
                          onChange={(e) =>
                            setEditDepartment({
                              ...editDepartment,
                              [complaint._id]: e.target.value,
                            })
                          }
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full cursor-pointer hover:opacity-80 ${
                            departmentColors[complaint.department || "Unassigned"]
                          }`}
                          onClick={() => setEditingId(complaint._id)}
                          title="Click to edit"
                        >
                          {complaint.department || "Unassigned"}
                        </span>
                      )}
                    </td>

                    {/* Upvotes */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-semibold text-gray-900">
                        👍 {complaint.upvotes || 0}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      {editingId === complaint._id ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() =>
                              handleQuickUpdate(
                                complaint._id,
                                editStatus[complaint._id] || complaint.status,
                                editDepartment[complaint._id] || complaint.department
                              )
                            }
                            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditStatus({});
                              setEditDepartment({});
                            }}
                            className="px-3 py-1 text-xs bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingId(complaint._id)}
                          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition"
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-xs text-gray-500">
        Showing {filteredComplaints.length} of {complaints.length} complaints
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    sky: "bg-sky-50 border-sky-200 text-sky-600",
    green: "bg-green-50 border-green-200 text-green-600",
  };

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
