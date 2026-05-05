import React, { useState } from "react";
import { FileText, Video, Link as LinkIcon, File, ExternalLink, Calendar, ChevronRight, ChevronDown } from "lucide-react";

const ResourcesUIStudent = ({ cohortId, resources }) => {
  const [selectedWeek, setSelectedWeek] = useState(resources?.weeks?.[0] || null);
  const [searchQuery, setSearchQuery] = useState("");

  const weeks = resources?.weeks || [];

  const getResourceIcon = (type) => {
    switch (type) {
      case "slides":
        return <FileText size={20} className="text-blue-600" />;
      case "video":
        return <Video size={20} className="text-red-600" />;
      case "document":
        return <File size={20} className="text-green-600" />;
      case "link":
        return <LinkIcon size={20} className="text-purple-600" />;
      default:
        return <File size={20} className="text-gray-600" />;
    }
  };

  const filteredResources = selectedWeek?.resources?.filter((resource) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      resource.url.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col font-sans">      
      <div className="max-w-7xl mx-auto px-4 pb-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Weekly Materials */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Materials</h2>

                {/* Week List */}
                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {weeks.map((week) => (
                    <div
                      key={week.id}
                      onClick={() => setSelectedWeek(week)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedWeek?.id === week.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 border-l-4 border-l-blue-500"
                          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar size={16} className={selectedWeek?.id === week.id ? "text-blue-600 dark:text-blue-400 flex-shrink-0" : "text-gray-500 dark:text-gray-400 flex-shrink-0"} />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Week {week.weekNumber}: {week.title}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{week.dateRange}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {week.totalResources || 0} {week.totalResources === 1 ? "resource" : "resources"}
                            </span>
                            {selectedWeek?.id === week.id ? (
                              <ChevronDown size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            ) : (
                              <ChevronRight size={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {weeks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    No materials available yet
                  </div>
                )}
              </div>

              {/* Footer Stats */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{weeks.length}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Weeks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {weeks.reduce((sum, week) => sum + (week.totalResources || 0), 0)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Resources</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Resources */}
          <div className="lg:col-span-8">
            {selectedWeek ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Week {selectedWeek.weekNumber}: {selectedWeek.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedWeek.dateRange}</p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search resources by title, description, or link"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Resources List */}
                <div className="p-4">
                  {filteredResources && filteredResources.length > 0 ? (
                    <div className="space-y-3">
                      {filteredResources.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">{getResourceIcon(resource.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400">
                                  {resource.title}
                                </h4>
                                <ExternalLink size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0 mt-1" />
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {resource.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded capitalize">
                                  {resource.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <File size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                      <p>No resources match your search</p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-blue-600 hover:underline text-sm mt-2"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <File size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                      <p>No resources available for this week yet</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <FileText size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-500 dark:text-gray-400">Select a week to view resources</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesUIStudent;
