import React, { useState, useEffect } from "react";
import CohortLeaderboardUI from "./CohortLeaderboardUI";
import { cohortService } from "../../../api/services/cohort.service";

// Function to determine medal type based on rank
const getMedalType = (rank) => {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return null;
};

const CohortLeaderboardController = ({ cohortId, cohortData }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [activeTab, setActiveTab] = useState("individual");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leaderboard data from API
  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API to get leaderboard data
      const response = await cohortService.getLeaderboard(cohortId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch leaderboard data');
      }
      
      // Use the response data from the API
      const { data } = response;
      
      // Process the individuals data - add medal types
      const individualsWithMedals = data.individuals.map(individual => ({
        ...individual,
        medalType: getMedalType(individual.rank)
      }));
      
      // Process the groups data - add medal types
      const groupsWithMedals = data.groups.map(group => ({
        ...group,
        medalType: getMedalType(group.rank)
      }));
      
      // Set the leaderboard data
      setLeaderboardData(individualsWithMedals);
      setGroupData(groupsWithMedals);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError(err.message || 'Failed to load leaderboard data');
      setLoading(false);
      
      // Fallback to mock data in case of error
      const mockIndividuals = [
        {
          id: 1,
          rank: 1,
          name: "Arjun Mehta",
          description: "@se22uari034",
          points: 5877,
          profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
          medalType: "gold"
        },
        {
          id: 2,
          rank: 2,
          name: "Priya Sharma",
          description: "@se22uari128",
          points: 4369,
          profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
          medalType: "silver"
        },
        {
          id: 3,
          rank: 3,
          name: "Rohit Verma",
          description: "@se22uari089",
          points: 3661,
          profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
          medalType: "bronze"
        },
        {
          id: 4,
          rank: 4,
          name: "Sneha Patil",
          description: "@se22uari045",
          points: 2258,
          profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
          id: 5,
          rank: 5,
          name: "Vikram Iyer",
          description: "@se22uari172",
          points: 2136,
          profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
        },
        {
          id: 6,
          rank: 6,
          name: "Kavya Reddy",
          description: "@se22uari056",
          points: 2062,
          profileImage: "https://randomuser.me/api/portraits/women/3.jpg",
        },
        {
          id: 7,
          rank: 7,
          name: "Ankit Kumar Singh",
          description: "@se22uari201",
          points: 1890,
          profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
        },
        {
          id: 8,
          rank: 8,
          name: "Neha Priya Gupta",
          description: "@se22uari087",
          points: 1755,
          profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
        },
            {
              id: 9,
              rank: 9,
              name: "Siddharth Ramesh Nair",
              description: "@se22uari142",
              points: 1580,
              profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
            },
            {
              id: 10,
              rank: 10,
              name: "Ishita Ananya Das",
              description: "@se22uari065",
              points: 1492,
              profileImage: "https://randomuser.me/api/portraits/women/5.jpg",
            },
          ];
          
          const mockGroups = [
            {
              id: 1,
              rank: 1,
              name: "Group 1",
              description: "Project Phoenix • 8 Members",
              points: 8477,
              profileImage: "https://randomuser.me/api/portraits/lego/1.jpg",
              medalType: "gold"
            },
            {
              id: 2,
              rank: 2,
              name: "Group 2",
              description: "Code Crusaders • 6 Members",
              points: 7265,
              profileImage: "https://randomuser.me/api/portraits/lego/2.jpg",
              medalType: "silver"
            },
            {
              id: 3,
              rank: 3,
              name: "Group 3",
              description: "Byte Warriors • 10 Members",
              points: 6520,
              profileImage: "https://randomuser.me/api/portraits/lego/3.jpg",
              medalType: "bronze"
            },
            {
              id: 4,
              rank: 4,
              name: "Group 4",
              description: "Quantum Coders • 7 Members",
              points: 5900,
              profileImage: "https://randomuser.me/api/portraits/lego/4.jpg",
            },
            {
              id: 5,
              rank: 5,
              name: "Group 5",
              description: "Syntax Squad • 5 Members",
              points: 5300,
              profileImage: "https://randomuser.me/api/portraits/lego/5.jpg",
            },
            {
              id: 6,
              rank: 6,
              name: "Group 6",
              description: "Bug Smashers • 9 Members",
              points: 4782,
              profileImage: "https://randomuser.me/api/portraits/lego/6.jpg",
            },
            {
              id: 7,
              rank: 7,
              name: "Group 7",
              description: "Tech Titans • 4 Members",
              points: 4333,
              profileImage: "https://randomuser.me/api/portraits/lego/7.jpg",
            },
            {
              id: 8,
              rank: 8,
              name: "Group 8",
              description: "Alpha Coders • 6 Members",
              points: 3980,
              profileImage: "https://randomuser.me/api/portraits/lego/8.jpg",
            },
            {
              id: 9,
              rank: 9,
              name: "Group 9",
              description: "Dev Dynamos • 8 Members",
              points: 3520,
              profileImage: "https://randomuser.me/api/portraits/lego/9.jpg",
            },
            {
              id: 10,
              rank: 10,
              name: "Group 10",
              description: "Hack Street Boys • 7 Members",
              points: 3198,
              profileImage: "https://randomuser.me/api/portraits/lego/10.jpg",
            },
          ];
          
          // Set fallback data
          setLeaderboardData(mockIndividuals);
          setGroupData(mockGroups);
      }
      
  };

  // Function to retry fetching data
  const handleRetry = () => {
    fetchLeaderboardData();
  };

  useEffect(() => {
    if (cohortId) {
      fetchLeaderboardData();
    }
  }, [cohortId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleRefresh = () => {
    fetchLeaderboardData();
  };

  return (
    <CohortLeaderboardUI
      leaderboardData={leaderboardData}
      groupData={groupData}
      activeTab={activeTab}
      loading={loading}
      error={error}
      onTabChange={handleTabChange}
      onRefresh={handleRefresh}
    />
  );
};

export default CohortLeaderboardController;
