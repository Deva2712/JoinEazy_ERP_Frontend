import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import { logoutUser } from "../../services/auth";
import {
  Plus,
  HelpCircle,
  Users,
  FileText,
  Building2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Bell,
  MoreVertical,
  Archive,
  Search,
  Filter,
  Menu,
  X,
  BookMarked
} from "lucide-react";

export default function DashboardUI({
  user_type,
  cohorts,
  supportLink,
  statsData,
  statsCards,
  loading,
  error,
  onRetry,
}) {
  const navigate = useNavigate();
  const [expandedTodo, setExpandedTodo] = useState(null);
  const [descriptionModal, setDescriptionModal] = useState(null);
  const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);

  // Get user data and todo assignments from props
  const userData = statsData?.user || {
    name: "Demo Student",
    rollNumber: "student123",
    organization: "Mahindra University",
  };

  const todoAssignments = statsData?.todoAssignments || [];
  const meetings = statsData?.meetings || [
    // Demo meetings for testing
    {
      id: 'meeting-1',
      cohortId: cohorts?.[0]?.id,
      title: 'Introduction to Web Development',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      duration: 60,
    },
    {
      id: 'meeting-2',
      cohortId: cohorts?.[0]?.id,
      title: 'JavaScript Fundamentals',
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      duration: 90,
    },
    {
      id: 'meeting-3',
      cohortId: cohorts?.[1]?.id,
      title: 'React Basics Workshop',
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      duration: 120,
    },
    {
      id: 'meeting-4',
      cohortId: cohorts?.[1]?.id,
      title: 'Advanced React Patterns',
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      duration: 90,
    },
  ];
  
  console.log('📋 Todo Assignments in DashboardUI:', todoAssignments);
  console.log('📚 Cohorts in DashboardUI:', cohorts);
  console.log('📅 Meetings in DashboardUI:', meetings);

  // Filter only active courses (not archived)
  const activeCohorts = cohorts?.filter(cohort => cohort.status !== "Archived") || [];

  // Filter assignments due within a week
  const assignmentsDueThisWeek = todoAssignments?.filter(assignment => {
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays < 8;
  }) || [];

  const handleCreateCohort = () => {
    navigate("/create");
  };

  const handleRequestPermission = () => {
    window.location.href = supportLink;
  };

  const handleCardClick = (cohortId) => {
    navigate(`/c/${cohortId}/details`);
  };

  const handleLogout = async () => {
    console.log("Logout clicked");
    
    // Clear the role
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    // Call the actual logout API
    const result = await logoutUser();
    
    if (result.success) {
      // Redirect to login
      navigate("/login");
    } else {
      // Even if API fails, clear local data and redirect
      navigate("/login");
    }
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleArchivedCourses = () => {
    navigate("/archived-courses");
  };

  const openAssignmentsModal = () => {
    setShowAssignmentsModal(true);
  };

  const closeAssignmentsModal = () => {
    setShowAssignmentsModal(false);
  };

  const toggleTodo = (id) => {
    setExpandedTodo(expandedTodo === id ? null : id);
  };

  const openDescriptionModal = (description) => {
    setDescriptionModal(description);
  };

  const closeDescriptionModal = () => {
    setDescriptionModal(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    return `Due in ${diffDays} days`;
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(start.setMonth(start.getMonth() + 4));
    
    const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString('en-US', formatOptions)} — ${end.toLocaleDateString('en-US', formatOptions)}`;
  };

  // Get upcoming meetings count for a cohort
  const getUpcomingMeetingsCount = (cohortId) => {
    const now = new Date();
    return meetings?.filter(meeting => {
      if (meeting.cohortId !== cohortId) return false;
      const meetingDate = new Date(meeting.scheduledAt || meeting.startTime);
      return meetingDate >= now;
    }).length || 0;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen" style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <HeaderController />
        <main className="mx-auto px-4 py-5 lg:py-6 xl:py-8 pb-24 md:pb-5" style={{ maxWidth: "72rem" }}>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading dashboard...</span>
            </div>
          </div>
        </main>
        <BottomNavController />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen" style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <HeaderController />
        <main className="mx-auto px-4 py-5 lg:py-6 xl:py-8 pb-24 md:pb-5" style={{ maxWidth: "72rem" }}>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <BottomNavController />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen" style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <HeaderController />

      {/* Main Content */}
      <main className="px-4 py-5 lg:py-6 xl:py-8 pb-24 md:pb-5 max-w-7xl mx-auto w-full">
        {/* Welcome Banner */}
        <div className="mb-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left Side - Welcome Message */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">
                Hey {userData.name.split(' ').slice(0, ['Dr.', 'Prof.', 'Mr.', 'Mrs.', 'Ms.'].includes(userData.name.split(' ')[0]) ? 2 : 1).join(' ')},{' '}
                <span className="whitespace-nowrap">welcome back! 👋</span>
              </h2>
            </div>

            {/* Right Side - Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:min-w-[680px]">
            {/* Organization */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 py-5 md:py-4">
                    <p className="text-white/80 text-xs font-medium mb-1">Organization</p>
                    <p className="text-sm font-bold leading-tight">
                      {userData.organization?.replace(' University', '\nUniversity')}
                    </p>
                  </div>
                </div>
              </div>

            {/* Active Courses */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-lg flex items-center justify-center">
                    <BookMarked className="w-6 h-6" />
                  </div>
                  <div className="mt-4">
                    <p className="text-white/80 text-xs font-medium mb-1">Active Courses</p>
                    <p className="text-3xl font-bold">{activeCohorts?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Pending Assignments */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/80 text-xs font-medium mb-1">Total Pending Assignments</p>
                    <p className="text-3xl font-bold">{todoAssignments?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines - Clickable */}
              <div 
                onClick={assignmentsDueThisWeek.length > 0 ? openAssignmentsModal : undefined}
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 ${
                  assignmentsDueThisWeek.length > 0 ? 'cursor-pointer hover:bg-white/20 transition-all' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/80 text-xs font-medium mb-1">Assignments due This Week</p>
                    <p className="text-3xl font-bold">{assignmentsDueThisWeek.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header with Archive Button */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BookMarked className="w-6 h-6" />
            My Courses
          </h1>
          
          <button
            onClick={handleArchivedCourses}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            <Archive className="w-5 h-5" />
            <span>Archived Courses</span>
          </button>
        </div>

        {/* Cohort Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {activeCohorts?.length > 0 ? (
            activeCohorts.map((cohort) => {
              const upcomingMeetings = getUpcomingMeetingsCount(cohort.id);
              
              return (
                <div
                  key={cohort.id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 flex flex-col"
                >
                  {/* Card Header - FIXED HEIGHT with Course Duration */}
                  <div className="p-3 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900"
                    style={{
                    minHeight: "90px",
                    maxHeight: "90px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                     }}
                  >
                    {/* Title with 2-line clamp */}
                    <h3 
                      className="text-base font-semibold text-white mb-2" 
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.3',
                      }}
                      title={cohort.title}
                    >
                      {cohort.title}
                    </h3>
                    
                    {/* Duration and Meetings at bottom of blue section */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <Clock className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
                        <span className="text-xs text-white/90 font-medium truncate">
                          {cohort.startDate && cohort.endDate 
                            ? formatDateRange(cohort.startDate, cohort.endDate)
                            : formatDateRange(cohort.createdAt, null)
                          }
                        </span>
                      </div>
                      
                      {/* Upcoming Meetings Count - Clickable */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (upcomingMeetings > 0) {
                            navigate(`/c/${cohort.id}/my-meetings`);
                          }
                        }}
                        className={`flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-md flex-shrink-0 ${
                          upcomingMeetings > 0 ? 'cursor-pointer hover:bg-white/30 transition-all' : ''
                        }`}
                        title={upcomingMeetings > 0 ? 'Click to view meetings for this course' : 'No upcoming meetings'}
                      >
                        <Calendar className="w-3.5 h-3.5 text-white/90" />
                        <span className="text-xs text-white/90 font-semibold">
                          {upcomingMeetings}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body - Stats */}
                  <div className="px-3 py-3 flex-1">
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Total Due */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-medium text-blue-900 dark:text-blue-300">Total assignments Due</span>
                        </div>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                          {todoAssignments?.filter(a => a.cohortId === cohort.id).length || 0}
                        </p>
                      </div>
                      
                      {/* This Week */}
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span className="text-xs font-medium text-indigo-900 dark:text-indigo-300">Assignments Due This Week</span>
                        </div>
                        <p className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                          {todoAssignments?.filter(a => {
                            if (a.cohortId !== cohort.id) return false;
                            const dueDate = new Date(a.dueDate);
                            const today = new Date();
                            const diffTime = dueDate - today;
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            return diffDays >= 0 && diffDays < 8;
                          }).length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Buttons */}
                  <div className="px-3 pb-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/c/${cohort.id}/assignments`)}
                        className="flex-1 px-3 py-2 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-1.5"
                        style={{ 
                          backgroundColor: "#f8f9fa",
                          color: "#5f6368",
                          border: "1px solid #e0e0e0",
                          cursor: "pointer",
                        }}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Assignments
                      </button>
                      <button
                        onClick={() => handleCardClick(cohort.id)}
                        className="flex-1 px-3 py-2 rounded-lg font-medium transition-all text-sm"
                        style={{ 
                          backgroundColor: "#1967d2",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No active courses
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your active courses will appear here
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Description Modal */}
      {descriptionModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeDescriptionModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Description</h3>
              <button
                onClick={closeDescriptionModal}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{descriptionModal}</p>
            <button
              onClick={closeDescriptionModal}
              className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* All Assignments Modal */}
      {showAssignmentsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeAssignmentsModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Assignments Due This Week</h3>
                <button
                  onClick={closeAssignmentsModal}
                  className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-6">
              {assignmentsDueThisWeek?.length > 0 ? (
                <div className="space-y-3">
                  {[...assignmentsDueThisWeek]
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .map((assignment) => {
                      const dueDate = new Date(assignment.dueDate);
                      const today = new Date();
                      const diffTime = dueDate - today;
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      
                      let statusColor = "bg-gray-50 border-gray-200";
                      let statusTextColor = "text-gray-700";
                      let statusText = formatDate(assignment.dueDate);
                      
                      if (diffDays === 0) {
                        statusColor = "bg-orange-50 border-orange-200";
                        statusTextColor = "text-orange-700";
                      } else if (diffDays <= 3) {
                        statusColor = "bg-yellow-50 border-yellow-200";
                        statusTextColor = "text-yellow-700";
                      }

                      return (
                        <div
                          key={assignment.id}
                          className={`${statusColor} border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-700/50 dark:border-gray-600`}
                          onClick={() => {
                            closeAssignmentsModal();
                            navigate(`/c/${assignment.cohortId}/assignments`);
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {assignment.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                {assignment.courseName}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>
                                    {dueDate.toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <div className={`${statusTextColor} font-semibold text-sm text-right`}>
                                {statusText}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 text-right">
                                {diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `${diffDays} days left`}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No assignments due this week</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNavController />
      
      {/* Footer - Below all content */}
      <FooterController />
    </div>
  );
}
