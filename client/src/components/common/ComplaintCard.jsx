import { useState } from "react";
import API from "../../services/api";
import MediaCarousel from "./MediaCarousel";
import { calculateSLA } from "../../utils/slaHelper";

export default function ComplaintCard({ complaint, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [localComplaint, setLocalComplaint] = useState(complaint);

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      pothole: "🕳️",
      garbage: "🗑️",
      streetlight: "💡",
      water: "💧",
      parking: "🚗",
      dumping: "🚫",
      other: "📌",
    };
    return emojiMap[category] || "📌";
  };

  const getDepartmentEmoji = (department) => {
    const emojiMap = {
      PWD: "🛣️",
      "Waste Management": "🗑️",
      Electricity: "💡",
      "Water Supply": "🚰",
      "Traffic Police": "🚓",
      "Municipal Corp": "🏗️",
      Unassigned: "❓",
    };
    return emojiMap[department] || "📌";
  };

  const handleUpvote = async () => {
    try {
      setLoading(true);
      const response = await API.patch(`/complaints/${localComplaint._id}/upvote`);
      setLocalComplaint(response.data);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error upvoting:", err);
      alert("Failed to upvote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      alert("Please enter a comment");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post(`/complaints/${localComplaint._id}/comment`, {
        text: commentText,
      });
      setLocalComplaint(response.data);
      setCommentText("");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const slaInfo = calculateSLA(
    localComplaint.createdAt,
    localComplaint.resolvedAt,
    localComplaint.status
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
      {/* Media Carousel */}
      <div className="p-4">
        <MediaCarousel media={localComplaint.media} />
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900">{localComplaint.title}</h2>
        <p className="text-gray-700 mt-2 text-sm">{localComplaint.description}</p>

        <div className="mt-4 flex flex-col gap-3">
          {localComplaint.location?.address && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                📍 Location:
              </span>
              <span className="text-sm text-gray-600">{localComplaint.location.address}</span>
            </div>
          )}

          {/* Badges Row 1 */}
          <div className="flex flex-wrap gap-2 items-center">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                localComplaint.status
              )}`}
            >
              {localComplaint.status &&
                localComplaint.status.charAt(0).toUpperCase() +
                  localComplaint.status.slice(1).replace("_", " ")}
            </span>

            {localComplaint.category && (
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                <span>{getCategoryEmoji(localComplaint.category)}</span>
                <span>{localComplaint.category.charAt(0).toUpperCase() + localComplaint.category.slice(1)}</span>
              </span>
            )}

            {localComplaint.severity && (
              <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                🚨 Severity: {localComplaint.severity}/10
              </span>
            )}
          </div>

          {/* Badges Row 2: Department and SLA */}
          <div className="flex flex-wrap gap-2 items-center">
            {localComplaint.department && (
              <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-1">
                <span>{getDepartmentEmoji(localComplaint.department)}</span>
                <span>{localComplaint.department}</span>
              </span>
            )}

            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                slaInfo.isMet
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {slaInfo.text}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap gap-2 items-center border-t pt-3">
          <button
            onClick={handleUpvote}
            disabled={loading}
            className="flex items-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition disabled:opacity-50"
          >
            👍 {localComplaint.upvotes}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
          >
            💬 {localComplaint.comments?.length || 0}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t bg-gray-50 p-4">
          {/* Add Comment Form */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={loading || !commentText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:bg-gray-400"
              >
                Post
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {localComplaint.comments && localComplaint.comments.length > 0 ? (
              localComplaint.comments.map((comment, idx) => (
                <div key={idx} className="bg-white rounded p-3 border border-gray-200">
                  <p className="text-sm text-gray-900">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleDateString()}{" "}
                    {new Date(comment.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-3">No comments yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
