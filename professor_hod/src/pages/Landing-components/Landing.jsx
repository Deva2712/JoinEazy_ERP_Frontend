import React, { useEffect, useState } from "react";
import { Header, Footer } from "../hero";

// Import section components
import HeroSection from "./HeroSection";
import UseCasesSection from "./UseCasesSection";
import WhyChooseSection from "./WhyChooseSection";
import AboutSection from "./AboutSection";
import TeamSection from "./TeamSection";
import FAQSection from "./FAQSection";

const Landing = () => {
  const [mounted, setMounted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  
  // Interactive Hero States
  const [teamMembers, setTeamMembers] = useState([]);
  const [hoveredMember, setHoveredMember] = useState(null);

  // Dashboard Animation
  const [chartHeights, setChartHeights] = useState([60, 80, 70, 90, 75]);
  
  // Why Choose Section - Animated Collaboration Visualizer
  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Typing Animation for Why JoinEazy heading
  const [typedText, setTypedText] = useState('');
  const fullText = 'Why JoinEazy?';
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.title = "Home";

    // Animate dashboard chart bars
    const chartInterval = setInterval(() => {
      setChartHeights(prev => prev.map(() => Math.random() * 50 + 50));
    }, 2000);

    // Typing animation observer for Why JoinEazy section
    const typingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTypingComplete) {
            let currentIndex = 0;
            const typingInterval = setInterval(() => {
              if (currentIndex <= fullText.length) {
                setTypedText(fullText.slice(0, currentIndex));
                currentIndex++;
              } else {
                clearInterval(typingInterval);
                setIsTypingComplete(true);
              }
            }, 100);
          }
        });
      },
      { threshold: 0.3 }
    );

    const whySection = document.getElementById('why-choose');
    if (whySection) {
      typingObserver.observe(whySection);
    }

    // Animated Collaboration Visualizer
    const connectionInterval = setInterval(() => {
      const from = Math.floor(Math.random() * 4);
      const to = Math.floor(Math.random() * 4);
      if (from !== to) {
        const id = Date.now();
        setConnections(prev => [...prev, { id, from, to }]);
        setTimeout(() => {
          setConnections(prev => prev.filter(c => c.id !== id));
        }, 2000);
      }
    }, 1500);

    const messageInterval = setInterval(() => {
      const messageTypes = [
        { text: "Sarah joined study group", icon: "👥", color: "blue" },
        { text: "Teacher posted feedback", icon: "✏️", color: "green" },
        { text: "New hackathon team formed", icon: "🚀", color: "purple" },
        { text: "Assignment deadline updated", icon: "📅", color: "orange" },
        { text: "Mike requested to join team", icon: "🙋", color: "blue" },
        { text: "Project milestone achieved", icon: "🎯", color: "green" }
      ];
      
      const msg = messageTypes[Math.floor(Math.random() * messageTypes.length)];
      const id = Date.now();
      setMessages(prev => [...prev, { ...msg, id }]);
      
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== id));
      }, 3000);
    }, 2000);

    return () => {
      clearInterval(chartInterval);
      clearInterval(connectionInterval);
      clearInterval(messageInterval);
      if (whySection) typingObserver.unobserve(whySection);
    };
  }, [isTypingComplete]);

  // Interactive Hero - Add Team Member
  const skillSets = [
    { name: "CS Student", color: "from-blue-500 to-blue-600", skills: ["React", "Python"] },
    { name: "Designer", color: "from-purple-500 to-purple-600", skills: ["Figma", "UI/UX"] },
    { name: "Researcher", color: "from-pink-500 to-pink-600", skills: ["Data", "Analysis"] },
    { name: "Mentor", color: "from-green-500 to-green-600", skills: ["Teaching", "Guide"] }
  ];

  const addTeamMember = () => {
    if (teamMembers.length >= 4) return;
    
    const newMember = skillSets[teamMembers.length];
    setTeamMembers([...teamMembers, newMember]);
  };

  const removeTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const whyChooseFeatures = [
    "Intuitive interface designed for students and educators",
    "Real-time collaboration for seamless academic teamwork",
    "Smart analytics to track project progress and team performance"
  ];

  const faqs = [
    {
      question: "What is JoinEazy?",
      answer: "JoinEazy is a collaborative platform designed for students, teachers, and academic teams. We help you find teammates for hackathons, research projects, coursework, and extracurriculars - making team formation and collaboration effortless."
    },
    {
      question: "How does team matching work?",
      answer: "Our AI-powered system analyzes your skills, interests, courses, and academic goals to connect you with compatible teammates. Whether you need a coding partner for a hackathon or a research collaborator, we help you find the right fit."
    },
    {
      question: "Is JoinEazy free for students?",
      answer: "Yes! JoinEazy offers a free tier with access to all core features for students and educators. We also provide premium plans with advanced analytics and additional collaboration tools for larger teams and institutions."
    },
    {
      question: "What types of teams can I join?",
      answer: "JoinEazy supports hackathons, research projects, course assignments, startup teams, competitive programming groups, design projects, and any academic or extracurricular collaboration. You can find or create teams across all disciplines."
    }
  ];

  const scrollToFAQ = () => {
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Sticky Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        hoveredMember={hoveredMember}
        setHoveredMember={setHoveredMember}
        chartHeights={chartHeights}
        scrollToFAQ={scrollToFAQ}
        addTeamMember={addTeamMember}
        removeTeamMember={removeTeamMember}
      />

      {/* About Section */}
      <AboutSection />

      {/* Why Choose Section */}
      <WhyChooseSection
        typedText={typedText}
        isTypingComplete={isTypingComplete}
        whyChooseFeatures={whyChooseFeatures}
        connections={connections}
        messages={messages}
      />

      {/* Use Cases Section */}
      <UseCasesSection />

      {/* Team Section */}
      <TeamSection />

      {/* FAQ Section */}
      <FAQSection
        faqs={faqs}
        activeAccordion={activeAccordion}
        setActiveAccordion={setActiveAccordion}
      />

      <Footer />

      {/* Global Styles */}
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;