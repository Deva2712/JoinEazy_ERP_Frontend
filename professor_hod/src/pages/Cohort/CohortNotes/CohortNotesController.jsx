import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CohortNotesUI from "./CohortNotesUI";
import CohortNotesCreateController from "./CohortNotesCreateController";

const CohortNotesController = ({ cohortId, cohortData }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Recently updated");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const colorCombinations = [
    { background: "#e8daff", text: "#6929c4" },
    { background: "#bae6ff", text: "#00539a" },
    { background: "#a7f0ba", text: "#0e6027" },
    { background: "#dde1e6", text: "#121619" },
    { background: "#9ef0f0", text: "#005d5d" },
  ];

  // Check if we should show create modal based on URL
  useEffect(() => {
    const isCreateRoute = location.pathname.endsWith("/create");

    // Check for edit route - ensure it's a number at the end, not "create"
    const urlParts = location.pathname.split("/");
    const lastPart = urlParts[urlParts.length - 1];
    const isEditRoute =
      !isNaN(lastPart) && lastPart !== "" && lastPart !== "create";

    setShowCreateModal(isCreateRoute || isEditRoute);
  }, [location.pathname]);

  // Function to get random color combination
  const getRandomColorCombination = () => {
    return colorCombinations[
      Math.floor(Math.random() * colorCombinations.length)
    ];
  };

  // State for API data loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch notes data
  const fetchNotesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to get notes
      const response = await cohortAPI.getNotes(cohortId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch notes');
      }
      
      // Process the notes data - add random colors
      const notesWithColors = response.data.map(note => ({
        ...note,
        colors: getRandomColorCombination()
      }));
      
      // Set the notes data
      setNotes(notesWithColors);
      setFilteredNotes(notesWithColors);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err.message || 'Failed to load notes');
      setLoading(false);
      
      // Fallback to mock data in case of error
      const notesWithColors = mockNotes.map(note => ({
        ...note,
        colors: note.colors || getRandomColorCombination()
      }));
      
      setNotes(notesWithColors);
      setFilteredNotes(notesWithColors);
    }
  };

  // Function to retry fetching data
  const handleRetry = () => {
    fetchNotesData();
  };

  // Fetch notes when component mounts or cohortId changes
  useEffect(() => {
    if (cohortId) {
      fetchNotesData();
    }
  }, [cohortId]);

  // Mock data for notes - fallback data
  const mockNotes = [
    {
      id: 1,
      title: "Introduction to React",
      content:
        "This note covers the basics of React components, state management, and props. It's essential for understanding how to build modern web applications.\n\nReact uses a component-based architecture where each component manages its own state. This makes applications more modular and easier to maintain.\n\nKey concepts include:\n- JSX syntax\n- Component lifecycle\n- Props and state\n- Event handling",
      lastUpdated: "21st June",
      category: "Group 21",
      colors: getRandomColorCombination(),
    },
    {
      id: 2,
      title: "JavaScript ES6 Features",
      content:
        "Arrow functions, destructuring, template literals, and other ES6 features that make JavaScript development more efficient and readable.\n\nArrow functions provide a concise way to write functions:\nconst add = (a, b) => a + b;\n\nDestructuring allows you to extract values from arrays and objects:\nconst {name, age} = person;",
      lastUpdated: "5 hours ago",
      category: "Meeting 10th July",
      colors: getRandomColorCombination(),
    },
    {
      id: 3,
      title: "CSS Grid Layout",
      content:
        "Understanding CSS Grid for creating complex layouts. This covers grid containers, grid items, and responsive design patterns.\n\nCSS Grid is a two-dimensional layout system that allows you to create complex layouts with ease.",
      lastUpdated: "3 days ago",
      category: "Chatur Varma Inampudi • SE22UARI034",
      colors: getRandomColorCombination(),
    },
    {
      id: 4,
      title: "Node.js Fundamentals",
      content:
        "Server-side JavaScript with Node.js. Covers modules, npm, express framework, and building REST APIs.\n\nNode.js allows you to run JavaScript on the server side, making it possible to build full-stack applications with a single language.",
      lastUpdated: "23rd May",
      category: "Backend",
      colors: getRandomColorCombination(),
    },
    {
      id: 5,
      title: "Database Design Principles",
      content:
        "Relational database design, normalization, indexing, and best practices for efficient data storage and retrieval.\n\nNormalization is the process of organizing data in a database to reduce redundancy and improve data integrity.\n\nFirst Normal Form (1NF):\n- Each table cell should contain a single value\n- Each record needs to be unique",
      lastUpdated: "7th Jan",
      category: "Database Error Notes",
      colors: getRandomColorCombination(),
    },
  ];

  useEffect(() => {
    setNotes(mockNotes);
    setFilteredNotes(mockNotes);
  }, []);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSortChange = (option) => {
    setSortBy(option);
    setShowFilterMenu(false);
  };

  const handleFilterToggle = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  const handleCreateNote = () => {
    const currentPath = location.pathname;
    const createPath = currentPath.endsWith("/")
      ? `${currentPath}create`
      : `${currentPath}/create`;
    navigate(createPath);
  };

  const handleCloseCreateModal = () => {
    const currentPath = location.pathname;

    // First set modal to false to immediately hide it
    setShowCreateModal(false);

    if (currentPath.endsWith("/create")) {
      // Handle create route
      const parentPath = currentPath.replace("/create", "");
      navigate(parentPath, { replace: true });
    } else {
      // Handle edit route (note ID at the end)
      const urlParts = currentPath.split("/");
      const lastPart = urlParts[urlParts.length - 1];

      // Check if the last part is a number (note ID)
      if (!isNaN(lastPart) && lastPart !== "" && lastPart !== "create") {
        // Remove the note ID from the URL to go back to notes list
        const parentPath = urlParts.slice(0, -1).join("/");
        navigate(parentPath, { replace: true });
      } else {
        // Fallback: navigate to current path without the last segment
        const fallbackPath = urlParts.slice(0, -1).join("/") || currentPath;
        navigate(fallbackPath, { replace: true });
      }
    }
  };

  const handleNoteClick = (noteId) => {
    const currentPath = location.pathname;
    const editPath = currentPath.endsWith("/")
      ? `${currentPath}${noteId}`
      : `${currentPath}/${noteId}`;
    navigate(editPath);
  };

  return (
    <>
      <CohortNotesUI
        notes={filteredNotes}
        searchTerm={searchTerm}
        sortBy={sortBy}
        showFilterMenu={showFilterMenu}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onFilterToggle={handleFilterToggle}
        onCreateNote={handleCreateNote}
        onNoteClick={handleNoteClick}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />

      {showCreateModal && (
        <CohortNotesCreateController
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          cohortId={cohortId}
        />
      )}
    </>
  );
};

export default CohortNotesController;
