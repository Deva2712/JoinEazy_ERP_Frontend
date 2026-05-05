import React, { useEffect, useRef } from "react";
import {
  Filter,
  ListFilter,
  Search,
  Plus,
  ChevronDown,
  Notebook,
} from "lucide-react";

const CohortNotesUI = ({
  notes,
  searchTerm,
  sortBy,
  showFilterMenu,
  onSearchChange,
  onSortChange,
  onFilterToggle,
  onCreateNote,
  onNoteClick,
  loading,
  error,
  onRetry,
}) => {
  const filterMenuRef = useRef(null);

  const sortOptions = [
    "Recently updated",
    "Latest first",
    "Oldest first",
    "Sorted (A-Z)",
    "Sorter (Z-A)",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
        if (showFilterMenu) {
          onFilterToggle();
        }
      }
    };

    // Add event listener when filter menu is open
    if (showFilterMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterMenu, onFilterToggle]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading notes...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-20">
        <div className="text-red-500 mb-4">Failed to load notes: {error}</div>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-5 sm:py-6 space-y-5 sm:space-y-6 pb-[72px] sm:pb-6 px-4">
      {/* First Row - Filter, Search, and Create Note */}
      <div className="flex items-center gap-3.5 sm:gap-4">
        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={onFilterToggle}
            className="w-[38px] h-[38px] bg-white border border-[#D3D6DA] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ListFilter size={18} className="text-black" />
          </button>

          {/* Filter Menu */}
          {showFilterMenu && (
            <div
              className="absolute top-12 left-0 bg-white border border-[#D3D6DA] rounded-xl shadow-2xl z-10 min-w-48"
              ref={filterMenuRef}
            >
              <div className="p-4">
                <div className="text-sm font-medium text-gray-700 mb-1.5">
                  Sort by
                </div>
                <div className="space-y-2.5">
                  {sortOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2.5 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        value={option}
                        checked={sortBy === option}
                        onChange={() => onSortChange(option)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700 select-none">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={17} className="text-gray-700" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for notes"
            className="w-full h-[38px] pl-10 pr-4 pt-[1px] bg-white border border-[#D3D6DA] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-[15px] placeholder-gray-700"
          />
        </div>

        {/* Create Note Button */}
        <button
          onClick={onCreateNote}
          className="ml-auto h-[38px] w-[38px] sm:w-auto sm:px-4 bg-[#1E61F0] text-sm text-white rounded-full items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors hidden sm:flex"
          style={{ backgroundColor: "rgb(30, 97, 240)" }}
        >
          <Notebook size={16} />
          <span className="font-medium pr-0.5">Create Note</span>
        </button>
      </div>

      {/* Notes Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-5 sm:gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-[20px] p-[16px] sm:p-[18px] border border-[#D3D6DA] cursor-pointer break-inside-avoid mb-5 sm:mb-6 block w-full"
            onClick={() => onNoteClick(note.id)}
          >
            {/* Note Title */}
            <h3 className="font-bold text-black text-[17px] line-clamp-1 mb-0.5">
              {note.title}
            </h3>

            {/* Last Updated */}
            <p className="text-[13px] font-arial font-medium text-black line-clamp-1">
              {note.lastUpdated}
            </p>

            {/* Horizontal Line */}
            <hr className="border-gray-200 my-2.5" />

            {/* Small container with light background */}
            {note.category && (
              <div
                className="flex flex-row items-center rounded-md px-2.5 h-8 mb-2.5"
                style={{
                  backgroundColor: note.colors?.background || "#e8daff",
                }}
              >
                <span
                  className="text-[12px] font-medium line-clamp-1"
                  style={{
                    color: note.colors?.text || "#6929c4",
                  }}
                >
                  {note.category}
                </span>
              </div>
            )}

            {/* Note Content with paragraph formatting and ellipsis */}
            <div className="text-black text-sm pr-1">
              {(() => {
                const paragraphs = note.content
                  .split("\n")
                  .filter((p) => p.trim());
                const maxLength = 250; // Adjust this value to control when ellipsis appears

                // Calculate total length including paragraph breaks
                let totalLength = 0;
                let displayParagraphs = [];
                let needsEllipsis = false;

                for (let i = 0; i < paragraphs.length; i++) {
                  const paragraph = paragraphs[i];
                  const paragraphLength = paragraph.length;

                  if (totalLength + paragraphLength <= maxLength) {
                    displayParagraphs.push(paragraph);
                    totalLength += paragraphLength;
                  } else {
                    // Check if we can fit part of this paragraph
                    const remainingSpace = maxLength - totalLength;
                    if (remainingSpace > 50) {
                      // Only truncate if we have reasonable space
                      const words = paragraph.split(" ");
                      let truncatedParagraph = "";

                      for (const word of words) {
                        if (
                          (truncatedParagraph + word).length <= remainingSpace
                        ) {
                          truncatedParagraph +=
                            (truncatedParagraph ? " " : "") + word;
                        } else {
                          break;
                        }
                      }

                      if (truncatedParagraph) {
                        displayParagraphs.push(truncatedParagraph);
                      }
                    }
                    needsEllipsis = true;
                    break;
                  }
                }

                // If we didn't use all paragraphs, we need ellipsis
                if (displayParagraphs.length < paragraphs.length) {
                  needsEllipsis = true;
                }

                return (
                  <>
                    {displayParagraphs.map((paragraph, index) =>
                      paragraph.trim() ? (
                        <p
                          key={index}
                          className="mb-3 last:mb-0.5 leading-normal"
                        >
                          {paragraph}
                          {needsEllipsis &&
                          index === displayParagraphs.length - 1
                            ? "..."
                            : ""}
                        </p>
                      ) : null,
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No notes found
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first note to get started"}
          </p>
        </div>
      )}

      {/* Floating Action Button - Only visible on small screens */}
      <button
        onClick={onCreateNote}
        className="fixed bottom-[92px] right-5 w-14 h-14 bg-[#1E61F0] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 sm:hidden z-50"
        style={{ backgroundColor: "rgb(30, 97, 240)" }}
      >
        <Notebook size={24} />
      </button>
    </div>
  );
};

export default CohortNotesUI;
