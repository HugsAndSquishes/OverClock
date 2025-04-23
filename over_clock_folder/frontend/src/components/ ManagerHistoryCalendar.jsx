import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./ManagerHistoryCalendar.css";
import { apiFetch, ENDPOINTS } from "../utils/api";

const localizer = momentLocalizer(moment);

export default function ManagerHistoryCalendar() {
  const [events, setEvents] = useState([]);
  const [workedDates, setWorkedDates] = useState(new Set());
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Use apiFetch instead of direct fetch
    apiFetch(ENDPOINTS.HISTORY)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Process the data: Group employees by date
        const eventsByDate = {};
        const datesWithWork = new Set(); // Track dates that have work entries

        // Ensure data is an array before iterating
        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          setEvents([]); // Set empty events if data format is wrong
          setWorkedDates(new Set());
          return; // Exit if data is not an array
        }

        data.forEach((rec) => {
          // Ensure record has necessary fields
          if (!rec.day || !rec.employee_name) {
              console.warn("Skipping record due to missing 'day' or 'employee_name':", rec);
              return;
          }

          const dayStr = moment(rec.day).format('YYYY-MM-DD'); // Normalize date format
          datesWithWork.add(dayStr); // Mark this date as having work

          if (!eventsByDate[dayStr]) {
            eventsByDate[dayStr] = {
              start: moment(rec.day).toDate(), // Use moment to ensure correct date object
              end: moment(rec.day).toDate(),
              allDay: true,
              employees: new Set(), // Use a Set to avoid duplicate names per day
            };
          }
          eventsByDate[dayStr].employees.add(rec.employee_name); // Add employee name
        });

        // Convert the grouped data into the event format for the calendar
        const processedEvents = Object.values(eventsByDate).map(eventData => ({
          title: Array.from(eventData.employees).join(', '), // Comma-separated list of names
          start: eventData.start,
          end: eventData.end,
          allDay: eventData.allDay,
        }));

        setEvents(processedEvents);
        setWorkedDates(datesWithWork); // Store the set of dates with work
      })
      .catch((err) => console.error("Attendance fetch error:", err));
  }, []); // Empty dependency array means this runs once on mount

  // --- Custom Day Cell Styling ---
  const dayPropGetter = (date) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    if (workedDates.has(dateString)) {
      // Apply a class for worked days
      return {
        className: 'worked-day', // Use CSS class for better styling control
        // Or apply inline style:
        // style: {
        //   backgroundColor: 'lightgreen',
        // },
      };
    }
    // No special style for days without work
    return {};
  };

  // --- Optional: Custom Event Styling ---
   const eventPropGetter = (event) => ({
     style: {
        // Keep your original event block styling or modify as needed
       backgroundColor: "#a37a4f", // Slightly darker shade maybe?
       color: 'white',
       borderRadius: "4px",
       border: 'none',
       fontSize: '0.8em', // Make text slightly smaller if needed
       padding: '2px 4px',
     }
   });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">
      {/* Increased max-w-4xl for potentially wider calendar view */}
      <div className="p-8 w-full max-w-4xl mx-4 bg-gray-700 rounded-2xl shadow-xl border border-gray-600">
        <h2 className="text-center text-3xl font-bold text-[#c98c52] mb-6">
          Employee Workday Calendar
        </h2>

        {/* Ensure calendar container has enough height */}
        <div className="h-[75vh] text-white"> {/* Added text-white for better contrast */}
          <Calendar
            localizer={localizer}
            events={events}
            date={currentDate}
            onNavigate={setCurrentDate}
            defaultView="month"
            views={["month"]}
            dayPropGetter={dayPropGetter} // Apply custom styling to day cells
            eventPropGetter={eventPropGetter} // Optional: Apply custom styling to event blocks
            // Removed className="rbc-alternate" unless specifically desired
            // Consider adding popup={true} for better viewing of long employee lists on a day
            popup
          />
        </div>
      </div>
    </div>
  );
}