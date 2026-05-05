import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
  subMonths,
  addMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarCustom = ({ events = [], onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, date);
    });
  };

  const formatTime = (timeString) => {
    return timeString.replace(/:\d{2}\s/, " ");
  };

  return (
    <div className="bg-white border border-[#52586633] rounded-[20px] p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>

        <h2 className="text-lg font-semibold text-black">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          const dayEvents = getEventsForDate(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={index}
              onClick={() => onDateClick && onDateClick(day)}
              className={`
                min-h-[80px] p-1 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
                ${!isCurrentMonth ? "text-gray-300 bg-gray-50" : ""}
                ${isTodayDate ? "bg-blue-50 border-blue-200" : ""}
              `}
            >
              {/* Date Number */}
              <div
                className={`
                  text-sm font-medium mb-1 text-center
                  ${isTodayDate ? "text-blue-600 font-bold" : ""}
                  ${!isCurrentMonth ? "text-gray-400" : "text-gray-900"}
                `}
              >
                {format(day, "d")}
              </div>

              {/* Events for this date */}
              {isCurrentMonth && (
                <div className="space-y-1">
                  {dayEvents.slice(0, 4).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="flex justify-between items-center text-xs"
                      title={`${event.title} - ${event.startTime}`}
                    >
                      <div className="font-medium truncate text-xs text-gray-800 flex-1">
                        {event.title}
                      </div>
                      <div className="font-medium text-gray-800 text-xs ml-1 whitespace-nowrap">
                        {formatTime(event.startTime)}
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 4 && (
                    <div className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1 text-center">
                      +{dayEvents.length - 4} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarCustom;
