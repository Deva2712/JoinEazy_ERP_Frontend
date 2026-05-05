import { useEffect } from 'react';
import { courseService } from '../api/services/course.service';

export const useAutoArchive = () => {
  useEffect(() => {
    // Check for expired courses on mount
    const checkExpiredCourses = async () => {
      try {
        console.log("🕐 Checking for expired courses...");
        const response = await courseService.checkAndArchiveExpiredCourses();
        
        if (response.success && response.data.archivedCount > 0) {
          console.log(`✅ Auto-archived ${response.data.archivedCount} course(s)`);
        }
      } catch (error) {
        console.error("❌ Error checking expired courses:", error);
      }
    };

    checkExpiredCourses();

    // Check every hour (3600000ms)
    const interval = setInterval(checkExpiredCourses, 3600000);

    return () => clearInterval(interval);
  }, []);
};