import React, { useState, useEffect } from "react";
import MyMeetingsUI from "./MyMeetingsUI";
import { meetingService } from "../../../api/services/meeting.service";

const MyMeetingsController = ({ cohortId, cohortData }) => {
  const [activeTab, setActiveTab] = useState("schedule"); // Default to schedule tab
  const [meetings, setMeetings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cohortId) {
      fetchData();
    }
  }, [cohortId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both meetings and requests in parallel
      const [meetingsResponse, requestsResponse] = await Promise.all([
        meetingService.getAcceptedMeetings(cohortId),
        meetingService.getMeetingRequests(cohortId)
      ]);
      
      if (meetingsResponse.success) {
        setMeetings(meetingsResponse.data || []);
      } else {
        console.error('Failed to fetch meetings:', meetingsResponse.error);
      }
      
      if (requestsResponse.success) {
        setRequests(requestsResponse.data || []);
      } else {
        console.error('Failed to fetch meeting requests:', requestsResponse.error);
      }
      
      if (!meetingsResponse.success && !requestsResponse.success) {
        setError('Failed to load meeting data');
      }
    } catch (error) {
      console.error('Error fetching meeting data:', error);
      setError('Unable to connect to server. Please try again later.');
      setMeetings([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMeeting = async (meetingData) => {
    try {
      const requestData = {
        ...meetingData,
        courseName: cohortData?.cohort_name || cohortData?.title || 'Course',
        course: cohortData?.cohort_name || cohortData?.title || 'Course'
      };
      
      console.log('Creating meeting request:', requestData);
      
      const response = await meetingService.createMeetingRequest(cohortId, requestData);
      
      if (response.success) {
        console.log('✅ Meeting request created successfully');
        // Refresh the data to show the new request
        fetchData();
      } else {
        console.error('❌ Failed to create meeting request:', response.error);
      }
    } catch (error) {
      console.error('❌ Error creating meeting request:', error);
    }
  };

  if (error && !loading) {
    return (
      <div className="px-3 sm:px-4 py-5">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <MyMeetingsUI 
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      meetings={meetings} 
      requests={requests}
      loading={loading}
      onRequestMeeting={handleRequestMeeting}
      professorName={cohortData?.instructor || 'Professor'}
      officeHours={cohortData?.office_hours || []}
    />
  );
};

export default MyMeetingsController;