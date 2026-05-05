import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Pin, Calendar, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { announcementsAPI } from '../services/api';

export default function LatestAnnouncementsPanel({ cohorts }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestAnnouncements();
  }, [cohorts]);

  const fetchLatestAnnouncements = async () => {
    if (!cohorts || cohorts.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cohortIds = cohorts.map(c => c.id);
      const response = await announcementsAPI.getLatestAnnouncements(cohortIds, 5);
      
      if (response.success) {
        // Map cohort info to announcements
        const announcementsWithCohort = response.data.map(announcement => {
          const cohort = cohorts.find(c => c.id === announcement.cohort_id);
          return {
            ...announcement,
            cohort_name: cohort?.title || cohort?.cohort_name || 'Unknown Course',
            cohort_code: cohort?.course_code || ''
          };
        });
        setAnnouncements(announcementsWithCohort);
      } else {
        setError(response.message || 'Failed to load announcements');
      }
    } catch (err) {
      console.error('Error fetching latest announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncementClick = (announcement) => {
    navigate(`/c/${announcement.cohort_id}/announcements`);
  };

  const getTagColor = (tag) => {
    const colors = {
      'Exam': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'Assignment': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'Urgent': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      'Event': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'General': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[tag] || colors['General'];
  };

  const getPriorityColor = (priority) => {
    if (!priority) return null;
    const colors = {
      'Critical': 'bg-red-500 text-white',
      'Important': 'bg-orange-500 text-white',
    };
    return colors[priority];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="text-blue-600 dark:text-blue-400" size={20} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Latest Announcements</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin text-blue-600" size={24} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="text-blue-600 dark:text-blue-400" size={20} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Latest Announcements</h3>
        </div>
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="text-blue-600 dark:text-blue-400" size={20} />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Latest Announcements</h3>
          </div>
          {announcements.length > 0 && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {announcements.length}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {announcements.length === 0 ? (
          <div className="text-center py-8">
            <Megaphone className="mx-auto mb-3 text-gray-400" size={40} />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No announcements yet
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Check back later for updates from your courses
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div
                key={`${announcement.cohort_id}-${announcement.id}`}
                onClick={() => handleAnnouncementClick(announcement)}
                className="group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all cursor-pointer bg-gray-50 dark:bg-gray-700/50"
              >
                {/* Course Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {announcement.cohort_code || announcement.cohort_name}
                  </span>
                  {announcement.is_pinned && (
                    <Pin size={12} className="text-blue-600 dark:text-blue-400 fill-current" />
                  )}
                  {announcement.priority && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {announcement.title}
                </h4>

                {/* Content Preview */}
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {announcement.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {announcement.tags?.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={12} />
                    <span>{formatDate(announcement.created_at)}</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer - View All */}
      {announcements.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <button
            onClick={() => navigate('/courses')}
            className="w-full text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            View all courses →
          </button>
        </div>
      )}
    </div>
  );
}
