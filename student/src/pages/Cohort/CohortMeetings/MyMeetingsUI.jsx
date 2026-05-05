import React, { useState } from "react";
import { Calendar, Clock, MapPin, Video, ChevronLeft, ChevronRight, User, Plus, X } from "lucide-react";
import MeetingsRequested from "./MeetingsRequested";
import UpcomingMeetings from "./UpcomingMeetings";

const MyMeetingsUI = ({ 
  activeTab, 
  setActiveTab, 
  meetings, 
  requests, 
  loading, 
  onRequestMeeting, 
  professorName, 
  officeHours 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: ''
  });

  // Get meetings for a specific date
  const getMeetingsForDate = (date) => {
    return meetings.filter(meeting => {
      const meetingDateTime = meeting.dateTime || meeting.requestedTime;
      if (!meetingDateTime) return false;
      
      const meetingDate = new Date(meetingDateTime);
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Check if a date has meetings
  const dateHasMeetings = (date) => {
    return meetings.some(meeting => {
      const meetingDateTime = meeting.dateTime || meeting.requestedTime;
      if (!meetingDateTime) return false;
      
      const meetingDate = new Date(meetingDateTime);
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (date) => {
    if (!date || !selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      date: '',
      time: '',
      reason: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine date and time into ISO format
    const dateTime = `${formData.date}T${formData.time}:00Z`;
    
    const meetingRequest = {
      professorName: professorName || 'Professor',
      dateTime: dateTime,
      reason: formData.reason,
      submittedAt: new Date().toISOString()
    };
    
    if (onRequestMeeting) {
      onRequestMeeting(meetingRequest);
    }
    
    handleCloseModal();
  };

  // Format office hours for display
  const formatOfficeHours = () => {
    if (!officeHours || officeHours.length === 0) {
      return "Not set";
    }
    
    const firstOfficeHour = officeHours[0];
    const days = Array.isArray(firstOfficeHour.days) 
      ? firstOfficeHour.days.join(", ")
      : firstOfficeHour.days || "";
    
    return `${days} ${firstOfficeHour.startTime || ""}-${firstOfficeHour.endTime || ""}`;
  };

  const calendarDays = generateCalendarDays();
  const selectedDateMeetings = getMeetingsForDate(selectedDate);

  return (
    <div className="px-3 sm:px-4 py-5">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        
        {/* Header with Tab Selector and Request Button */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-6">
          <div className="flex flex-row items-center justify-between gap-2">
            {/* Tab Selector */}
            <div className="flex items-center bg-white dark:bg-gray-900 rounded-lg p-1 shadow-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab("schedule")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  activeTab === "schedule"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                My Schedule
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  activeTab === "upcoming"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Upcoming meetings
              </button>
              <button
                onClick={() => setActiveTab("requested")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  activeTab === "requested"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Requested meetings
              </button>
            </div>

            {/* Request Meeting Button */}
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg whitespace-nowrap text-xs sm:text-sm flex-shrink-0"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Request Meeting</span>
              <span className="sm:hidden">Request</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "schedule" ? (
          loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            /* Calendar and Meetings Grid */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Left: Compact Calendar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Day Labels */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                      <div
                        key={idx}
                        className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 py-1"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      const hasMeetings = date && dateHasMeetings(date);
                      const today = date && isToday(date);
                      const selected = date && isSelectedDate(date);

                      return (
                        <button
                          key={index}
                          onClick={() => date && setSelectedDate(date)}
                          disabled={!date}
                          className={`
                            aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all
                            ${!date ? 'invisible' : ''}
                            ${hasMeetings && !selected ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50' : ''}
                            ${selected ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2 dark:ring-offset-gray-900' : ''}
                            ${!hasMeetings && !selected && date ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' : ''}
                            ${today && !selected ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''}
                            ${!date ? 'cursor-default' : 'cursor-pointer'}
                          `}
                        >
                          {date && date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-blue-700 dark:text-blue-300 font-medium text-xs">12</span>
                      </div>
                      <span>Has meetings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-medium text-xs">12</span>
                      </div>
                      <span>Selected date</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Meeting Details */}
              <div className="lg:col-span-2 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedDateMeetings.length} {selectedDateMeetings.length === 1 ? 'meeting' : 'meetings'} scheduled
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3">
                  {selectedDateMeetings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                      <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        No meetings scheduled
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Select a date with meetings to view details
                      </p>
                    </div>
                  ) : (
                    selectedDateMeetings.map((meeting) => {
                      const meetingDateTime = meeting.dateTime || meeting.requestedTime;
                      
                      return (
                        <div
                          key={meeting.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
                        >
                          {/* Meeting Header with Icon */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                {meeting.professorName}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                {meeting.reason}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full whitespace-nowrap">
                              Confirmed
                            </span>
                          </div>

                          {/* Meeting Details */}
                          <div className="space-y-2 pl-13">
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                              <span>
                                {new Date(meetingDateTime).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                              <span>
                                {new Date(meetingDateTime).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                  hour12: true
                                })}
                              </span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              {meeting.meetingType === 'online' ? (
                                <>
                                  <Video className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                  <div className="flex flex-col gap-1">
                                    <span className="text-gray-500 dark:text-gray-400">Online Meeting</span>
                                    {meeting.meetingLink && (
                                      <a
                                        href={meeting.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                      >
                                        {meeting.meetingLink}
                                      </a>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-gray-500 dark:text-gray-400">Venue</span>
                                    <span>{meeting.location || 'TBA'}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )
        ) : activeTab === "upcoming" ? (
          /* Upcoming Meetings Tab */
          <UpcomingMeetings meetings={meetings} loading={loading} />
        ) : (
          /* Requested Meetings Tab */
          <MeetingsRequested requests={requests} loading={loading} />
        )}
      </div>

      {/* Request Meeting Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Request a Meeting
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Professor Name
                </label>
                <input
                  type="text"
                  value={professorName || 'Professor'}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Office Hours Info */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">
                      Professor's Office Hours
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      {formatOfficeHours()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Meeting
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe the purpose of your meeting..."
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMeetingsUI;