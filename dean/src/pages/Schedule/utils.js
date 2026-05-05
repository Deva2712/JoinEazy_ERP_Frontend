// Date formatting utilities
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' })
  };
};

export const formatTo12Hour = (time24) => {
		const [hours, minutes] = time24.split(":");
		const h = parseInt(hours, 10);
		const suffix = h >= 12 ? "PM" : "AM";
		const hour12 = h % 12 || 12;
		return `${hour12.toString().padStart(2, "0")}:${minutes} ${suffix}`;
	};

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const getDayName = (date, day) => {
  const d = new Date(date.getFullYear(), date.getMonth(), day);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
};

// Constants
export const WEEK_DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEK_DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];