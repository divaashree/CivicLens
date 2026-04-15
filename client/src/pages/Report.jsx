import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Report() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        setError("Title and description are required");
        setLoading(false);
        return;
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        image: "placeholder",
        location: {
          address: formData.address || "Not specified",
        },
      };

      const response = await API.post("/complaints", payload);
      console.log("Complaint submitted successfully:", response.data);

      // Success
      setSuccess(true);
      setFormData({ title: "", description: "", address: "" });

      // Show success for 2 seconds then navigate
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
      console.error("Error submitting complaint:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Report an Issue</h1>
      <p className="text-gray-600 mb-6">
        Help us improve your community by reporting civic issues
      </p>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 font-semibold">✓ Complaint submitted successfully!</p>
          <p className="text-green-700 text-sm mt-1">Redirecting to home...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
            Issue Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Pothole on Main Street"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
          />
        </div>

        {/* Address Input */}
        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-gray-900 mb-2">
            Location / Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter the address or location of the issue"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Fields marked with * are required
        </p>
      </form>
    </div>
  );
}