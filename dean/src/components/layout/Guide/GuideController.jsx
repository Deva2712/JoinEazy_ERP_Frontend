import React from "react";
import { useNavigate } from "react-router-dom";
import GuideUI from "./GuideUI";
import { useAuth } from "../../../context/AuthContext";

const GuideController = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isProfessor = user?.role === 'professor';

  const handleQuickAction = (action) => {
    switch(action) {
      case 'create-course':
        navigate('/create');
        break;
      case 'import-students':
        // Navigate to a course first or open import modal
        navigate('/dashboard');
        break;
      case 'view-reports':
      case 'view-assignments':
        navigate('/dashboard');
        break;
      case 'contact-support':
        // You can add a support page route or open a modal
        window.location.href = 'mailto:support@joineazy.com';
        break;
      default:
        navigate('/dashboard');
    }
  };

  const professorGuideData = {
    title: "Professor Guide",
    subtitle: "Everything you need to know to effectively manage your courses and students",
    sections: [
      {
        id: "getting-started",
        title: "Getting Started",
        icon: "🚀",
        items: [
          {
            title: "Understanding the Dashboard",
            description: "Navigate your professor dashboard to view all your courses and statistics",
            steps: [
              "View the welcome banner showing your name and total courses",
              "Check statistics cards: Total Courses, Active Courses, and Organization",
              "Filter courses by clicking Active Courses or Inactive Courses cards",
              "Click 'Create Course' button in the top right to start a new course",
              "Click 'View Course' on any course card to access course details"
            ]
          },
          {
            title: "Creating Your First Course",
            description: "Set up a new course with all necessary details and configuration",
            steps: [
              "Click the 'Create Course' button from the dashboard",
              "Enter course name and description",
              "Set course visibility (Active/Inactive/Private)",
              "Configure group settings (min/max members per group)",
              "Add external course URL if needed",
              "Click 'Create' to finalize your course"
            ]
          },
          {
            title: "Navigating Course Tabs",
            description: "Understand the main sections available in each course",
            steps: [
              "Details: View and edit course information and custom sections",
              "Members: Manage students, create groups, and view profiles",
              "Assignments: Create, edit, and grade assignments",
              "Materials: Share links and resources with students"
            ]
          }
        ]
      },
            {
        id: "course-management",
        title: "Course Settings & Management",
        icon: "⚙️",
        items: [
          {
            title: "Editing Course Settings",
            description: "Modify course details, visibility, and configuration",
            steps: [
              "Open your course and click 'Course Settings' button in the header",
              "Update course name, description, or external URL",
              "Change course visibility (Active/Inactive/Private)",
              "Adjust group settings (min/max members)",
              "Enable or disable project features",
              "Click 'Save Changes' to apply updates"
            ]
          },
          {
            title: "Importing Participants",
            description: "Bulk add students to your course using CSV file",
            steps: [
              "Go to Course Settings",
              "Click 'Import Participants' button",
              "Prepare a CSV file with student email addresses",
              "Select the CSV file from your computer",
              "Review the import preview",
              "Confirm to add all students to the course"
            ]
          },
          {
            title: "Managing Course Visibility",
            description: "Control who can see and access your course",
            steps: [
              "Open Course Settings",
              "Select visibility option: Active (visible to all), Inactive (archived), or Private (invitation only)",
              "Active courses appear in student searches",
              "Inactive courses are hidden but data is preserved",
              "Save changes to apply new visibility settings"
            ]
          },
          {
            title: "Deleting a Course",
            description: "Permanently remove a course and all its data",
            steps: [
              "Open Course Settings",
              "Scroll to the bottom and click 'Delete Course'",
              "Confirm deletion by typing the course name",
              "Note: This action cannot be undone",
              "All course data, assignments, and grades will be permanently deleted"
            ]
          }
        ]
      },
      {
        id: "communication",
        title: "Communication Tools",
        icon: "💬",
        items: [
          {
            title: "Announcements",
            description: "Keep your students informed with course announcements",
            steps: ["Create new announcement", "Select target audience", "Schedule or publish immediately", "Monitor engagement"]
          },
          {
            title: "Discussion Forums",
            description: "Facilitate student discussions and Q&A sessions",
            steps: ["Set up discussion topics", "Moderate conversations", "Encourage participation", "Archive old discussions"]
          },
          {
            title: "Office Hours",
            description: "Manage virtual office hours and student appointments",
            steps: ["Set available time slots", "Allow student booking", "Conduct virtual meetings", "Track consultation history"]
          }
        ]
      },
      {
        id: "course-details",
        title: "Course Details & Customization",
        icon: "📋",
        items: [
          {
            title: "Adding Custom Sections",
            description: "Create custom information sections for your course details page",
            steps: [
              "Navigate to the Details tab in your course",
              "Click 'Add New Section' button",
              "Enter a title for your section (e.g., 'Syllabus', 'Prerequisites')",
              "Use the rich text editor to add formatted content",
              "Click 'Save' to publish the section",
              "Sections appear in the order they were created"
            ]
          },
          {
            title: "Editing Existing Sections",
            description: "Update or modify custom course detail sections",
            steps: [
              "Go to the Details tab",
              "Click the 'Edit' icon on any section card",
              "Modify the title or content using the rich text editor",
              "Click 'Save' to update the section",
              "Changes are immediately visible to students"
            ]
          },
          {
            title: "Sharing Your Course",
            description: "Generate a shareable link for your course page",
            steps: [
              "Navigate to the Details tab",
              "Find the 'Share this Page' option in quick details",
              "Click to copy the course URL to clipboard",
              "Share the link with students or colleagues",
              "Students can use this link to join the course"
            ]
          }
        ]
      },
          {
        id: "members-management",
        title: "Members & Groups",
        icon: "👥",
        items: [
          {
            title: "Viewing Course Members",
            description: "See all students enrolled in your course",
            steps: [
              "Navigate to the Members tab",
              "View list of all enrolled students",
              "See member details: name, email, and profile picture",
              "Use search bar to find specific students",
              "Sort members by name or enrollment date"
            ]
          },
          {
            title: "Creating Student Groups",
            description: "Organize students into groups for collaborative work",
            steps: [
              "Go to the Members tab",
              "Click 'Create Group' button",
              "Enter a group name and optional project name",
              "Select students to add to the group (respect min/max limits)",
              "Click 'Create Group' to finalize",
              "Groups appear in the groups view with member count"
            ]
          },
          {
            title: "Managing Groups",
            description: "Edit group membership and view group details",
            steps: [
              "Switch to 'Groups' view in the Members tab",
              "Click on any group card to view details",
              "Add or remove members from the group",
              "Edit group name or project name",
              "View group assignments and grades",
              "Delete groups if needed"
            ]
          },
          {
            title: "Viewing Member Profiles",
            description: "Access detailed information about individual students",
            steps: [
              "Click on any student name in the Members tab",
              "View student profile with contact information",
              "See student's group membership",
              "Check assignment submission status",
              "View grades and feedback history",
              "Close profile to return to members list"
            ]
          },
          {
            title: "Exporting Member Data",
            description: "Download member list with grades and information",
            steps: [
              "Go to the Members tab",
              "Click 'Export Members' button",
              "Select export format (CSV recommended)",
              "Choose data to include: names, emails, grades, groups",
              "Download the generated file",
              "Open in Excel or Google Sheets for analysis"
            ]
          },
          {
            title: "Grading Students",
            description: "Assign grades and feedback to student assignments",
            steps: [
              "Navigate to Members tab and switch to 'Grading' view",
              "Select an assignment from the dropdown",
              "Click on a student to open grading interface",
              "Enter score and optional feedback comments",
              "Click 'Submit Grade' to save",
              "Grades are immediately visible to students"
            ]
          },
          {
            title: "Removing Members",
            description: "Remove students from your course",
            steps: [
              "Go to the Members tab",
              "Find the student you want to remove",
              "Click the remove/delete icon next to their name",
              "Confirm the removal action",
              "Student will lose access to course materials",
              "Their data is preserved but they cannot submit new work"
            ]
          }
        ]
      },
      {
        id: "assignments",
        title: "Assignments Management",
        icon: "📝",
        items: [
          {
            title: "Creating Assignments",
            description: "Design and publish assignments for your students",
            steps: [
              "Navigate to the Assignments tab",
              "Click 'Create Assignment' button",
              "Enter assignment title and description",
              "Use rich text editor to format instructions",
              "Set due date and time",
              "Set maximum points/score",
              "Choose assignment type (Individual or Group)",
              "Click 'Create' to publish the assignment"
            ]
          },
          {
            title: "Editing Assignments",
            description: "Modify existing assignment details and settings",
            steps: [
              "Go to the Assignments tab",
              "Find the assignment you want to edit",
              "Click the 'Edit' icon on the assignment card",
              "Update title, description, due date, or points",
              "Click 'Save Changes' to apply updates",
              "Students will see the updated information"
            ]
          },
          {
            title: "Viewing Submissions",
            description: "Review student submissions for assignments",
            steps: [
              "Navigate to the Assignments tab",
              "Click on an assignment to view details",
              "See submission count and status",
              "Click 'View Submissions' to see all student work",
              "Review individual submissions",
              "Grade directly from the submissions view"
            ]
          },
          {
            title: "Deleting Assignments",
            description: "Remove assignments from your course",
            steps: [
              "Go to the Assignments tab",
              "Find the assignment to delete",
              "Click the delete/trash icon",
              "Confirm deletion in the popup",
              "Note: This will delete all submissions and grades",
              "This action cannot be undone"
            ]
          },
          {
            title: "Marking Submissions",
            description: "Acknowledge and track student submissions",
            steps: [
              "Open an assignment from the Assignments tab",
              "View the submissions list",
              "Click 'Mark as Submitted' for students who completed work",
              "Track submission status for all students",
              "Use this to monitor assignment completion rates"
            ]
          }
        ]
      },
      {
        id: "materials",
        title: "Course Materials",
        icon: "📚",
        items: [
          {
            title: "Adding Resource Links",
            description: "Share external links and resources with students",
            steps: [
              "Navigate to the Materials tab",
              "Click 'Add Material' or 'Upload' button",
              "Select 'Add Link' option",
              "Enter link name/title",
              "Paste the URL (YouTube, Google Drive, websites, etc.)",
              "Add optional description",
              "Select a category (Lecture Notes, Assignments, References, etc.)",
              "Click 'Add' to publish the resource"
            ]
          },
          {
            title: "Organizing Materials",
            description: "Categorize and structure your course resources",
            steps: [
              "Go to the Materials tab",
              "Use categories to group similar materials",
              "Common categories: Lecture Notes, Assignments, References, Lab Materials",
              "Materials are displayed by category",
              "Students can filter by category to find resources easily"
            ]
          },
          {
            title: "Tracking Material Usage",
            description: "Monitor how students interact with course materials",
            steps: [
              "Navigate to the Materials tab",
              "View click count on each material card",
              "Higher click counts indicate popular resources",
              "Use this data to understand which materials are most useful",
              "Consider adding similar resources for high-engagement topics"
            ]
          },
          {
            title: "Deleting Materials",
            description: "Remove outdated or incorrect resources",
            steps: [
              "Go to the Materials tab",
              "Find the material you want to remove",
              "Click the delete/trash icon on the material card",
              "Confirm deletion",
              "Material is immediately removed from student view"
            ]
          }
        ]
      },
      {
        id: "data-management",
        title: "Data & Export",
        icon: "💾",
        items: [
          {
            title: "Exporting Member Data",
            description: "Download comprehensive member and grade information",
            steps: [
              "Navigate to the Members tab",
              "Click 'Export Members' button in the top right",
              "Select export format (CSV or Excel)",
              "Choose data fields to include",
              "Download the file to your computer",
              "Open in spreadsheet software for analysis"
            ]
          },
          {
            title: "Importing Students via CSV",
            description: "Bulk add multiple students at once",
            steps: [
              "Open Course Settings",
              "Click 'Import Participants'",
              "Prepare CSV file with columns: email, name (optional)",
              "Upload the CSV file",
              "Review the preview of students to be added",
              "Confirm import to add all students",
              "Students receive course invitation emails"
            ]
          }
        ]
      }
    ],
    quickActions: [
      {
        title: "Create New Course",
        description: "Start a new course from scratch",
        icon: "➕",
        action: "create-course"
      },
      {
        title: "Import Students",
        description: "Bulk import students via CSV",
        icon: "📥",
        action: "import-students"
      },
      {
        title: "View Progress",
        description: "Access detailed analytics",
        icon: "📈",
        action: "view-progress"
      },
      {
        title: "Contact Support",
        description: "Get help from our team",
        icon: "🆘",
        action: "contact-support"
      }
    ],
    faqs: [
      {
        question: "How do I add students to my course?",
        answer: "You can add students in two ways: 1) Import multiple students at once using a CSV file via Course Settings > Import Participants, or 2) Students can join using the course share link from the Details tab."
      },
      {
        question: "Can I create groups for students?",
        answer: "Yes! Go to the Members tab, click 'Create Group', enter a group name, select students (respecting min/max limits set in course settings), and click 'Create Group'. You can also assign group-based assignments."
      },
      {
        question: "How do I grade assignments?",
        answer: "Navigate to Members tab > Grading view, select an assignment, click on a student, enter their score and feedback, then click 'Submit Grade'. You can also grade from the Assignments tab by viewing submissions."
      },
      {
        question: "What types of materials can I share?",
        answer: "Currently, you can share external links to resources like YouTube videos, Google Drive files, websites, and other online materials. Add them via the Materials tab and organize by category."
      },
      {
        question: "How do I export student grades?",
        answer: "Go to the Members tab and click 'Export Members'. Select CSV format and choose to include grades. The exported file will contain student information along with their assignment scores."
      },
      {
        question: "Can I edit a course after creating it?",
        answer: "Yes! Click 'Course Settings' in the course header to edit the course name, description, visibility, group settings, and external URL. Changes are saved immediately."
      },
      {
        question: "How do I make a course inactive?",
        answer: "Open Course Settings, change the visibility to 'Inactive', and save. Inactive courses are archived and won't appear in student searches, but all data is preserved."
      },
      {
        question: "What happens when I delete an assignment?",
        answer: "Deleting an assignment permanently removes it along with all student submissions and grades. This action cannot be undone, so make sure to export any important data first."
      },
      {
        question: "How can I customize my course details page?",
        answer: "Go to the Details tab and click 'Add New Section'. You can create custom sections with titles and rich text content to add syllabi, prerequisites, schedules, or any other course information."
      },
      {
        question: "Can I track which materials students are viewing?",
        answer: "Yes! Each material in the Materials tab shows a click count, indicating how many times students have accessed that resource. This helps you understand which materials are most useful."
      }
    ]
  };

  const studentGuideData = {
    title: "Student Guide",
    subtitle: "Everything you need to know to succeed in your courses",
    sections: [
      {
        id: "getting-started",
        title: "Getting Started",
        icon: "🚀",
        items: [
          {
            title: "Understanding Your Dashboard",
            description: "Navigate your student dashboard to view all enrolled courses and track your progress",
            steps: [
              "View the welcome banner showing your name and total enrolled courses",
              "Check Active Courses and Inactive Courses cards to see your enrollment status",
              "Click on Active Courses or Inactive Courses to filter your course list",
              "See your organization name in the third statistics card",
              "Click 'View Course' on any course card to access course content",
              "Click 'Assignments' button for quick access to course assignments"
            ]
          },
          {
            title: "Joining a Course",
            description: "Enroll in courses using invitation links from your instructor",
            steps: [
              "Receive course invitation link from your professor via email or message",
              "Click on the invitation link",
              "You'll be redirected to the course join page",
              "Confirm to join the course",
              "Course will appear in your dashboard under Active Courses",
              "Access the course by clicking 'View Course'"
            ]
          },
          {
            title: "Navigating Course Tabs",
            description: "Understand the different sections available in each course",
            steps: [
              "Details: View course information, syllabus, and important announcements",
              "Members: See classmates and your group membership",
              "Assignments: View and submit all course assignments",
              "Materials: Access course resources, links, and study materials",
              "Check the pending assignments counter in the course header"
            ]
          }
        ]
      },
      {
        id: "materials",
        title: "Course Materials & Resources",
        icon: "📚",
        items: [
          {
            title: "Accessing Course Materials",
            description: "Find and view all course resources shared by your professor",
            steps: [
              "Navigate to the Materials tab in your course",
              "Browse materials organized by category",
              "Common categories: Lecture Notes, References, Lab Materials",
              "Click on any material link to open it in a new tab",
              "Materials may include YouTube videos, Google Drive files, websites",
              "Bookmark important resources for quick access"
            ]
          },
          {
            title: "Viewing Materials by Category",
            description: "Filter materials to find specific types of resources",
            steps: [
              "Materials are grouped by category for easy navigation",
              "Look for category labels on material cards",
              "Categories help you find lecture notes, assignments, or references quickly",
              "Each material shows its name, description, and click count",
              "Access materials anytime during the course"
            ]
          }
        ]
      },
      {
        id: "communication",
        title: "Communication Tools",
        icon: "💬",
        items: [
          {
            title: "Reading Announcements",
            description: "Stay updated with course announcements",
            steps: ["Check notifications regularly", "Read course announcements", "Mark important updates", "Enable notification alerts"]
          },
          {
            title: "Participating in Discussions",
            description: "Engage with classmates and professors",
            steps: ["Join discussion forums", "Post questions and comments", "Reply to peer discussions", "Follow discussion etiquette"]
          },
          {
            title: "Contacting Your Professor",
            description: "Communicate with your professor effectively",
            steps: ["Use in-app messaging", "Book office hours", "Ask questions respectfully", "Check response times"]
          }
        ]
      },
      {
        id: "assignments",
        title: "Viewing & Submitting Assignments",
        icon: "📝",
        items: [
          {
            title: "Finding Your Assignments",
            description: "Locate and view all assignments for your courses",
            steps: [
              "Navigate to the Assignments tab in your course",
              "Assignments are sorted by deadline (earliest first)",
              "See assignment name, type (Individual/Group), and deadline",
              "Check the marks/points for each assignment",
              "Look for 'Overdue' badges on assignments past their deadline",
              "Use the pending assignments counter in course header for quick overview"
            ]
          },
          {
            title: "Understanding Assignment Types",
            description: "Learn the difference between individual and group assignments",
            steps: [
              "Individual assignments: You submit on your own",
              "Group assignments: Only your group leader can submit",
              "Blue badge indicates Individual assignment",
              "Purple badge indicates Group assignment",
              "For group assignments, you must be in a group to submit",
              "Check your group membership in the Members tab"
            ]
          },
          {
            title: "Viewing Assignment Details",
            description: "Read complete assignment instructions and requirements",
            steps: [
              "Click 'View Details' button on any assignment card",
              "Read the full assignment description",
              "Note the assignment type (Individual or Group)",
              "Check the deadline date and time",
              "Review marks/points if specified",
              "Close the modal when done reading"
            ]
          },
          {
            title: "Submitting Individual Assignments",
            description: "Complete and submit your individual assignments",
            steps: [
              "Click the 'Link' button to open the submission form (Google Forms, etc.)",
              "Complete your work in the external submission platform",
              "Return to the course assignments page",
              "Click the 'Submit' button on the assignment card",
              "Confirm your submission",
              "You'll see 'Submitted on [date] at [time]' confirmation"
            ]
          },
          {
            title: "Submitting Group Assignments",
            description: "Understand group assignment submission rules",
            steps: [
              "Ensure you are part of a group (check Members tab)",
              "Only the group leader can submit group assignments",
              "If you're the leader, click 'Link' to access submission form",
              "Complete the group work on the external platform",
              "Return and click 'Submit' to mark as submitted",
              "All group members will see the submission status",
              "If you're not the leader, you'll see 'Only leader can submit'"
            ]
          },
          {
            title: "Late Submissions",
            description: "Submit assignments after the deadline has passed",
            steps: [
              "Assignments marked 'Overdue' can still be submitted",
              "The system allows late submissions",
              "Click 'Link' to access the submission form",
              "Complete your work as usual",
              "Click 'Submit' to mark as submitted",
              "Note: Your professor may apply late penalties"
            ]
          },
          {
            title: "Tracking Submission Status",
            description: "Monitor which assignments you've completed",
            steps: [
              "Submitted assignments show green 'Submitted on [date]' badge",
              "Pending assignments show 'Submit' button",
              "For group assignments, check if your group has submitted",
              "Use the pending assignments counter in course header",
              "Review all assignments to ensure nothing is missed"
            ]
          }
        ]
      },
            {
        id: "groups",
        title: "Groups & Collaboration",
        icon: "👥",
        items: [
          {
            title: "Viewing Your Group",
            description: "Check your group membership and group details",
            steps: [
              "Navigate to the Members tab",
              "Switch to 'Groups' view if available",
              "Find your group in the list",
              "Click on your group to view group members",
              "See your group's project name if assigned",
              "Note who the group leader is"
            ]
          },
          {
            title: "Understanding Group Assignments",
            description: "Learn how group assignments work",
            steps: [
              "Group assignments require you to be in a group",
              "Only the group leader can submit group assignments",
              "All group members see the same submission status",
              "If not in a group, you'll see 'Not in a group' message",
              "Contact your professor if you need to join a group",
              "Collaborate with group members outside the platform"
            ]
          },
          {
            title: "Viewing Course Members",
            description: "See all students enrolled in your course",
            steps: [
              "Go to the Members tab",
              "View list of all enrolled students",
              "See member names and profile pictures",
              "Use search to find specific classmates",
              "View individual member profiles by clicking on names",
              "Check which groups other students are in"
            ]
          }
        ]
      },
      {
        id: "course-info",
        title: "Course Information",
        icon: "📋",
        items: [
          {
            title: "Viewing Course Details",
            description: "Access important course information and announcements",
            steps: [
              "Navigate to the Details tab",
              "Read custom sections added by your professor",
              "Common sections: Syllabus, Prerequisites, Schedule, Grading Policy",
              "Check course creation date and organization",
              "View total member count",
              "Read course description and objectives"
            ]
          },
          {
            title: "Accessing External Course Resources",
            description: "Use external course URLs provided by your professor",
            steps: [
              "Check the course header for 'Course URL' section",
              "Click on the external URL to open in new tab",
              "May link to course website, LMS, or other platforms",
              "Bookmark important external resources",
              "Return to the platform for assignments and materials"
            ]
          },
          {
            title: "Tracking Pending Work",
            description: "Monitor your pending assignments and tasks",
            steps: [
              "Check the pending assignments counter in course header",
              "Shows number of assignments you haven't submitted yet",
              "Navigate to Assignments tab to see details",
              "Prioritize assignments by deadline",
              "Submit work before deadlines to avoid late penalties"
            ]
          },
          {
            title: "Viewing Professor Information",
            description: "See who is teaching your course",
            steps: [
              "Professor name appears in the course header",
              "Shown in parentheses next to course name",
              "Contact professor through provided channels",
              "Check course details for office hours or contact info"
            ]
          }
        ]
      },
      {
        id: "submissions-tab",
        title: "Submissions & Projects",
        icon: "📤",
        items: [
          {
            title: "Viewing Submission Opportunities",
            description: "Access the Submissions tab for project work",
            steps: [
              "Navigate to the Submissions tab (if available)",
              "View all submission opportunities",
              "Check submission deadlines and requirements",
              "See submission status (open/closed)",
              "Track your submission count",
              "Submit project work through provided links"
            ]
          },
          {
            title: "Submitting Project Work",
            description: "Upload and submit your project deliverables",
            steps: [
              "Find the relevant submission in the Submissions tab",
              "Check if submission is for Individual or Group",
              "Click on the submission to view details",
              "Read submission instructions carefully",
              "Use provided link to submit your work",
              "Confirm submission before deadline"
            ]
          }
        ]
      }
    ],
    quickActions: [
      {
        title: "View Assignments",
        description: "Check pending assignments",
        icon: "📝",
        action: "view-assignments"
      },
      {
        title: "Get Help",
        description: "Contact support team",
        icon: "🆘",
        action: "contact-support"
      }
    ],
    faqs: [
{
        question: "How do I join a course?",
        answer: "You need an invitation link from your professor. Click the link, confirm to join, and the course will appear in your dashboard under Active Courses."
      },
      {
        question: "Can I submit assignments after the deadline?",
        answer: "Yes, the system allows late submissions. However, your professor may apply late penalties. Assignments marked 'Overdue' can still be submitted using the same process."
      },
      {
        question: "Why can't I submit a group assignment?",
        answer: "For group assignments, only the group leader can submit. If you see 'Only leader can submit', ask your group leader to submit the work. If you see 'Not in a group', contact your professor to join a group."
      },
      {
        question: "Where do I find course materials?",
        answer: "Navigate to the Materials tab in your course. Materials are organized by categories like Lecture Notes, References, and Lab Materials. Click on any material to open it in a new tab."
      },
      {
        question: "How do I know which assignments are pending?",
        answer: "Check the pending assignments counter in the course header. You can also go to the Assignments tab to see all assignments sorted by deadline, with clear indicators for submitted and pending work."
      },
      {
        question: "What's the difference between individual and group assignments?",
        answer: "Individual assignments (blue badge) are submitted by you alone. Group assignments (purple badge) require you to be in a group, and only the group leader can submit for the entire group."
      },
      {
        question: "How do I submit an assignment?",
        answer: "Click the 'Link' button to access the submission form (usually Google Forms or similar). Complete your work there, then return to the course and click 'Submit' to mark it as submitted."
      },
      {
        question: "Can I see who else is in my course?",
        answer: "Yes! Go to the Members tab to see all enrolled students. You can search for specific classmates and view their profiles. You can also see which groups other students are in."
      },
      {
        question: "How do I check my group membership?",
        answer: "Navigate to the Members tab and switch to 'Groups' view. Find your group in the list and click on it to see all group members and your group's project name."
      },
      {
        question: "What if I can't access a course material link?",
        answer: "Make sure you're clicking on the material to open it in a new tab. If the link doesn't work, contact your professor as they may need to update the resource or check permissions."
      }
    ]
  };

  const guideData = isProfessor ? professorGuideData : studentGuideData;

  return (
    <GuideUI 
      guideData={guideData}
      onQuickAction={handleQuickAction}
    />
  );
};

export default GuideController;