import React from "react";
import { Calendar, Clock, MapPin, Video, ExternalLink, User } from "lucide-react";

const UpcomingMeetings = ({ meetings, loading }) => {
  // Filter and sort upcoming meetings (future meetings only)
  const upcomingMeetings = meetings
    .filter(meeting => {
      const meetingDateTime = new Date(meeting.dateTime || meeting.requestedTime);
      return meetingDateTime >= new Date();
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateTime || a.requestedTime);
      const dateB = new Date(b.dateTime || b.requestedTime);
      return dateA - dateB;
    });

  // Group meetings by date
  const groupedMeetings = upcomingMeetings.reduce((groups, meeting) => {
    const meetingDateTime = new Date(meeting.dateTime || meeting.requestedTime);
    const dateKey = meetingDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(meeting);
    return groups;
  }, {});

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isToday = (dateTime) => {
    const today = new Date();
    const meetingDate = new Date(dateTime);
    return (
      meetingDate.getDate() === today.getDate() &&
      meetingDate.getMonth() === today.getMonth() &&
      meetingDate.getFullYear() === today.getFullYear()
    );
  };

  const isTomorrow = (dateTime) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const meetingDate = new Date(dateTime);
    return (
      meetingDate.getDate() === tomorrow.getDate() &&
      meetingDate.getMonth() === tomorrow.getMonth() &&
      meetingDate.getFullYear() === tomorrow.getFullYear()
    );
  };

  const getDateLabel = (dateKey, firstMeetingDateTime) => {
    if (isToday(firstMeetingDateTime)) {
      return { label: 'Today', color: 'text-blue-600 dark:text-blue-400' };
    }
    if (isTomorrow(firstMeetingDateTime)) {
      return { label: 'Tomorrow', color: 'text-green-600 dark:text-green-400' };
    }
    return { label: dateKey, color: 'text-gray-900 dark:text-white' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (upcomingMeetings.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No upcoming meetings
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You don't have any scheduled meetings at the moment.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Request a meeting to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Summary Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Upcoming Meetings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            You have {upcomingMeetings.length} {upcomingMeetings.length === 1 ? 'meeting' : 'meetings'} scheduled
          </p>
        </div>
      </div>

      {/* Grouped Meetings */}
      <div className="space-y-6">
        {Object.entries(groupedMeetings).map(([dateKey, dateMeetings]) => {
          const dateInfo = getDateLabel(dateKey, dateMeetings[0].dateTime || dateMeetings[0].requestedTime);
          
          return (
            <div key={dateKey}>
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-3">
                <h4 className={`text-base font-semibold ${dateInfo.color}`}>
                  {dateInfo.label}
                </h4>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>

              {/* Meetings for this date */}
              <div className="space-y-3">
                {dateMeetings.map((meeting) => {
                  const meetingDateTime = meeting.dateTime || meeting.requestedTime;
                  
                  return (
                    <div
                      key={meeting.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
                    >
                      {/* Meeting Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {meeting.professorName || 'Professor'}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {meeting.reason}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full whitespace-nowrap">
                          Confirmed
                        </span>
                      </div>

                      {/* Meeting Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {/* Date & Time */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Date</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(meetingDateTime)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Time</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatTime(meetingDateTime)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Meeting Type & Link/Location */}
                      {meeting.meetingType === 'online' ? (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Video className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                                  Online Meeting
                                </span>
                              </div>
                              {meeting.meetingLink ? (
                                <a
                                  href={meeting.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group-hover:underline break-all"
                                >
                                  <span className="truncate">{meeting.meetingLink}</span>
                                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                </a>
                              ) : (
                                <span className="text-sm text-blue-700 dark:text-blue-400">
                                  Meeting link will be shared soon
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-semibold text-amber-900 dark:text-amber-300 block mb-1">
                                In-Person Meeting
                              </span>
                              <span className="text-sm text-amber-700 dark:text-amber-400">
                                {meeting.location || 'Location to be announced'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingMeetings;