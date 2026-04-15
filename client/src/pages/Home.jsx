import { useState, useEffect } from "react";
import API from "../services/api";
import ComplaintCard from "../components/common/ComplaintCard";

export default function Home() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await API.get("/complaints");
        setComplaints(response.data);
        setError(null);
        console.log("Complaints fetched:", response.data);
      } catch (err) {
        setError("Failed to fetch complaints");
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Civic Complaints</h1>
      <p className="text-gray-600 mb-6">Report and track issues in your community</p>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <ComplaintCard key={complaint._id} complaint={complaint} />
          ))
        ) : (
          !loading && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No complaints found</p>
              <p className="text-gray-400 text-sm mt-2">
                Be the first to report an issue using the Report page
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}