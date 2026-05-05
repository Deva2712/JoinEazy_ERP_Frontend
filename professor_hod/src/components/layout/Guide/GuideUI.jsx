import React, { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, Search, Book, Users, MessageSquare, BarChart3, Settings, HelpCircle, Zap, Menu, X } from "lucide-react";
import HeaderController from "../Header/HeaderController";
import FooterController from "../Footer/FooterController";
import GuideBottomNavController from "./GuideBottomNavController";

const GuideUI = ({ guideData, onQuickAction }) => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showFAQ, setShowFAQ] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const quickActionsRef = useRef(null);
  const sidebarRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setShowQuickActions(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.closest('[data-sidebar-toggle]')) {
        setSidebarOpen(false);
      }
    };

    if (showQuickActions || sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQuickActions, sidebarOpen]);

  const toggleItemExpansion = (itemIndex) => {
    setExpandedItems(prev => {
      // If clicking on an already expanded item, close it
      if (prev[itemIndex]) {
        return {};
      }
      // Otherwise, close all others and open only this one
      return { [itemIndex]: true };
    });
  };

  const getSectionIcon = (sectionId) => {
    const iconMap = {
      "getting-started": Book,
      "course-management": Settings,
      "communication": MessageSquare,
      "course-details": BarChart3,
      "members-management": Users,
      "assignments": ChevronRight,
      "materials": Book,
      "data-management": Settings,
      "groups": Users,
      "course-info": BarChart3,
      "submissions-tab": ChevronDown
    };
    return iconMap[sectionId] || Book;
  };

  const filteredSections = guideData.sections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const filteredFAQs = guideData.faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    setShowFAQ(false);
    setSidebarOpen(false);
  };

  const handleFAQClick = () => {
    setShowFAQ(true);
    setSidebarOpen(false);
  };

  const handleExpandGuideClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative font-sans">
      <HeaderController />

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 pt-16" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="max-w-7xl mx-auto py-2 sm:py-4 px-2 sm:px-4 pb-24 lg:pb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl shadow-xl flex flex-col lg:flex-row overflow-hidden" style={{ minHeight: 'calc(100vh - 10rem)' }}>

          {/* Sidebar */}
          <div 
            ref={sidebarRef}
            className={`
              fixed lg:relative left-0 z-40
              w-80 max-w-[85vw] bg-gray-50 dark:bg-gray-800 
              border-r border-gray-200 dark:border-gray-700 
              flex flex-col
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
            style={{ 
              top: sidebarOpen ? '64px' : 'auto',
              height: sidebarOpen ? 'calc(100vh - 64px)' : 'auto',
              maxHeight: sidebarOpen ? 'calc(100vh - 64px)' : 'none'
            }}
          >
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{guideData.title}</h2>
                <div className="relative w-full sm:w-auto" ref={quickActionsRef}>
                  <button
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <Zap className="w-4 h-4" />
                    Quick Actions
                  </button>
                  
                  {/* Quick Actions Popup */}
                  {showQuickActions && (
                    <div className="fixed sm:absolute left-2 right-2 sm:left-auto sm:right-0 mt-2 sm:w-72 bg-white dark:bg-gray-700 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 z-50 overflow-hidden"
                      style={{
                        top: 'auto',
                        bottom: 'auto'
                      }}
                    >
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-3 max-h-96 overflow-y-auto">
                        {guideData.quickActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              onQuickAction?.(action.action);
                              setShowQuickActions(false);
                            }}
                            className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-center cursor-pointer group"
                            title={action.description}
                          >
                            <div className="text-2xl mb-1.5">{action.icon}</div>
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{action.title}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-3">
              <nav className="space-y-1 sm:space-y-1.5">
                {filteredSections.map((section) => {
                  const IconComponent = getSectionIcon(section.id);
                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-left rounded-lg transition-colors ${
                        activeSection === section.id && !showFAQ
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">{section.title}</span>
                      <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                        {section.items.length}
                      </span>
                    </button>
                  );
                })}
                
                <button
                  onClick={handleFAQClick}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-left rounded-lg transition-colors ${
                    showFAQ
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">FAQs</span>
                  <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                    {filteredFAQs.length}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {showFAQ ? "Frequently Asked Questions" : filteredSections.find(s => s.id === activeSection)?.title}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                {showFAQ ? "Find quick answers to common questions" : guideData.subtitle}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {showFAQ ? (
                <div className="space-y-2 sm:space-y-3">
                  {filteredFAQs.map((faq, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {filteredSections.find(s => s.id === activeSection)?.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex-1">{item.title}</h3>
                        <button
                          onClick={() => toggleItemExpansion(index)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
                        >
                          {expandedItems[index] ? <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                      
                      {expandedItems[index] && (
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-2.5 sm:p-3 mt-2">
                          <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-2">Steps to follow:</h4>
                          <ol className="space-y-1.5">
                            {item.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start gap-2 sm:gap-3">
                                <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs sm:text-sm font-medium flex items-center justify-center">
                                  {stepIndex + 1}
                                </span>
                                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - Below all content */}
      <div className="mt-4 sm:mt-6">
        <FooterController />
      </div>

      {/* Guide Bottom Navigation - Mobile Only */}
      <GuideBottomNavController onExpandGuideClick={handleExpandGuideClick} />
    </div>
  );
};

export default GuideUI;