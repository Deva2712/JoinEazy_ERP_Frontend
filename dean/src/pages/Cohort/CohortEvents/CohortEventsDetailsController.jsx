import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CohortEventsDetailsUI from "./CohortEventsDetailsUI";

const CohortEventsDetailsController = ({ isOpen, onClose, eventId }) => {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;

      setLoading(true);
      try {
        // Mock data for now - replace with actual API call
        const mockEventData = {
          id: eventId,
          title: "Request for Mock Presentation",
          description:
            "Kindly allow us to give you a mock presentation on our project",
          date: "2025-07-15",
          startTime: "10:00 AM",
          endTime: "2:00 PM",
          timezone: "IST",
          location: "Online",
          type: "requested", // can be 'upcoming', 'past', 'requested'
          status: "pending", // can be 'confirmed', 'pending', 'cancelled'
          isEditable: false, // determines if user can edit/delete
          userGoingStatus: "Going", // Add this line - user's current going status
          organizer: {
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: "https://randomuser.me/api/portraits/men/68.jpg",
            description: "Admin",
          },
          requester: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            avatar: "https://randomuser.me/api/portraits/men/60.jpg",
            description: "Group 13 • @se22uari034",
          },
          attendees: 125,
          maxAttendees: 200,
          participants: "Everyone",
          goingStats: {
            going: 196,
            notGoing: 160,
            dontKnow: 34,
          },
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setEventData(mockEventData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setLoading(false);
      }
    };

    if (isOpen && eventId) {
      fetchEventDetails();
    }
  }, [isOpen, eventId]);

  const handleJoinEvent = () => {
    console.log("Joining event:", eventId);
    // Implement join event logic
  };

  const handleShareEvent = () => {
    const currentUrl = window.location.href;
    const eventUrl = currentUrl.includes(`/${eventId}`)
      ? currentUrl
      : `${window.location.origin}${window.location.pathname}${window.location.pathname.endsWith("/") ? "" : "/"}${eventId}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(eventUrl).then(() => {
        console.log("Event URL copied to clipboard");
      });
    }
  };

  const handleGoingStatus = (status) => {
    console.log("Going status selected:", status, "for event:", eventId);
    // Implement going status logic
  };

  const handleGoingStatusChange = (status) => {
    console.log("Going status change:", status, "for event:", eventId);
    // Mock implementation - returns true/false randomly for now
    const success = Math.random() > 0.5;
    console.log("Status change result:", success);
    return success;
  };

  const handleAddComment = (comment) => {
    console.log("Adding comment:", comment, "for event:", eventId);
    // Mock implementation for now
    return true;
  };

  const handleCommentDelete = (commentId) => {
    console.log("Deleting comment:", commentId, "for event:", eventId);
    // Mock implementation for now
    return true;
  };

  const handleRequestAction = (action, location = null) => {
    console.log("Request action:", action, "for event:", eventId);
    if (location) {
      console.log("Location provided:", location);
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <CohortEventsDetailsUI
      isOpen={isOpen}
      onClose={onClose}
      eventData={eventData}
      loading={loading}
      onJoinEvent={handleJoinEvent}
      onShareEvent={handleShareEvent}
      onGoingStatus={handleGoingStatus}
      onGoingStatusChange={handleGoingStatusChange}
      onAddComment={handleAddComment}
      onCommentDelete={handleCommentDelete}
      onRequestAction={handleRequestAction}
      commentsData={[
        {
          id: 1,
          authorName: "Alice Johnson",
          authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
          description: "Frontend Developer",
          content: "Great event! Looking forward to attending this workshop.",
          likes: 5,
          isLiked: false,
          isEditable: true,
        },
        {
          id: 2,
          authorName: "Bob Smith",
          authorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
          description: "Backend Engineer",
          content:
            "This looks very interesting. Will there be hands-on coding sessions?",
          likes: 3,
          isLiked: true,
          isEditable: false,
        },
      ]}
    />
  );
};

export default CohortEventsDetailsController;
