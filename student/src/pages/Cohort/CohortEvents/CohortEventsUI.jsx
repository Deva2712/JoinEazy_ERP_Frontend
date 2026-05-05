import React from "react";
import {
  Calendar,
  Clock,
  History,
  MessageSquare,
  Plus,
  Send,
  Share2,
  MapPin,
  Edit,
} from "lucide-react";
import CalendarCustom from "../../../components/ui/calendar-custom";

const CohortEventsUI = ({
  user_type,
  activeTab,
  events,
  sharedEvents,
  onUpcomingClick,
  onPastClick,
  onRequestedClick,
  onCalendarViewClick,
  onNewEventClick,
  onRequestEventClick,
  onBookmarkToggle,
  onShareClick,
  onEventClick,
  onEditEvent,
  loading,
  error,
  onRetry,
}) => {
  const getButtonStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return {
      height: "38px",
      borderRadius: "9999px",
      backgroundColor: "white",
      border: isActive ? "1px solid #D3D6DA" : "1px solid #D3D6DA",
      color: isActive ? "rgb(30, 97, 240)" : "#374151",
      paddingLeft: "16px",
      paddingRight: "16px",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s",
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  const getDateColor = (eventType) => {
    switch (eventType) {
      case "upcoming":
        return {
          text: "#159339", // Green text
          background: "#ebf9ef", // Green background
        };
      case "past":
        return {
          text: "#863ced", // Purple text
          background: "#f8f3ff", // Purple background
        };
      default:
        return {
          text: "#159339", // Green text
          background: "#ebf9ef", // Green background
        };
    }
  };

  const EventCard = ({ event }) => {
    const { month, day } = formatDate(event.date);
    const dateColorClass = getDateColor(event.type);
    const isShared = sharedEvents?.has(event.id);

    return (
      <div
        className="bg-white border-t border-b  sm:border border-[#D3D6DA] sm:rounded-[18px] p-4 sm:p-5 flex items-start gap-3.5 sm:gap-4 hover:cursor-pointer transition-shadow"
        onClick={() => onEventClick(event.id)}
      >
        {/* Date Section */}
        <div
          className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 mt-0.5 sm:mt-1 flex flex-col items-center justify-center text-center rounded-lg"
          style={{
            backgroundColor: dateColorClass.background,
            color: dateColorClass.text,
          }}
        >
          <div className="text-xs sm:text-[13px] font-semibold mt-[1px]">
            {month}
          </div>
          <div className="text-base sm:text-[17px] text-black font-semibold">
            {day}
          </div>
        </div>

        {/* Event Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-black text-[15px] sm:text-base line-clamp-1 mb-1 sm:mb-1.5">
            {event.title}
          </h3>
          <p className="text-sm text-gray-800 line-clamp-1 mb-1.5 sm:mb-2.5">
            {event.description}
          </p>

          {/* Time and Location */}
          <div className="flex items-center gap-4 text-gray-600 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="mt-0" />
              <span className="text-xs sm:text-[13px] whitespace-nowrap">
                {event.startTime} - {event.endTime} {event.timezone}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              <span className="text-xs text-[13px] line-clamp-1">
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={() => onShareClick(event.id)}
          className="hidden sm:flex flex-shrink-0 my-auto p-2 sm:p-2.5 bg-white border border-[#D3D6DA] rounded-full transition-colors"
        >
          <Share2
            size={16}
            className={`transition-colors ${
              isShared ? "text-green-600" : "text-gray-600"
            }`}
          />
        </button>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-20">
        <div className="text-red-500 mb-4">Failed to load events: {error}</div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pb-[92px] py-5 sm:px-4 sm:py-6 sm:pb-7">
      {/* Button Row */}
      <div className="flex items-center justify-between px-4 sm:px-0 mb-5 sm:mb-6">
        {/* Left Side - Tab Buttons with Overflow */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-max">
            <button
              onClick={onUpcomingClick}
              className="flex items-center justify-center gap-2 transition-all duration-200 flex-shrink-0"
              style={getButtonStyle("Upcoming")}
            >
              <Clock size={16} />
              Upcoming
            </button>

            <button
              onClick={onPastClick}
              className="flex items-center justify-center gap-2 transition-all duration-200 flex-shrink-0"
              style={getButtonStyle("Past")}
            >
              <History size={16} />
              Past
            </button>

            <button
              onClick={onRequestedClick}
              className="flex items-center justify-center gap-2 transition-all duration-200 flex-shrink-0"
              style={getButtonStyle("Requested")}
            >
              <MessageSquare size={16} />
              Requested
            </button>

            <button
              onClick={onCalendarViewClick}
              className="flex items-center justify-center gap-2 transition-all duration-200 flex-shrink-0"
              style={getButtonStyle("Calendar view")}
            >
              <Calendar size={15} />
              Calendar view
            </button>
          </div>
        </div>

        {/* Right Side - Action Button (Hidden on small screens) */}
        <div className="hidden sm:block ml-4">
          {user_type === 1 ? (
            <button
              onClick={onNewEventClick}
              className="flex items-center justify-center gap-2 font-medium text-white transition-all duration-200"
              style={{
                height: "38px",
                borderRadius: "9999px",
                backgroundColor: "rgb(30, 97, 240)",
                paddingLeft: "16px",
                paddingRight: "16px",
                fontSize: "14px",
              }}
            >
              <Plus size={15} />
              New Event
            </button>
          ) : (
            <button
              onClick={onRequestEventClick}
              className="flex items-center justify-center gap-2 font-medium text-white transition-all duration-200"
              style={{
                height: "38px",
                borderRadius: "9999px",
                backgroundColor: "rgb(30, 97, 240)",
                paddingLeft: "16px",
                paddingRight: "16px",
                fontSize: "14px",
              }}
            >
              <Send size={15} />
              Request Event
            </button>
          )}
        </div>
      </div>
      {/* Floating Action Button (Visible only on small screens) */}
      <div className="fixed bottom-[92px] right-5 z-50 sm:hidden">
        {user_type === 1 ? (
          <button
            onClick={onNewEventClick}
            className="flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: "rgb(30, 97, 240)",
            }}
          >
            <Plus size={24} />
          </button>
        ) : (
          <button
            onClick={onRequestEventClick}
            className="flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: "rgb(30, 97, 240)",
            }}
          >
            <Send size={20} />
          </button>
        )}
      </div>

      {/* Events Content */}
      <div className="px-0">
        {activeTab === "Calendar view" ? (
          <CalendarCustom
            events={events}
            onDateClick={(date) => {
              console.log("Date clicked:", date);
              // You can add functionality here to show events for the selected date
            }}
          />
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            No {activeTab.toLowerCase()} events found
          </div>
        )}
      </div>
    </div>
  );
};

export default CohortEventsUI;
