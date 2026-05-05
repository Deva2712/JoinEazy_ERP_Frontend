import React, { useState, useEffect } from "react";
import CohortNotesCreateUI from "./CohortNotesCreateUI";

const CohortNotesCreateController = ({ isOpen, onClose, cohortId }) => {
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [createError, setCreateError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tagStyle, setTagStyle] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [noteId, setNoteId] = useState(null);

  const colorCombinations = [
    { background: "#e8daff", text: "#6929c4" },
    { background: "#bae6ff", text: "#00539a" },
    { background: "#a7f0ba", text: "#0e6027" },
    { background: "#dde1e6", text: "#121619" },
    { background: "#9ef0f0", text: "#005d5d" },
  ];

  const getRandomColorCombination = () => {
    return colorCombinations[
      Math.floor(Math.random() * colorCombinations.length)
    ];
  };

  // Check if we're in edit mode and fetch note data
  useEffect(() => {
    if (isOpen) {
      const urlParts = window.location.pathname.split("/");
      const lastPart = urlParts[urlParts.length - 1];

      // Check if the last part is a number (note ID) and not "create"
      if (!isNaN(lastPart) && lastPart !== "" && lastPart !== "create") {
        setIsEditMode(true);
        setNoteId(lastPart);

        // Simulate fetching note data - replace with actual API call
        const mockEditNote = {
          id: parseInt(lastPart),
          title: "Sample Note Title",
          content:
            "This is the content of the note being edited. It contains multiple paragraphs and detailed information.\n\nThis is another paragraph with more content to demonstrate the editing functionality.",
          category: "Sample Category",
          createdOn: "Dec 15, 2024 at 2:30 PM",
          lastUpdated: "Dec 20, 2024 at 4:45 PM",
        };

        setNoteData(mockEditNote);

        // Apply tag styling if category exists
        if (mockEditNote.category) {
          const randomColors = getRandomColorCombination();
          setTagStyle({
            backgroundColor: randomColors.background,
            color: randomColors.text,
            border: `1px solid ${randomColors.text}20`,
            padding: "5px 8px",
            marginTop: "2px",
            borderRadius: "6px",
          });
        }
      } else {
        // Reset to create mode
        setIsEditMode(false);
        setNoteId(null);

        // Check for URL tag parameter before resetting
        const urlParams = new URLSearchParams(window.location.search);
        const tagParam = urlParams.get("tag");

        if (tagParam) {
          // Preserve tag from URL parameter
          setNoteData({
            title: "",
            content: "",
            category: tagParam,
          });

          // Apply tag styling for pre-filled tag from URL
          const randomColors = getRandomColorCombination();
          setTagStyle({
            backgroundColor: randomColors.background,
            color: randomColors.text,
            border: `1px solid ${randomColors.text}20`,
            padding: "5px 8px",
            marginTop: "2px",
            borderRadius: "6px",
          });
        } else {
          // Reset form data for create mode without tag
          setNoteData({
            title: "",
            content: "",
            category: "",
          });
          setTagStyle({});
        }
      }
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    if (field === "categoryBlur") {
      // Handle blur event for context tag
      if (noteData.category.trim()) {
        const randomColors = getRandomColorCombination();
        setTagStyle({
          backgroundColor: randomColors.background,
          color: randomColors.text,
          border: `1px solid ${randomColors.text}20`,
          padding: "5px 8px",
          marginTop: "2px",
          borderRadius: "6px",
        });
      } else {
        setTagStyle({});
      }
      return;
    }

    setNoteData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear tag styling when user starts typing in category field
    if (field === "category") {
      setTagStyle({});
    }

    // Clear error when user starts typing
    if (createError) {
      setCreateError("");
    }
  };

  const handleCreate = async () => {
    // Validation
    if (!noteData.title.trim()) {
      setCreateError("Please enter a title for your note");
      return;
    }

    if (!noteData.content.trim()) {
      setCreateError("Please enter some content for your note");
      return;
    }

    setIsLoading(true);
    setCreateError("");

    // Simulate API call - replace with actual implementation
    setTimeout(() => {
      setIsLoading(false);
      if (isEditMode) {
        setCreateError("Failed to update note. Please try again.");
      } else {
        setCreateError("Failed to create note. Please try again.");
      }
    }, 1000);
  };

  const handleCancel = () => {
    // Reset form data
    setNoteData({
      title: "",
      content: "",
      category: "",
    });
    setCreateError("");
    setTagStyle({});
    setIsEditMode(false);
    setNoteId(null);
    onClose();
  };

  return (
    <CohortNotesCreateUI
      isOpen={isOpen}
      onClose={onClose}
      noteData={noteData}
      onInputChange={handleInputChange}
      onCreate={handleCreate}
      onCancel={handleCancel}
      createError={createError}
      isLoading={isLoading}
      tagStyle={tagStyle}
      isEditMode={isEditMode}
    />
  );
};

export default CohortNotesCreateController;
