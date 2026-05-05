import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CohortEventsUI from "./CohortEventsUI";
import CohortEventsDetailsController from "./CohortEventsDetailsController";
import CohortEventsCreateController from "./CohortEventsCreateController";

const CohortEventsController = ({ cohortId, cohortData }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sharedEvents, setSharedEvents] = useState(new Set());

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isRequestMode, setIsRequestMode] = useState(false);

  const user_type = 1;

  // Add this useEffect
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const eventsIndex = pathParts.findIndex((part) => part === "events");

    if (eventsIndex !== -1 && pathParts[eventsIndex + 1]) {
      const eventIdFromUrl = pathParts[eventsIndex + 1];
      // Check if it's a valid event ID (should be a number)
      if (!isNaN(eventIdFromUrl) && eventIdFromUrl !== "") {
        setSelectedEventId(parseInt(eventIdFromUrl));
        setIsDetailsModalOpen(true);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const eventsIndex = pathParts.findIndex((part) => part === "events");

    if (eventsIndex !== -1) {
      const nextPart = pathParts[eventsIndex + 1];

      // Check for /events/create
      if (nextPart === "create") {
        setIsCreateModalOpen(true);
        setIsEditMode(false);
        setEditEventId(null);
      }
      // Check for /events/eventid/edit
      else if (
        nextPart &&
        !isNaN(nextPart) &&
        pathParts[eventsIndex + 2] === "edit"
      ) {
        const eventId = parseInt(nextPart);
        setIsCreateModalOpen(true);
        setIsEditMode(true);
        setEditEventId(eventId);
      }
      // If neither create nor edit, close modal
      else if (!nextPart || (nextPart && isNaN(nextPart))) {
        setIsCreateModalOpen(false);
        setIsRequestMode(false);
        setIsEditMode(false);
        setEditEventId(null);
      }
    }
  }, [location.pathname]);

  // Fetch events data from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventsData, setEventsData] = useState({});

  // Function to fetch events data
  const fetchEventsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to get events
      const response = await cohortAPI.getEvents(cohortId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch events');
      }
      
      // Set the events data
      setEventsData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events');
      setLoading(false);
      
      // Fallback to dummy data in case of error
      setEventsData(dummyEvents);
    }
  };

  // Function to retry fetching data
  const handleRetry = () => {
    fetchEventsData();
  };

  // Fetch events when component mounts or cohortId changes
  useEffect(() => {
    if (cohortId) {
      fetchEventsData();
    }
  }, [cohortId]);

  // Dummy events data for fallback
  const dummyEvents = {
    Upcoming: [
      {
        id: 1,
        title: "Final Year Project Orientation",
        description:
          "Detailed briefing on project guidelines, evaluation criteria, and submission deadlines for final year students.",
        location: "Auditorium A",
        date: "2025-07-10",
        startTime: "10:00 AM",
        endTime: "12:00 PM",
        timezone: "IST",
        type: "upcoming",
        isBookmarked: false,
      },
      {
        id: 2,
        title: "Course Registration Assistance",
        description:
          "Get help with registering for your upcoming semester courses. Advisors will be available to guide you.",
        location: "Online",
        date: "2025-07-15",
        startTime: "2:00 PM",
        endTime: "4:00 PM",
        timezone: "IST",
        type: "upcoming",
        isBookmarked: true,
      },
      {
        id: 3,
        title: "Research Paper Distribution",
        description:
          "Faculty will distribute selected research papers for the 'Emerging Technologies' elective. Attendance is mandatory.",
        location: "Lecture Hall B2",
        date: "2025-07-20",
        startTime: "11:00 AM",
        endTime: "12:00 PM",
        timezone: "IST",
        type: "upcoming",
        isBookmarked: false,
      },
    ],
    Past: [
      {
        id: 4,
        title: "Mid-Semester Exam Paper Collection",
        description:
          "Students collected evaluated mid-semester exam papers and received feedback from faculty.",
        location: "Department Office",
        date: "2025-06-01",
        startTime: "10:00 AM",
        endTime: "1:00 PM",
        timezone: "IST",
        type: "past",
        isBookmarked: false,
      },
      {
        id: 5,
        title: "Capstone Project Proposal Review",
        description:
          "Faculty reviewed and provided feedback on students' initial capstone project proposals.",
        location: "Online",
        date: "2025-06-05",
        startTime: "3:00 PM",
        endTime: "5:00 PM",
        timezone: "IST",
        type: "past",
        isBookmarked: true,
      },
      {
        id: 6,
        title: "Course Material Distribution: Data Structures",
        description:
          "Hard copies of lecture notes and problem sets for the Data Structures course were distributed.",
        location: "Room C-105",
        date: "2025-06-12",
        startTime: "9:00 AM",
        endTime: "11:00 AM",
        timezone: "IST",
        type: "past",
        isBookmarked: false,
      },
    ],
    Requested: [
      {
        id: 7,
        title: "Request for Mock Project Presentation",
        description:
          "Students have requested a mock project presentation session to prepare for the final evaluation.",
        location: "Online",
        date: "2025-07-05",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
        timezone: "IST",
        type: "requested",
        isBookmarked: false,
      },
      {
        id: 9,
        title: "Request for Past Year Papers",
        description:
          "A request has been made to distribute previous years' exam papers for practice and preparation.",
        location: "Department Office",
        date: "2025-07-08",
        startTime: "2:00 PM",
        endTime: "3:00 PM",
        timezone: "IST",
        type: "requested",
        isBookmarked: false,
      },
    ],
  };

  // Use eventsData if available, otherwise use dummyEvents as fallback
  const events = loading ? {} : (Object.keys(eventsData).length > 0 ? eventsData : dummyEvents);
  
  const filteredEvents = activeTab === "Calendar view" 
  ? [...(events.Upcoming || []), ...(events.Past || []), ...(events.Requested || [])]
  : events[activeTab] || [];

  const handleUpcomingClick = () => {
    console.log("Upcoming button clicked");
    setActiveTab("Upcoming");
  };

  const handlePastClick = () => {
    console.log("Past button clicked");
    setActiveTab("Past");
  };

  const handleRequestedClick = () => {
    console.log("Requested button clicked");
    setActiveTab("Requested");
  };

  const handleCalendarViewClick = () => {
    console.log("Calendar view button clicked");
    setActiveTab("Calendar view");
  };

  const handleNewEventClick = () => {
    console.log("New Event button clicked");
    setIsRequestMode(false); // Add this line
    const currentPath = location.pathname.replace(/\/+$/, ""); // Remove trailing slashes
    navigate(`${currentPath}/create`);
  };

  const handleRequestEventClick = () => {
    console.log("Request Event button clicked");
    setIsRequestMode(true); // Add this line
    const currentPath = location.pathname.replace(/\/+$/, ""); // Remove trailing slashes
    navigate(`${currentPath}/create`);
  };

  const handleEditEvent = (eventId) => {
    console.log("Edit event clicked:", eventId);
    const currentPath = location.pathname.replace(/\/+$/, ""); // Remove trailing slashes
    navigate(`${currentPath}/${eventId}/edit`);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setIsEditMode(false);
    setEditEventId(null);
    setIsRequestMode(false); // Add this line

    // Navigate back to events page
    const pathParts = location.pathname.split("/");
    const eventsIndex = pathParts.findIndex((part) => part === "events");
    if (eventsIndex !== -1) {
      const newPath = pathParts.slice(0, eventsIndex + 1).join("/");
      navigate(newPath);
    }
  };

  const handleBookmarkToggle = (eventId) => {
    console.log("Bookmark toggled for event:", eventId);
    // You can implement bookmark functionality here
  };

  const handleShareClick = (eventId) => {
    console.log("Share clicked for event:", eventId);

    // Simulate copying to clipboard
    const eventUrl = `${window.location.origin}/events/${eventId}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(eventUrl)
        .then(() => {
          setSharedEvents((prev) => new Set([...prev, eventId]));

          // Reset the shared state after 2 seconds
          setTimeout(() => {
            setSharedEvents((prev) => {
              const newSet = new Set(prev);
              newSet.delete(eventId);
              return newSet;
            });
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy to clipboard:", err);
        });
    } else {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = eventUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setSharedEvents((prev) => new Set([...prev, eventId]));

        // Reset the shared state after 2 seconds
        setTimeout(() => {
          setSharedEvents((prev) => {
            const newSet = new Set(prev);
            newSet.delete(eventId);
            return newSet;
          });
        }, 2000);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleEventClick = (eventId) => {
    console.log("Event clicked:", eventId);
    setSelectedEventId(eventId);
    setIsDetailsModalOpen(true);

    // Update URL to include event ID
    const currentPath = location.pathname;
    const newPath = currentPath.endsWith("/")
      ? `${currentPath}${eventId}`
      : `${currentPath}/${eventId}`;
    navigate(newPath, { replace: true });
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEventId(null);

    // Remove event ID from URL
    const pathParts = location.pathname.split("/");
    const eventsIndex = pathParts.findIndex((part) => part === "events");

    if (
      eventsIndex !== -1 &&
      pathParts[eventsIndex + 1] &&
      !isNaN(pathParts[eventsIndex + 1])
    ) {
      // Remove the event ID from the path
      const newPath = pathParts.slice(0, eventsIndex + 1).join("/");
      navigate(newPath, { replace: true });
    }
  };

  return (
    <>
      <CohortEventsUI
        user_type={user_type}
        activeTab={activeTab}
        events={filteredEvents}
        sharedEvents={sharedEvents}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onUpcomingClick={handleUpcomingClick}
        onPastClick={handlePastClick}
        onRequestedClick={handleRequestedClick}
        onCalendarViewClick={handleCalendarViewClick}
        onNewEventClick={handleNewEventClick}
        onRequestEventClick={handleRequestEventClick}
        onBookmarkToggle={handleBookmarkToggle}
        onShareClick={handleShareClick}
        onEventClick={handleEventClick}
        onEditEvent={handleEditEvent}
      />

      {/* Event Details Modal */}
      <CohortEventsDetailsController
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        eventId={selectedEventId}
      />
      {/* Event Create/Edit Modal */}
      <CohortEventsCreateController
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        cohortId={cohortId}
        editEventId={editEventId}
        cohortData={cohortData}
        isRequestMode={isRequestMode} // Add this line
      />
    </>
  );
};

export default CohortEventsController;
