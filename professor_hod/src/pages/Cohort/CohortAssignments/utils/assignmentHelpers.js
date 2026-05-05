// Assignment Helper Functions

// Format date to MM-DD-YYYY
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

// Format time to 12-hour format
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

// Truncate HTML description to specified length
export const truncateDescription = (description, maxLength = 30) => {
  if (!description) return { truncated: '', needsTruncation: false };
  
  // Strip HTML tags to get plain text
  const textContent = description.replace(/<[^>]*>/g, '');
  
  if (textContent.length <= maxLength) {
    return { truncated: textContent, needsTruncation: false };
  }
  
  return {
    truncated: textContent.substring(0, maxLength) + '...',
    needsTruncation: true
  };
};

// Get mock submissions for an assignment (for demo purposes)
export const getMockSubmissions = (assignment) => {
  if (assignment.type === 'group') {
    return [
      {
        groupId: 1,
        groupName: "Team Alpha",
        submittedAt: "2026-01-15T18:30:00Z",
        members: [
          { name: "Alice Johnson", isLeader: true },
          { name: "Bob Smith", isLeader: false },
          { name: "Charlie Lee", isLeader: false },
        ]
      },
      {
        groupId: 2,
        groupName: "Team Beta",
        submittedAt: "2026-01-16T10:20:00Z",
        members: [
          { name: "David Kim", isLeader: true },
          { name: "Eva Green", isLeader: false },
        ]
      },
    ];
  } else {
    return [
      { studentName: "Frank Hall", submittedAt: "2026-01-14T15:45:00Z" },
      { studentName: "Grace Miller", submittedAt: "2026-01-15T09:30:00Z" },
      { studentName: "Hannah Scott", submittedAt: "2026-01-15T14:20:00Z" },
    ];
  }
};

// Filter assignments based on search query and type filter
export const filterAssignments = (assignments, searchQuery, typeFilter) => {
  return assignments.filter(assignment => {
    const assignmentName = assignment.name || assignment.title || assignment.assignment_name;
    const matchesSearch = assignmentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || assignment.type === typeFilter;
    return matchesSearch && matchesType;
  });
};