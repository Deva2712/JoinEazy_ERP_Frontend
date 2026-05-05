import React, { useState } from "react";
import { Send, Clock, Calendar, AlertCircle, User } from "lucide-react";

const MeetingsRequested = ({ requests, loading }) => {
  const [expandedReasons, setExpandedReasons] = useState({});
  const [expandedDeclineReasons, setExpandedDeclineReasons] = useState({});

  const toggleReason = (requestId) => {
    setExpandedReasons(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  const toggleDeclineReason = (requestId) => {
    setExpandedDeclineReasons(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  // Filter out accepted meetings - they should appear in "My Schedule" tab
  const filteredRequests = requests.filter(request => request.status !== 'accepted');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <Send className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No meeting requests
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You haven't requested any meetings yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
            >
              {/* Request Header with Icon */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {request.professorName}
                  </h4>
                  {/* Reason with See More */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {expandedReasons[request.id] 
                      ? request.reason 
                      : request.reason.length > 50
                        ? `${request.reason.slice(0, 50)}... `
                        : request.reason}
                    {request.reason.length > 50 && (
                      <button
                        onClick={() => toggleReason(request.id)}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {expandedReasons[request.id] ? 'See less' : 'See more'}
                      </button>
                    )}
                  </p>
                </div>
              </div>

              {/* Request Details - Date and Time in Same Line */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span>
                      {new Date(request.requestedTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <span>
                      {new Date(request.requestedTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <span>Submitted:</span>
                  <span>
                    {new Date(request.submittedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              {/* Rejection Reason with See More - Fixed Height */}
              {request.status === 'rejected' && request.rejectionReason && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg min-h-[60px] flex items-start">
                  <div className="flex items-start gap-2 w-full">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-red-700 dark:text-red-400">
                        <span className="font-medium text-red-900 dark:text-red-300">Declined: </span>
                        {expandedDeclineReasons[request.id] 
                          ? request.rejectionReason 
                          : request.rejectionReason.length > 50
                            ? `${request.rejectionReason.slice(0, 50)}...`
                            : request.rejectionReason}
                        {' '}
                        {request.rejectionReason.length > 50 && (
                          <button
                            onClick={() => toggleDeclineReason(request.id)}
                            className="text-red-600 dark:text-red-400 hover:underline font-medium"
                          >
                            {expandedDeclineReasons[request.id] ? 'See less' : 'See more'}
                          </button>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Status Info - Fixed Height */}
              {request.status === 'pending' && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg min-h-[60px] flex items-center">
                  <div className="flex items-start gap-2 w-full">
                    <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                      Awaiting professor's response
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingsRequested;