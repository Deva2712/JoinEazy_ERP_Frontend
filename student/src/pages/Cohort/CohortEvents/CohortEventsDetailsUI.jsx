import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  User,
  Tag,
  FileText,
  CheckCircle,
  Edit,
  Trash2,
  ChevronDown,
  StickyNote,
  ListCheck,
} from "lucide-react";

const CohortEventsDetailsUI = ({
  isOpen,
  onClose,
  eventData,
  loading,
  onJoinEvent,
  onShareEvent,
  onGoingStatus,
  onGoingStatusChange,
  onAddComment,
  onCommentDelete,
  onRequestAction,
  commentsData,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "upcoming":
        return "bg-green-100 text-green-800";
      case "past":
        return "bg-purple-100 text-purple-800";
      case "requested":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (type, status) => {
    if (type === "requested") {
      return status === "confirmed" ? "Requested & Confirmed" : "Requested";
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const [selectedGoingStatus, setSelectedGoingStatus] = React.useState(null);
  const [showGoingDropdown, setShowGoingDropdown] = React.useState(false);
  const [userGoingStatus, setUserGoingStatus] = React.useState(null);
  const [newComment, setNewComment] = React.useState("");

  const [showLocationInput, setShowLocationInput] = React.useState(false);
  const [locationInput, setLocationInput] = React.useState("");

  const goingOptions = ["Going", "Not Going", "Don't Know"];

  const handleGoingSelect = (option) => {
    setSelectedGoingStatus(option);
    setShowGoingDropdown(false);
    onGoingStatus(option);
  };

  React.useEffect(() => {
    if (eventData?.userGoingStatus) {
      setUserGoingStatus(eventData.userGoingStatus);
    }
  }, [eventData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4 overflow-y-auto overflow-x-hidden">
      <div className="bg-white sm:rounded-2xl w-full sm:max-w-[35rem] h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-auto sm:border border-[#52586633]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#52586633]">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            {loading ? "Loading..." : "Event Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-lg text-gray-600">
                Loading event details...
              </div>
            </div>
          ) : eventData ? (
            <div className="p-5">
              {/* Status Row */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(eventData.status)}`}
                ></div>
                <span className="text-[15px] font-medium text-gray-700">
                  {getStatusText(eventData.type, eventData.status)}
                </span>
              </div>

              {/* Event Title */}
              <h1 className="text-xl font-semibold text-black mb-3">
                {eventData.title}
              </h1>

              {/* Event Description */}
              <p className="text-gray-800 font-normal text-base mb-5">
                {eventData.description}
              </p>

              {/* Host/Requester Section */}
              <div className="mb-7">
                <h3 className="text-sm font-semibold text-gray-800 mb-2.5">
                  Hosted by
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={eventData.organizer.avatar}
                    alt={eventData.organizer.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-black text-[15px]">
                      {eventData.organizer.name}
                    </p>
                    <p className="text-gray-700 text-sm line-clamp-1">
                      {eventData.organizer.description}
                    </p>
                  </div>
                </div>

                {/* Show Requester if event type is requested */}
                {eventData.type === "requested" && eventData.requester && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2.5">
                      Requested by
                    </h3>
                    <div className="flex items-center gap-3">
                      <img
                        src={eventData.requester.avatar}
                        alt={eventData.requester.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-black text-[15px]">
                          {eventData.requester.name}
                        </p>
                        <p className="text-gray-700 text-sm line-clamp-1">
                          {eventData.requester.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="space-y-2 mb-6">
                {/* Date and Time */}
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-black" />
                  <p className="text-[15px] text-black">
                    {formatDate(eventData.date)} • {eventData.startTime} -{" "}
                    {eventData.endTime}
                  </p>
                </div>

                {/* Location - Hide for requested events that are not confirmed */}
                {!(
                  eventData.type === "requested" &&
                  eventData.status !== "confirmed"
                ) && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-black" />
                    <div>
                      <span className="text-[15px] text-black">
                        {eventData.location}
                      </span>
                    </div>
                  </div>
                )}

                {/* Participants */}
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-black" />
                  <div>
                    <span className="text-[15px] text-black">
                      {eventData.participants}
                    </span>
                  </div>
                </div>

                {/* Participation Statistics */}
                {eventData.goingStats && (
                  <div className="flex items-center gap-2">
                    <ListCheck size={18} className="text-black" />
                    <span className="text-[15px] text-black">
                      {eventData.goingStats.going} Going •{" "}
                      {eventData.goingStats.notGoing} Not Going
                    </span>
                  </div>
                )}

                {/* Going Status Selection - Show only if not editable and event is confirmed */}
                {!eventData.isEditable && eventData.status === "confirmed" && (
                  <div className="pt-3">
                    <div className="flex gap-2">
                      {["Going", "Not Going", "Don't Know"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            const success = onGoingStatusChange(option);
                            if (success) {
                              setUserGoingStatus(option);
                            }
                          }}
                          className={`px-3.5 py-1.5 text-sm rounded-full font-medium border transition-colors ${
                            userGoingStatus === option
                              ? "bg-[#1E61F0] text-white border-none"
                              : "bg-white text-black border-[#52586633]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accept/Decline buttons for requested events that are not confirmed */}
                {eventData.type === "requested" &&
                  eventData.status !== "confirmed" && (
                    <div className="pt-3">
                      <div className="flex gap-3 mb-4">
                        <button
                          onClick={() => setShowLocationInput(true)}
                          className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors"
                          style={{ backgroundColor: "rgb(30, 97, 240)" }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onRequestAction("decline")}
                          className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors bg-red-500 hover:bg-red-600"
                        >
                          Decline
                        </button>
                      </div>

                      {/* Location Input Section - Show after Accept is clicked */}
                      {showLocationInput && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-800 mb-3">
                            Confirm Event Location
                          </h4>
                          <div className="mb-4">
                            <input
                              type="text"
                              value={locationInput}
                              onChange={(e) => setLocationInput(e.target.value)}
                              placeholder="Enter event location (e.g., Conference Room A, Online, etc.)"
                              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                if (locationInput.trim()) {
                                  onRequestAction(
                                    "accept",
                                    locationInput.trim(),
                                  );
                                  setShowLocationInput(false);
                                  setLocationInput("");
                                } else {
                                  alert(
                                    "Please enter a location before confirming",
                                  );
                                }
                              }}
                              disabled={!locationInput.trim()}
                              className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ backgroundColor: "rgb(30, 97, 240)" }}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => {
                                setShowLocationInput(false);
                                setLocationInput("");
                              }}
                              className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg border border-gray-300 transition-colors hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 border-t border-b border-[#52586633] py-4">
                {/* Share Button */}
                <button
                  onClick={onShareEvent}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Share2 size={16} />
                  Share
                </button>

                {/* Notes Button */}
                <button
                  onClick={() =>
                    console.log("Notes clicked for event:", eventData.id)
                  }
                  className="flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <StickyNote size={16} />
                  Tag to Note
                </button>

                {/* Edit and Delete buttons - Show only if editable */}
                {eventData.isEditable && (
                  <>
                    <button
                      onClick={() => console.log("Edit event:", eventData.id)}
                      className="ml-auto flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => console.log("Delete event:", eventData.id)}
                      className="flex items-center gap-2 text-sm font-medium text-red-600"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </>
                )}
              </div>

              {/* Comments Section */}
              <div className="mt-5 sm:mt-6 mb-2">
                <h3 className="text-[17px] sm:text-lg font-semibold text-black mb-3.5">
                  {commentsData?.length || 0} Comments
                </h3>

                {/* Add Comment Input */}
                <div className="mb-6 p-4 bg-[#f2f2f2] border border-[#52586633] rounded-[10px] sm:rounded-xl">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full min-h-[60px] text-sm bg-transparent border-none focus:outline-none resize-none placeholder-gray-500"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => {
                        onAddComment(newComment);
                        setNewComment("");
                      }}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "rgb(30, 97, 240)" }}
                    >
                      Submit
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-5">
                  {commentsData?.map((comment) => (
                    <div key={comment.id} className="bg-white">
                      {/* Comment Header */}
                      <div className="flex items-center gap-3">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-10 h-10 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-black text-[15px]">
                              {comment.authorName}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600">
                            {comment.description}
                          </p>
                        </div>
                      </div>

                      {/* Comment Content */}
                      <p className="text-base text-black my-2.5 ml-[52px]">
                        {comment.content}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-4 ml-[52px]">
                        <button
                          onClick={() =>
                            console.log("Share comment:", comment.id)
                          }
                          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <Share2 size={15} />
                          Share
                        </button>
                        {comment.isEditable && (
                          <button
                            onClick={() => onCommentDelete(comment.id)}
                            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <div className="text-lg text-gray-600">Event not found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CohortEventsDetailsUI;
