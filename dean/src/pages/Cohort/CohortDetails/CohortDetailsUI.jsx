import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Settings,
  Share2,
  Check,
  Edit,
  Calendar,
  UserPlus,
  Building2,
  Users,
  Badge,
  Inbox,
  StretchHorizontal,
  RefreshCw,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cohortAPI } from "../../../services/api";
import RichTextArea from "../../../components/RichTextArea";

const DetailsUI = ({
  cohortId,
  cohortData,
  detailsData,
  isStaff,
  handleSubSectionSave,
  handleSubSectionCreate,
  handleSubSectionDelete,
  quickDetails,
}) => {

  const [shareButtonState, setShareButtonState] = useState({
    text: "Share Page",
    icon: Share2,
    clicked: false,
  });

  const [cohortShareState, setCohortShareState] = useState({
    text: "Share",
    clicked: false,
  });

  const [containerShareStates, setContainerShareStates] = useState({});
  const [editingContainer, setEditingContainer] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [saveError, setSaveError] = useState("");

  // States for creating sections
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", content: "" });
  const [createError, setCreateError] = useState("");

  const bottomRef = useRef(null);
  const containerRefs = useRef({});

  // Add this state for quick detail share
  const [quickDetailShareState, setQuickDetailShareState] = useState({
    text: "Share this Page",
    clicked: false,
  });

  // State for tracking which cards are expanded
  const [expandedCards, setExpandedCards] = useState({});

  // State for Quick Details dropdown on mobile
  const [isQuickDetailsOpen, setIsQuickDetailsOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash.startsWith("block-")) {
        const containerId = hash.replace("block-", "");
        const containerRef = containerRefs.current[containerId];
        if (containerRef) {
          setTimeout(() => {
            containerRef.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 100);
        }
      }
    };

    // Handle hash on mount
    if (window.location.hash) {
      handleHashChange();
    }

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [detailsData]);

  const handleEditClick = (container) => {
    setEditingContainer(container.id);
    
    // Always populate the form with existing content so professor can edit it
    setEditForm({
      title: container.title,
      content: container.content.trim(),
    });
    
    setSaveError("");
  };

  const handleCancelEdit = () => {
    setEditingContainer(null);
    setEditForm({ title: "", content: "" });
    setSaveError("");
  };

  const handleSave = async () => {
    try {
      // Call the handleSubSectionSave function passed from controller
      const error = await handleSubSectionSave({
        id: editingContainer,
        title: editForm.title,
        content: editForm.content,
      });

      if (error) {
        setSaveError(error);
      } else {
        // Success - exit edit mode
        setEditingContainer(null);
        setEditForm({ title: "", content: "" });
        setSaveError("");
      }
    } catch (err) {
      setSaveError("An error occurred while saving");
    }
  };

  const handleNewSectionClick = () => {
    setIsCreatingSection(true);
    setCreateForm({
      title: "",
      content: "",
    });
    setCreateError("");
  };

  const handleCancelCreate = () => {
    setIsCreatingSection(false);
    setCreateForm({ title: "", content: "" });
    setCreateError("");
  };

  const handleCreate = async () => {
    try {
      // Call the handleSubSectionCreate function passed from controller
      const error = await handleSubSectionCreate({
        title: createForm.title,
        content: createForm.content,
      });

      if (error) {
        setCreateError(error);
      } else {
        // Success - exit create mode
        setIsCreatingSection(false);
        setCreateForm({ title: "", content: "" });
        setCreateError("");
      }
    } catch (err) {
      setCreateError("An error occurred while creating");
    }
  };

  const handleContainerShare = async (containerId) => {
    try {
      // Generate URL with container hash
      const baseUrl =
        window.location.origin +
        window.location.pathname +
        window.location.search;
      const containerUrl = `${baseUrl}#block-${containerId}`;

      await navigator.clipboard.writeText(containerUrl);
      setContainerShareStates((prev) => ({
        ...prev,
        [containerId]: {
          text: "Copied",
          clicked: true,
        },
      }));

      // Reset after 2 seconds
      setTimeout(() => {
        setContainerShareStates((prev) => ({
          ...prev,
          [containerId]: {
            text: "Share",
            clicked: false,
          },
        }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  // Move this function outside of renderQuickDetails
  const handleQuickDetailShare = async () => {
    try {
      // Generate invitation link from backend
      const response = await cohortAPI.generateInvitationLink(cohortId);
      
      console.log("Invitation link response:", response); // Debug log
      
      if (response.success) {
        const invitationUrl = response.data.invitationLink;
        
        // Rebuild URL to ensure correct host, using current origin
        let finalUrl = invitationUrl;
        try {
          // Support both absolute and relative invitation URLs
          const parsed = new URL(invitationUrl, window.location.origin);
          let token = parsed.searchParams.get('token');

          // If token is missing, try to extract via regex
          if (!token) {
            const match = /[?&]token=([^&]+)/.exec(invitationUrl);
            if (match && match[1]) token = match[1];
          }

          if (token) {
            // Always use current origin for the invitation URL
            finalUrl = `${window.location.origin}/c/${cohortId}/join?token=${token}`;
          } else {
            // If no token, use parsed path but keep current origin
            finalUrl = `${window.location.origin}${parsed.pathname}${parsed.search}`;
          }
        } catch (e) {
          // If parsing fails, keep original but prefix with current origin when relative
          if (invitationUrl.startsWith('http')) {
            // If it's an absolute URL, check if it's from our domain
            if (invitationUrl.includes(window.location.hostname)) {
              finalUrl = invitationUrl;
            } else {
              // If it's from a different domain, rebuild with current origin
              const url = new URL(invitationUrl);
              finalUrl = `${window.location.origin}${url.pathname}${url.search}`;
            }
          } else {
            finalUrl = `${window.location.origin}${invitationUrl}`;
          }
        }
        
        // Copy the invitation URL to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(finalUrl);
        } else {
          // Fallback method
          const textArea = document.createElement('textarea');
          textArea.value = finalUrl;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
          } catch (err) {
            console.error('Fallback copy failed:', err);
            return;
          } finally {
            document.body.removeChild(textArea);
          }
        }
        
        setQuickDetailShareState({
          text: "Copied to Clipboard",
          clicked: true,
        });

        setTimeout(() => {
          setQuickDetailShareState({
            text: "Share this Page",
            clicked: false,
          });
        }, 2000);
      } else {
        console.error("Failed to generate invitation link:", response.message);
        alert(`Failed to generate invitation link: ${response.message}`);
      }
    } catch (error) {
      console.error("Failed to copy link:", error);
      alert("Failed to generate invitation link. Please try again.");
    }
  };

  const handleCohortShare = async () => {
    try {
      // Copy the current page URL to clipboard
      await navigator.clipboard.writeText(window.location.href);
      setCohortShareState({
        text: "Copied",
        clicked: true,
      });

      // Reset after 2 seconds
      setTimeout(() => {
        setCohortShareState({
          text: "Share",
          clicked: false,
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handlePageRefresh = async () => {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const error = await handleSubSectionDelete(sectionId);
      if (error) {
        setSaveError(error);
      } else {
        setEditingContainer(null);
        setEditForm({ title: "", content: "" });
        setSaveError("");
      }
    } catch (error) {
      setSaveError("An unexpected error occurred while deleting the section.");
    }
  };

  const renderContainer = (container) => {
    const isEditing = editingContainer === container.id;

    if (isEditing) {
      // Edit mode - show input fields
      return (
        <div
          key={container.id}
          ref={(el) => {
            if (el) {
              containerRefs.current[container.id] = el;
            }
          }}
          id={`block-${container.id}`}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
        >
          {/* Title input */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
              Section Title
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Content textarea */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
              Section Content
            </label>
            <RichTextArea
              value={editForm.content}
              onChange={(e) =>
                setEditForm({ ...editForm, content: e.target.value })
              }
              placeholder={
                editingContainer === 1 
                  ? "Welcome to this course! This is where you can provide an overview of what students will learn and what to expect from this course."
                  : editingContainer === 2
                  ? "Provide a detailed description of the course content, learning objectives, and what students will gain from taking this course."
                  : editingContainer === 3
                  ? "List important resources, materials, tools, or references that students will need for this course."
                  : "Enter your content here..."
              }
              className="bg-gray-50 dark:bg-gray-700"
              style={{ minHeight: '150px' }}
            />
          </div>

          {/* Error message */}
          {saveError && (
            <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-xs">{saveError}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
            >
              Cancel
            </button>
            {isStaff && (
              <button
                onClick={() => handleDeleteSection(editingContainer)}
                className="px-4 py-1.5 text-white text-sm bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-white text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all font-medium"
            >
              Save
            </button>
          </div>
        </div>
      );
    }

    // Display mode - show content with edit button
    const paragraphs = container.content
      .trim()
      .split(/\n\s*\n/)
      .filter((paragraph) => paragraph.trim().length > 0);

    const isExpanded = expandedCards[container.id];
    const contentLength = container.content.trim().length;
    const hasLongContent = contentLength > 400; // Show "See More" if content is longer than 400 chars

    return (
      <div
        key={container.id}
        ref={(el) => {
          if (el) {
            containerRefs.current[container.id] = el;
          }
        }}
        id={`block-${container.id}`}
        className="border-b border-gray-200 dark:border-gray-700 py-4 first:pt-0 last:border-b-0 last:pb-0"
      >
                  <div className="flex justify-between items-center mb-2.5">
          <div className="flex-1 pr-4">
            <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 leading-snug">
              {container.title}
            </h4>
          </div>

          <div className="flex items-start gap-3 font-arial">
            {/* Edit button - show only for professors */}
            {isStaff && (
              <button
                onClick={() => handleEditClick(container)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                style={{
                  flexShrink: 0,
                }}
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        <div className="font-normal text-gray-700 dark:text-gray-100">
          <div 
            className={`prose prose-sm max-w-none dark:prose-invert ${!isExpanded && hasLongContent ? "line-clamp-3" : ""}`}
            dangerouslySetInnerHTML={{ __html: container.content }}
            style={{
              lineHeight: "1",
              whiteSpace: "pre-line",
            }}
          />

          {/* See More / See Less button */}
          {hasLongContent && (
            <button
              onClick={() =>
                setExpandedCards((prev) => {
                  // If clicking on an already expanded section, close it
                  if (prev[container.id]) {
                    return {};
                  }
                  // Otherwise, close all others and open only this one
                  return { [container.id]: true };
                })
              }
              className="mt-3 inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors"
            >
              {isExpanded ? (
                <>
                  See Less
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  See  More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderCreateSection = () => {
    if (!isCreatingSection) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 w-full max-w-md max-h-[90vh] overflow-y-auto border dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Create New Section</h2>
            <button
              onClick={handleCancelCreate}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Error message */}
          {createError && (
            <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-xs font-medium">{createError}</p>
            </div>
          )}

          <form className="space-y-2.5">
            {/* Title input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm({ ...createForm, title: e.target.value })
                }
                placeholder="Enter section title"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Content textarea */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content *
              </label>
              <RichTextArea
                value={createForm.content}
                onChange={(e) =>
                  setCreateForm({ ...createForm, content: e.target.value })
                }
                placeholder="Enter section content"
                className="bg-white dark:bg-gray-700"
                style={{ minHeight: '120px' }}
                required
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancelCreate}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Create Section
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      Calendar,
      UserPlus,
      Building2,
      Users,
      Share2,
      Badge,
    };
    return iconMap[iconName] || Share2;
  };

  const ShareIcon = shareButtonState.icon;

  const renderQuickDetails = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm w-full h-fit">
        <h3 className="text-xs font-bold mb-2.5 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          Quick Details
        </h3>

        <div className="space-y-1.5">
          {quickDetails?.map((detail) => {
            const IconComponent = getIconComponent(detail.icon);

            if (detail.isShareable) {
              return (
                <button
                  key={detail.id}
                  onClick={handleQuickDetailShare}
                  className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <IconComponent
                    size={16}
                    className={quickDetailShareState.clicked ? "text-green-600" : "text-blue-600 dark:text-blue-400"}
                  />
                  <span
                    className={`text-xs font-medium ${
                      quickDetailShareState.clicked
                        ? "text-green-600"
                        : "text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {quickDetailShareState.clicked
                      ? "Copied to Clipboard"
                      : detail.text}
                  </span>
                </button>
              );
            }

            return (
              <div key={detail.id} className="flex items-center gap-2 px-2 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <IconComponent
                  size={14}
                  className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {detail.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEmptyState = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center">
          <Inbox size={40} className="text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nothing Here</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mx-auto leading-relaxed">
          This section is currently empty. Content will appear here once it's
          added to this page
        </p>
      </div>
    );
  };

  return (
    <div className="px-3 sm:px-4 pb-20 md:pb-4">
      {/* Two column layout with consistent alignment */}
      <div className="flex gap-3 flex-col lg:flex-row items-start">
        {/* Left Section - Unified Content Area */}
        <div className="flex-1 w-full lg:w-auto">
          {/* Quick Details Dropdown - Mobile Only */}
          <div className="lg:hidden mb-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Dropdown Header */}
              <button
                onClick={() => setIsQuickDetailsOpen(!isQuickDetailsOpen)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Quick Details
                </h3>
                {isQuickDetailsOpen ? (
                  <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {/* Dropdown Content */}
              {isQuickDetailsOpen && (
                <div className="px-4 pb-4 space-y-1.5 border-t border-gray-200 dark:border-gray-700 pt-3">
                  {quickDetails?.map((detail) => {
                    const IconComponent = getIconComponent(detail.icon);

                    if (detail.isShareable) {
                      return (
                        <button
                          key={detail.id}
                          onClick={handleQuickDetailShare}
                          className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <IconComponent
                            size={16}
                            className={quickDetailShareState.clicked ? "text-green-600" : "text-blue-600 dark:text-blue-400"}
                          />
                          <span
                            className={`text-xs font-medium ${
                              quickDetailShareState.clicked
                                ? "text-green-600"
                                : "text-blue-700 dark:text-blue-300"
                            }`}
                          >
                            {quickDetailShareState.clicked
                              ? "Copied to Clipboard"
                              : detail.text}
                          </span>
                        </button>
                      );
                    }

                    return (
                      <div key={detail.id} className="flex items-center gap-2 px-2 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                        <IconComponent
                          size={14}
                          className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {detail.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-5">
            {/* Show empty state if no containers exist, otherwise show containers */}
            {(!detailsData?.containers || detailsData.containers.length === 0) &&
            !isCreatingSection ? (
              renderEmptyState()
            ) : (
              <>
                {detailsData?.containers?.map((container) =>
                  renderContainer(container),
                )}
              </>
            )}

            {/* Render create section form */}
            {renderCreateSection()}

            {/* Bottom ref for scrolling */}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Right Section - Action Buttons and Quick Details - Desktop Only */}
        <div className="hidden lg:flex flex-col gap-3 w-full lg:w-[280px] xl:w-[300px] flex-shrink-0 sticky top-4 self-start">
          {/* If professor, show New Section first, then Quick Details. Otherwise only Quick Details */}
          {isStaff ? (
            <>
              {/* New Section Card - Only show for professors */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 shadow-lg">
                <div className="flex flex-col gap-2.5">
                  {/* Header with icon */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    <h4 className="text-sm font-semibold text-white">Create New Section</h4>
                  </div>
                  
                  {/* Subtitle */}
                  <p className="text-xs text-blue-100 leading-snug">
                    Add new sections to organize your course content
                  </p>
                  
                  {/* Button */}
                  <button
                    onClick={handleNewSectionClick}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-blue-600 bg-white hover:bg-blue-50 rounded-lg transition-all shadow-sm hover:shadow-md"
                  >
                    <Plus size={16} className="text-blue-600" />
                    New Section
                  </button>
                </div>
              </div>

              {/* Quick Details Container */}
              {renderQuickDetails()}
            </>
          ) : (
            <>
              {/* Quick Details Container */}
              {renderQuickDetails()}
            </>
          )}
        </div>
      </div>

      {isStaff && (
        <button
          onClick={handleNewSectionClick}
          className="fixed bottom-[92px] md:bottom-5 right-5 bg-[#1E61F0] text-white rounded-full flex items-center justify-center gap-2 px-4 py-3 shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 lg:hidden z-50"
          style={{ backgroundColor: "rgb(30, 97, 240)" }}
        >
          <Plus size={20} />
          <span className="font-semibold text-sm whitespace-nowrap">New Section</span>
        </button>
      )}
    </div>
  );
};

export default DetailsUI;
