import React, { useState } from "react";
import { Plus, ChevronRight, ChevronDown, Calendar, Trash2, Edit2, ExternalLink, FileText, Video, Link as LinkIcon, File } from "lucide-react";

const ResourcesUIProfessor = ({
  cohortId,
  resources,
  onCreateWeek,
  onUpdateWeek,
  onDeleteWeek,
  onCreateResource,
  onUpdateResource,
  onDeleteResource,
}) => {
  const [selectedWeek, setSelectedWeek] = useState(resources?.weeks?.[0] || null);
  const [showAddWeekModal, setShowAddWeekModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [editingWeek, setEditingWeek] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  const weeks = resources?.weeks || [];
  const stats = resources?.stats || { totalWeeks: 0, totalResources: 0 };

  const getResourceIcon = (type) => {
    switch (type) {
      case "slides":
        return <FileText size={16} className="text-blue-600" />;
      case "video":
        return <Video size={16} className="text-red-600" />;
      case "document":
        return <File size={16} className="text-green-600" />;
      case "link":
        return <LinkIcon size={16} className="text-purple-600" />;
      default:
        return <File size={16} className="text-gray-600" />;
    }
  };

  const handleAddWeek = async (weekData) => {
    const result = await onCreateWeek(weekData);
    if (result.success) {
      setShowAddWeekModal(false);
    }
    return result;
  };

  const handleUpdateWeek = async (weekId, weekData) => {
    const result = await onUpdateWeek(weekId, weekData);
    if (result.success) {
      setEditingWeek(null);
    }
    return result;
  };

  const handleAddResource = async (resourceData) => {
    if (!selectedWeek) return;
    const result = await onCreateResource(selectedWeek.id, resourceData);
    if (result.success) {
      setShowAddResourceModal(false);
    }
    return result;
  };

  const handleUpdateResource = async (resourceId, resourceData) => {
    const result = await onUpdateResource(resourceId, resourceData);
    if (result.success) {
      setEditingResource(null);
    }
    return result;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="max-w-7xl mx-auto px-4 pb-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Weekly Materials */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 dark:text-white">Weekly Materials</h2>
                  <button
                    onClick={() => setShowAddWeekModal(true)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Week
                  </button>
                </div>

                {/* Week List */}
                <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto">
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
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingWeek(week);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            title="Edit week"
                          >
                            <Edit2 size={14} className="text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Delete this week and all its resources?")) {
                                onDeleteWeek(week.id);
                              }
                            }}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                            title="Delete week"
                          >
                            <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {weeks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                    No weeks added yet. Click "Add Week" to get started.
                  </div>
                )}
              </div>

              {/* Stats */}
<div className="p-4 bg-white dark:bg-gray-800 flex items-center justify-around border-t border-gray-200 dark:border-gray-700">
  <div className="text-center">
    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalWeeks}</div>
    <div className="text-xs text-gray-600 dark:text-gray-400">Total Weeks</div>
  </div>
  <div className="text-center">
    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalResources}</div>
    <div className="text-xs text-gray-600 dark:text-gray-400">Total Resources</div>
  </div>
</div>
            </div>
          </div>

          {/* Right Content - Resources */}
          <div className="lg:col-span-8">
            {selectedWeek ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Week {selectedWeek.weekNumber}: {selectedWeek.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedWeek.dateRange}</p>
             </div>
           <button
           onClick={() => setShowAddResourceModal(true)}
           className="bg-blue-600 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1 lg:gap-2"
            >
      <Plus size={16} />
      <span className="hidden sm:inline">Add Resource</span>
      <span className="sm:hidden">Add</span>
    </button>
  </div>

  {/* Search Bar */}
  <div className="mt-4">
    <div className="relative">
      <input
        type="text"
        placeholder="Search resources by title, description, or link"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</div>

                {/* Resources List */}
                <div className="p-4">
                  {selectedWeek.resources && selectedWeek.resources.length > 0 ? (
                    <div className="space-y-3">
                      {selectedWeek.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">{getResourceIcon(resource.type)}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-white">{resource.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
                              <a
                               href={resource.url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-flex items-center gap-1 break-all"
>
  <LinkIcon size={14} className="flex-shrink-0" />
  <span className="break-all">{resource.url}</span>
</a>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingResource(resource)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <Edit2 size={16} className="text-gray-600 dark:text-gray-400" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Delete this resource?")) {
                                    onDeleteResource(resource.id);
                                  }
                                }}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/50 rounded"
                              >
                                <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                              </button>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <ExternalLink size={16} className="text-gray-600 dark:text-gray-400" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <File size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                      <p>No resources added yet</p>
                      <p className="text-sm mt-1">Click "Add Resource" to add materials for this week</p>
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

      {/* Add Week Modal */}
      {showAddWeekModal && (
        <WeekModal
          onClose={() => setShowAddWeekModal(false)}
          onSave={handleAddWeek}
          existingWeeks={weeks}
        />
      )}

      {/* Edit Week Modal */}
      {editingWeek && (
        <WeekModal
          onClose={() => setEditingWeek(null)}
          onSave={(data) => handleUpdateWeek(editingWeek.id, data)}
          week={editingWeek}
          existingWeeks={weeks}
        />
      )}

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <ResourceModal
          onClose={() => setShowAddResourceModal(false)}
          onSave={handleAddResource}
        />
      )}

      {/* Edit Resource Modal */}
      {editingResource && (
        <ResourceModal
          onClose={() => setEditingResource(null)}
          onSave={(data) => handleUpdateResource(editingResource.id, data)}
          resource={editingResource}
        />
      )}
    </div>
  );
};

// Week Modal Component
const WeekModal = ({ onClose, onSave, week = null, existingWeeks = [] }) => {
  const [formData, setFormData] = useState({
    weekNumber: week?.weekNumber || (existingWeeks.length + 1),
    title: week?.title || "",
    dateRange: week?.dateRange || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.title.trim()) {
      setError("Week title is required");
      return;
    }
    
    if (!formData.dateRange.trim()) {
      setError("Date range is required");
      return;
    }
    
    setSaving(true);
    try {
      const result = await onSave(formData);
      if (result && !result.success) {
        setError(result.error || "Failed to save week");
        setSaving(false);
      }
    } catch (err) {
      setError("An error occurred while saving");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6" style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{week ? "Edit Week" : "Add Week"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Week Number
            </label>
            <input
              type="number"
              value={formData.weekNumber}
              onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Week Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to Programming"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <input
              type="text"
              value={formData.dateRange}
              onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
              placeholder="e.g., Jan 15 - Jan 21"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Resource Modal Component
const ResourceModal = ({ onClose, onSave, resource = null }) => {
  const [formData, setFormData] = useState({
    title: resource?.title || "",
    description: resource?.description || "",
    type: resource?.type || "link",
    url: resource?.url || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.title.trim()) {
      setError("Resource title is required");
      return;
    }
    
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    
    if (!formData.url.trim()) {
      setError("URL is required");
      return;
    }
    
    // Basic URL validation
    try {
      new URL(formData.url);
    } catch {
      setError("Please enter a valid URL");
      return;
    }
    
    setSaving(true);
    try {
      const result = await onSave(formData);
      if (result && !result.success) {
        setError(result.error || "Failed to save resource");
        setSaving(false);
      }
    } catch (err) {
      setError("An error occurred while saving");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6" style={{ fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          {resource ? "Edit Resource" : "Add Resource"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Resource Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="slides">Slides</option>
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="link">Link</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Lecture Slides: Basic Concepts"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the resource"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourcesUIProfessor;
